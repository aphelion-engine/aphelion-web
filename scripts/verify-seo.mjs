// Final verification against the built output: sitemap, robots, and the
// rendered HTML of the homepage and a documentation page.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const APP = join(ROOT, ".next", "server", "app");
const read = (p) => readFileSync(join(APP, p), "utf8");

const line = (t) => console.log("\n" + "=".repeat(72) + "\n" + t + "\n" + "=".repeat(72));

// ---------------------------------------------------------------- sitemap ---
line("sitemap.xml");
const sitemap = read("sitemap.xml.body");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`urls            : ${locs.length}`);
console.log(`root entry      : ${locs[0]}`);
console.log(`docs urls       : ${locs.filter((u) => u.includes("/docs")).length}`);

const dupes = locs.filter((u, i) => locs.indexOf(u) !== i);
console.log(`duplicates      : ${dupes.length ? dupes.join(", ") : "none"}`);

const readme = locs.filter((u) => /README/i.test(u));
console.log(`README slugs    : ${readme.length ? readme.join(", ") : "none"}`);

const trailingRoot = locs.filter((u) => u === "https://www.aphelion-community.com/");
console.log(`trailing-slash root: ${trailingRoot.length ? "PRESENT (mismatch!)" : "none (matches canonical)"}`);

const offHost = locs.filter((u) => !u.startsWith("https://www.aphelion-community.com"));
console.log(`off-host urls   : ${offHost.length ? offHost.join(", ") : "none"}`);

// ----------------------------------------------------------------- robots ---
line("robots.txt");
console.log(read("robots.txt.body").trim());

// --------------------------------------------------------------- homepage ---
line("homepage");
const home = read("index.html");
const pick = (re) => [...home.matchAll(re)].map((m) => m[1]);

console.log(`title           : ${pick(/<title>([^<]*)<\/title>/g).join(" | ")}`);
console.log(`canonical       : ${pick(/<link rel="canonical" href="([^"]*)"/g).join(" | ")}`);
console.log(`robots          : ${pick(/<meta name="robots" content="([^"]*)"/g).join(" | ")}`);
console.log(`description     : ${pick(/<meta name="description" content="([^"]*)"/g)[0]?.slice(0, 110)}…`);
console.log(`og:url          : ${pick(/<meta property="og:url" content="([^"]*)"/g).join(" | ")}`);
console.log(`og:image        : ${pick(/<meta property="og:image" content="([^"]*)"/g).join(" | ")}`);
console.log(`og:type         : ${pick(/<meta property="og:type" content="([^"]*)"/g).join(" | ")}`);
console.log(`twitter:card    : ${pick(/<meta name="twitter:card" content="([^"]*)"/g).join(" | ")}`);
console.log(`h1 count        : ${pick(/<h1[^>]*>/g).length}`);
console.log(`h1              : ${pick(/<h1[^>]*>([\s\S]*?)<\/h1>/g).map((s) => s.replace(/<[^>]+>/g, "").trim())[0]}`);

const ld = [...home.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .flatMap((m) => {
    try {
      const parsed = JSON.parse(m[1]);
      const nodes = parsed["@graph"] ?? [parsed];
      return nodes.map((n) => n["@type"]);
    } catch {
      return ["<unparseable>"];
    }
  });
console.log(`json-ld types   : ${ld.join(", ")}`);

// ------------------------------------------------------- feature page spot ---
line("spot check: feature + static pages metadata");
for (const [label, file] of [
  ["/features", "features.html"],
  ["/features/tracking", "features/tracking.html"],
  ["/editor", "editor.html"],
  ["/plugins", "plugins.html"],
  ["/about", "about.html"],
  ["/sdk", "sdk.html"],
  ["/privacy", "privacy.html"],
  ["/_not-found", "_not-found.html"],
]) {
  let html;
  try {
    html = read(file);
  } catch {
    console.log(`${label.padEnd(22)} MISSING (${file})`);
    continue;
  }
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "<none>";
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "<none>";
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "<none>";
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "<none>";
  console.log(`${label.padEnd(22)} canon=${canon}`);
  console.log(`${"".padEnd(22)} robots=${robots}`);
  console.log(`${"".padEnd(22)} title=${title}`);
  console.log(`${"".padEnd(22)} desc[${desc.length}]=${desc.slice(0, 90)}${desc.length > 90 ? "…" : ""}`);
}
