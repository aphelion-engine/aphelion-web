// Collects every internal link and canonical path the site emits and reports
// the ones the router has no answer for. Run with `node scripts/check-links.mjs`
// from aphelion-web, after a `npm run build` has populated `.next`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SOURCE_DIRS = ["app", "components", "lib"];

// ---- 1. every internal link literal in the source -------------------------
const links = new Map(); // href -> Set(file)

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

  // href="/x", href={`/x`}, href={"/x"}
  for (const m of text.matchAll(/href=\{?["'`](\/[^"'`]*)["'`]/g)) add(m[1], rel);
  // path: "/x" inside pageMetadata/noIndexMetadata/breadcrumb builders
  for (const m of text.matchAll(/\bpath:\s*["'`](\/[^"'`]*)["'`]/g)) add(m[1], rel);
  // internalMarkdownLinks / DOCS constant hrefs
  for (const m of text.matchAll(/\bhref:\s*["'`](\/[^"'`]*)["'`]/g)) add(m[1], rel);
}

function add(href, file) {
  const clean = href.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";
  if (!links.has(clean)) links.set(clean, new Set());
  links.get(clean).add(file);
}

for (const dir of SOURCE_DIRS) walk(join(ROOT, dir));

// ---- 2. routes the build actually produced --------------------------------
// From .next/server/app: directories become routes; `page.js` sits in each.
const built = new Set();
const APP_SERVER = join(ROOT, ".next", "server", "app");

function collectRoutes(dir, urlPath) {
  let hasPage = false;
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (entry.startsWith("page.") || entry.startsWith("route.")) hasPage = true;
    else if (statSync(full).isDirectory()) collectRoutes(full, `${urlPath}/${entry}`);
  }
  if (hasPage) built.add(urlPath.replace(/\/+$/, "") || "/");
}

// Route groups `(foo)` do not appear in the URL.
function normaliseRoute(path) {
  const segments = path
    .split("/")
    .filter((seg) => seg && !(seg.startsWith("(") && seg.endsWith(")")));
  return segments.length ? "/" + segments.join("/") : "/";
}

for (const entry of readdirSync(APP_SERVER)) {
  const full = join(APP_SERVER, entry);
  if (statSync(full).isDirectory()) {
    collectRoutes(full, "/" + entry);
  } else if (/^(page|route)\./.test(entry)) {
    built.add("/");
  }
}

const routes = new Set([...built].map((r) => normaliseRoute(r)));

// Dynamic segments: /docs/[source]/[[...slug]] answers any /docs/... request
// we can resolve, so match those with a pattern instead of a literal.
const dynamicPatterns = [
  /^\/docs\/[^/]+(\/.*)?$/,
];

function isKnown(path) {
  if (routes.has(path)) return true;
  return dynamicPatterns.some((re) => re.test(path));
}

// ---- 3. report ------------------------------------------------------------
const static_ = [];
const dynamic = [];
for (const [href, files] of [...links].sort()) {
  const record = { href, files: [...files] };
  if (isKnown(href)) {
    if (routes.has(href)) static_.push(record);
    else dynamic.push(record);
  } else {
    record.files = record.files;
    static_.push({ ...record, unresolved: true });
  }
}

const broken = static_.filter((r) => r.unresolved);
console.log(`built routes: ${[...routes].sort().length}`);
console.log([...routes].sort().map((r) => "  " + r).join("\n"));
console.log(`\ninternal links found: ${links.size}`);
console.log(`  resolved literally : ${static_.filter((r) => !r.unresolved).length}`);
console.log(`  resolved dynamically: ${dynamic.length}`);
console.log(`  UNRESOLVED: ${broken.length}`);

for (const b of broken) {
  console.log(`\n  ${b.href}`);
  for (const f of b.files) console.log(`      ${f}`);
}

process.exitCode = broken.length ? 1 : 0;
