// Audits the <title> and <meta name="description"> of every prerendered page
// against the lengths that survive Google's snippet truncation, and checks the
// title convention is uniform across the site.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const APP = join(ROOT, ".next", "server", "app");

const TITLE_MAX = 60;
const DESC_MAX = 160;

const pages = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".html") && !entry.endsWith(".rsc.html")) {
      pages.push(full);
    }
  }
}
walk(APP);

const decode = (s) =>
  s
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2F;/g, "/");

const rows = [];
for (const file of pages.sort()) {
  const html = readFileSync(file, "utf8");
  const route =
    "/" + relative(APP, file).replace(/\\/g, "/").replace(/\.html$/, "").replace(/\/index$/, "");
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
  rows.push({ route: route === "/index" ? "/" : route, title, desc, robots });
}

const pad = (s, n) => s + " ".repeat(Math.max(0, n - s.length));

console.log(pad("ROUTE", 24) + pad("TITLE", 5) + pad("DESC", 6) + "TITLE");
console.log("-".repeat(110));
for (const r of rows) {
  const flagT = r.title.length > TITLE_MAX ? "LONG" : "ok  ";
  const flagD = r.desc.length > DESC_MAX ? "LONG" : "ok  ";
  console.log(
    pad(r.route, 24) +
      pad(`${r.title.length}/${flagT}`, 5) +
      pad(`${r.desc.length}/${flagD}`, 6) +
      r.title,
  );
  if (r.desc.length > DESC_MAX) {
    console.log(pad("", 24) + "  desc: " + r.desc);
  }
}

// --- convention checks -------------------------------------------------------
console.log("\n" + "=".repeat(72));
const brandRe = /\| Aphelion Editor$/;
const noBrand = rows.filter((r) => !brandRe.test(r.title) && r.route !== "/_not-found");
console.log(`titles ending "| Aphelion Editor": ${rows.length - noBrand.length}/${rows.length}`);
for (const r of noBrand) console.log(`  no brand suffix: ${r.route}  →  ${r.title}`);

const wrongSep = rows.filter((r) => /·/.test(r.title));
console.log(`titles using "·": ${wrongSep.length ? wrongSep.map((r) => r.route).join(", ") : "none"}`);

const dupTitles = rows.filter((r, i) => rows.findIndex((o) => o.title === r.title) !== i);
console.log(`duplicate titles: ${dupTitles.length ? dupTitles.map((r) => r.route).join(", ") : "none"}`);

const dupDesc = rows.filter(
  (r, i) => r.desc && rows.findIndex((o) => o.desc === r.desc) !== i,
);
console.log(`duplicate descriptions: ${dupDesc.length ? dupDesc.map((r) => r.route).join(", ") : "none"}`);

const noDesc = rows.filter((r) => !r.desc);
console.log(`missing descriptions: ${noDesc.length ? noDesc.map((r) => r.route).join(", ") : "none"}`);

const noRobots = rows.filter((r) => !r.robots);
console.log(`missing robots directive: ${noRobots.length ? noRobots.map((r) => r.route).join(", ") : "none"}`);
