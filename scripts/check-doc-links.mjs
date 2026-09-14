// Cross-checks every deep /docs/... link written in the source against the
// slugs the docs loader actually resolves (the same list the sitemap emits).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

// --- deep doc links in source -------------------------------------------------
const deep = new Map();
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(tsx?|mjs)$/.test(entry)) scan(full);
  }
}
function scan(file) {
  const text = readFileSync(file, "utf8");
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  for (const m of text.matchAll(/["'`](\/docs\/[^"'`\s]+)["'`]/g)) {
    const clean = m[1].split("#")[0].replace(/\/+$/, "");
    if (!deep.has(clean)) deep.set(clean, new Set());
    deep.get(clean).add(rel);
  }
}
walk(join(ROOT, "app"));
walk(join(ROOT, "components"));
walk(join(ROOT, "lib"));

// --- doc URLs present in the built sitemap ------------------------------------
const sitemap = readFileSync(join(ROOT, ".next", "server", "app", "sitemap.xml.body"), "utf8");
const known = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, "").replace(/\/+$/, ""))
    .filter((p) => p.startsWith("/docs")),
);

console.log(`doc slugs in sitemap: ${known.size}`);
console.log(`deep /docs/... links in source: ${deep.size}\n`);

let bad = 0;
for (const [href, files] of [...deep].sort()) {
  const ok = known.has(href) || href === "/docs";
  if (!ok) bad++;
  console.log(`${ok ? "OK  " : "BAD "} ${href}${ok ? "" : "\n        " + [...files].join("\n        ")}`);
}
console.log(`\nunresolved: ${bad}`);
process.exitCode = bad ? 1 : 0;
