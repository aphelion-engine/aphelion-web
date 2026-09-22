#!/usr/bin/env node
/**
 * SEO audit.
 *
 * Every check here was written against a defect that actually shipped, so this
 * is a regression suite rather than a checklist:
 *
 * - `/docs/editor/tutorials/README` was a live URL, because a directory README
 *   kept its filename in the slug.
 * - Two documentation descriptions read `Symbol Purpose ------`, because the
 *   pipe-stripping pass left markdown table delimiters behind.
 * - The sitemap emitted `…community.com/` while the canonical said
 *   `…community.com`, so the two disagreed by one character.
 * - Three pages rendered titles with a different separator and a different
 *   brand from the other eleven.
 * - Eleven descriptions ran past the point where Google truncates.
 *
 * ## Usage
 *
 *   node scripts/seo-audit.mjs                  # built output only, no server
 *   node scripts/seo-audit.mjs --server <url>   # also crawl docs + runtime
 *
 * The server pass needs `npm run build && npm run start`, because documentation
 * pages are server-rendered on demand and never appear in `.next` as HTML.
 *
 * Exits non-zero if anything fails, so it can gate a release.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { connect } from "node:net";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const APP = join(ROOT, ".next", "server", "app");

const serverIndex = process.argv.indexOf("--server");
// 127.0.0.1 rather than `localhost`: on a machine where localhost resolves to
// ::1 first, the probe is refused because Next binds IPv4, and the audit
// reports an unreachable server that is in fact running.
const SERVER = serverIndex === -1 ? null : (process.argv[serverIndex + 1] ?? "http://127.0.0.1:3000");

const TITLE_MAX = 60;
const DESC_MAX = 160;

let passed = 0;
const failures = [];

function check(label, actual, expected = true) {
  const ok = expected instanceof RegExp ? expected.test(String(actual)) : actual === expected;
  if (ok) passed++;
  else failures.push(`${label}\n      expected: ${expected}\n      actual:   ${actual}`);
  return ok;
}

function info(label) {
  console.log(`      ${label}`);
}

function section(title) {
  console.log(`\n${"=".repeat(72)}\n${title}\n${"=".repeat(72)}`);
}

const decode = (s) =>
  s
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2F;/g, "/");

/* ------------------------------------------------------------------ *
 * Carve-up of the built output
 * ------------------------------------------------------------------ */

function builtPages() {
  const pages = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".html") && !entry.endsWith(".rsc.html")) pages.push(full);
    }
  };
  walk(APP);
  return pages.sort();
}

function readBuilt(file) {
  const html = readFileSync(file, "utf8");
  const route = "/" + relative(APP, file).replace(/\\/g, "/").replace(/\.html$/, "");
  return {
    route: route === "/index" ? "/" : route,
    title: decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""),
    desc: decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ""),
    canonical: html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "",
    robots: html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "",
    ogUrl: html.match(/<meta property="og:url" content="([^"]*)"/)?.[1] ?? "",
    ogImage: html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? "",
    twitterCard: html.match(/<meta name="twitter:card" content="([^"]*)"/)?.[1] ?? "",
    h1: [...html.matchAll(/<h1[^>]*>/g)].length,
    jsonLd: [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .flatMap((m) => {
        try {
          const p = JSON.parse(m[1]);
          return (p["@graph"] ?? [p]).map((n) => n["@type"]);
        } catch {
          return ["<unparseable>"];
        }
      }),
  };
}

/* ------------------------------------------------------------------ *
 * 1. Static: sitemap, robots, and every prerendered page
 * ------------------------------------------------------------------ */

section("1. Sitemap, robots and prerendered pages");

const SITE = "https://www.aphelion-community.com";
const sitemap = readFileSync(join(APP, "sitemap.xml.body"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

check("sitemap has urls", locs.length > 0);
check("sitemap root is the bare origin", locs[0], SITE);
check("sitemap has no duplicate urls", new Set(locs).size, locs.length);
check("sitemap urls are all on the canonical host", locs.every((u) => u.startsWith(SITE)));
check("sitemap contains no README slugs", locs.some((u) => /README/i.test(u)), false);
check(
  "sitemap has no trailing-slash root",
  locs.includes(`${SITE}/`),
  false,
);
info(`${locs.length} urls, ${locs.filter((u) => u.includes("/docs")).length} of them documentation`);

{
  const robots = readFileSync(join(APP, "robots.txt.body"), "utf8");
  check("robots allows crawling", robots, /Allow: \//);
  check("robots disallows /api/", robots, /Disallow: \/api\//);
  check("robots declares the sitemap", robots, new RegExp(`Sitemap: ${SITE}/sitemap\\.xml`));

  // Anything disallowed must not be advertised in the sitemap.
  const disallowed = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);
  check(
    "no disallowed path appears in the sitemap",
    locs.some((u) => disallowed.some((d) => new URL(u).pathname.startsWith(d))),
    false,
  );
}

const pages = builtPages().map(readBuilt);
info(`${pages.length} prerendered pages`);

for (const p of pages) {
  if (p.route === "/_global-error") {
    // Next's root error boundary. It replaces the root layout, so it cannot
    // carry metadata; the noindex is asserted from source further down.
    continue;
  }
  check(`${p.route} has exactly one h1`, p.h1, 1);
  check(`${p.route} has a title`, p.title.length > 0);
  check(`${p.route} title ≤ ${TITLE_MAX}`, p.title.length <= TITLE_MAX);
  check(`${p.route} has a description`, p.desc.length > 0);
  check(`${p.route} description ≤ ${DESC_MAX}`, p.desc.length <= DESC_MAX);
  check(`${p.route} has a robots directive`, p.robots.length > 0);
  check(`${p.route} has og:url`, p.ogUrl.length > 0);
  check(`${p.route} has og:image`, p.ogImage.length > 0);
  check(`${p.route} has twitter:card`, p.twitterCard, "summary_large_image");
}

// Canonical and og:url must agree, and must match the page's own route.
// This is the check that caught the sitemap/canonical trailing-slash split.
for (const p of pages) {
  if (/^\/_/.test(p.route)) continue;
  const expected = p.route === "/" ? SITE : `${SITE}${p.route}`;
  check(`${p.route} canonical`, p.canonical, expected);
  check(`${p.route} og:url matches canonical`, p.ogUrl, p.canonical);
}

{
  const titles = new Map();
  const descs = new Map();
  for (const p of pages) {
    titles.set(p.title, [...(titles.get(p.title) ?? []), p.route]);
    descs.set(p.desc, [...(descs.get(p.desc) ?? []), p.route]);
  }
  const dupT = [...titles].filter(([, v]) => v.length > 1);
  const dupD = [...descs].filter(([, v]) => v.length > 1 && v[0] !== undefined && v.length > 1);
  check("no duplicate titles", dupT.length, 0);
  check("no duplicate descriptions", dupD.filter(([k]) => k.length > 0).length, 0);

  // One brand and one separator across the whole site.
  const wrongSep = pages.filter((p) => p.title.includes("·"));
  check("no titles use a different separator", wrongSep.map((p) => p.route).join(","), "");
}

// The homepage and the deepest product pages must carry structured data.
{
  const home = pages.find((p) => p.route === "/");
  check("homepage has Organization JSON-LD", home.jsonLd.includes("Organization"));
  check("homepage has WebSite JSON-LD", home.jsonLd.includes("WebSite"));
  check("homepage has SoftwareApplication JSON-LD", home.jsonLd.includes("SoftwareApplication"));

  // The brief's licensing constraint: no claim of open source anywhere.
  const homeHtml = readFileSync(join(APP, "index.html"), "utf8");
  check("homepage does not claim open source", /open[- ]source/i.test(homeHtml), false);
}

/* ------------------------------------------------------------------ *
 * 2. Static: internal links
 * ------------------------------------------------------------------ */

section("2. Internal links");

const routes = new Set();
{
  const collect = (dir, urlPath) => {
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
      else if (statSync(full).isDirectory()) collect(full, `${urlPath}/${entry}`);
    }
    if (hasPage) {
      const segments = urlPath.split("/").filter((s) => s && !(s.startsWith("(") && s.endsWith(")")));
      routes.add(segments.length ? "/" + segments.join("/") : "/");
    }
  };
  for (const entry of readdirSync(APP)) {
    const full = join(APP, entry);
    if (statSync(full).isDirectory()) collect(full, "/" + entry);
    else if (/^(page|route)\./.test(entry)) routes.add("/");
  }
}

const links = new Map();
{
  const scan = (file) => {
    const text = readFileSync(file, "utf8");
    const rel = relative(ROOT, file).replace(/\\/g, "/");
    for (const m of text.matchAll(/href=\{?["'`](\/[^"'`]*)["'`]/g)) add(m[1], rel);
    for (const m of text.matchAll(/\bpath:\s*["'`](\/[^"'`]*)["'`]/g)) add(m[1], rel);
    for (const m of text.matchAll(/\bhref:\s*["'`](\/[^"'`]*)["'`]/g)) add(m[1], rel);
  };
  const add = (href, file) => {
    const clean = href.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";
    if (clean.includes("${")) return; // template literal, resolved at runtime
    if (!links.has(clean)) links.set(clean, new Set());
    links.get(clean).add(file);
  };
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry)) scan(full);
    }
  };
  for (const dir of ["app", "components", "lib"]) walk(join(ROOT, dir));
}

const DYNAMIC = [/^\/docs\/[^/]+(\/.*)?$/];
const unresolved = [...links]
  .map(([href, files]) => ({ href, files: [...files] }))
  .filter(({ href }) => !routes.has(href) && !DYNAMIC.some((re) => re.test(href)));

check("every internal link resolves to a real route", unresolved.length, 0);
for (const u of unresolved) {
  failures.push(`unresolved link ${u.href}\n      used in: ${u.files.join(", ")}`);
}
info(`${links.size} internal links, ${routes.size} routes`);

// Deep doc links must match slugs the docs loader actually resolves.
{
  const known = new Set(
    locs
      .map((u) => u.replace(SITE, "").replace(/\/+$/, ""))
      .filter((p) => p.startsWith("/docs")),
  );
  const deep = [...links.keys()].filter((h) => /^\/docs\/[^/]+\/.+/.test(h));
  const bad = deep.filter((h) => !known.has(h));
  check("every deep /docs/ link is a real documentation page", bad.join(", "), "");
}

/* ------------------------------------------------------------------ *
 * 3. Static: the 404 contract and the root error boundary
 * ------------------------------------------------------------------ */

section("3. not-found and global-error");

{
  const nf = readFileSync(join(ROOT, "app", "not-found.tsx"), "utf8");
  check("not-found sets noindex", nf, /noIndexMetadata|index:\s*false/);
}

/*
 * There is deliberately no `app/global-error.tsx`.
 *
 * One was written, and it did not work. Next 16 compiles a user `global-error`
 * into the route module for `/_global-error` — you can see it referenced in
 * `.next/server/app/_global-error/page.js` — but the served page is its own
 * built-in 500 UI regardless (`<html id="__next_error__">`, `--next-error-*`).
 * That held across a clean rebuild with no cache and no build warning, so the
 * file was mitigation that silently did nothing.
 *
 * It is also unnecessary: `/_global-error` answers **HTTP 500**, and search
 * engines do not index 5xx responses — they treat them as transient and retry.
 * The 404 path is the one that needs an explicit `noindex`, because a 404 can
 * be indexed if a crawler reaches it by following a stale link, and that is
 * asserted above.
 *
 * The live pass asserts the 5xx directly, which is a check on real behaviour
 * rather than on the presence of a file.
 */

/* ------------------------------------------------------------------ *
 * 4. Server pass: documentation pages and runtime behaviour
 * ------------------------------------------------------------------ */

if (!SERVER) {
  console.log("\nSkipping the server pass. Re-run with --server <url> after `npm run start`.");
} else {
  // Probe first. Without this, an unreachable server surfaces as an unhandled
  // ECONNREFUSED stack trace from somewhere in the middle of the crawl, which
  // reads like a bug in the audit rather than a missing `npm run start`.
  const reachable = await fetch(SERVER + "/", { redirect: "manual" }).then(
    () => true,
    () => false,
  );
  if (!reachable) {
    section("Result");
    console.log(`Cannot reach ${SERVER}.`);
    console.log("Start the production server first:  npm run build && npm run start");
    process.exit(1);
  }

  const fetchHead = async (path) => {
    const res = await fetch(SERVER + path, { redirect: "manual" });
    return { status: res.status, headers: res.headers, html: await res.text() };
  };

  section(`4. Documentation pages (${SERVER})`);

  const docPaths = locs
    .map((u) => u.replace(SITE, ""))
    .filter((p) => p === "/docs" || p.startsWith("/docs/"));
  info(`${docPaths.length} documentation urls`);

  const docRows = [];
  for (const path of docPaths) {
    const { status, html } = await fetchHead(path);
    docRows.push({
      path,
      status,
      title: decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""),
      desc: decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ""),
      canonical: html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "",
      robots: html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "",
      h1: [...html.matchAll(/<h1[^>]*>/g)].length,
      hasBreadcrumb: /BreadcrumbList/.test(html),
      hasArticle: /TechArticle/.test(html),
    });
  }

  for (const r of docRows) {
    check(`${r.path} returns 200`, r.status, 200);
    check(`${r.path} has a title`, r.title.length > 0);
    check(`${r.path} has a description`, r.desc.length > 0);
    check(`${r.path} description ≤ ${DESC_MAX}`, r.desc.length <= DESC_MAX);
    check(`${r.path} is indexable`, r.robots, /index/);
    check(`${r.path} has exactly one h1`, r.h1, 1);
    check(`${r.path} canonical`, r.canonical, `${SITE}${r.path}`);
    // The table-delimiter regression. `---` and a stray `|` both shipped.
    check(`${r.path} description has no markdown table syntax`, /-{3,}|\|/.test(r.desc), false);
  }

  // The docs index is a listing page, not an article, so it carries neither.
  const articles = docRows.filter((r) => r.path !== "/docs");
  check(
    "article pages carry a BreadcrumbList",
    articles.every((r) => r.hasBreadcrumb),
    true,
  );
  check(
    "article pages carry TechArticle",
    articles.every((r) => r.hasArticle),
    true,
  );

  const dupT = docRows.map((r) => r.title).filter((t, i, a) => a.indexOf(t) !== i);
  const dupD = docRows.map((r) => r.desc).filter((d, i, a) => a.indexOf(d) !== i);
  check("no duplicate documentation titles", dupT.join(", "), "");
  check("no duplicate documentation descriptions", dupD.join(", "), "");

  section("5. Redirects, status codes and generated assets");

  for (const [from, to] of [
    ["/download", "/editor"],
    ["/downloads", "/editor"],
    ["/products", "/editor"],
    ["/documentation", "/docs"],
    ["/doc", "/docs"],
  ]) {
    const { status, headers } = await fetchHead(from);
    check(`${from} permanently redirects`, status, /^30[18]$/);
    check(`${from} targets ${to}`, (headers.get("location") ?? "").replace(SERVER, ""), to);
  }

  for (const path of ["/", "/features", "/editor", "/plugins", "/sdk", "/about", "/privacy"]) {
    const { status } = await fetchHead(path);
    check(`${path} returns 200`, status, 200);
  }

  {
    const { status } = await fetchHead("/this-page-does-not-exist-12345");
    check("unknown route returns a real 404", status, 404);
  }
  {
    const { status } = await fetchHead("/docs/editor/no-such-guide-xyz");
    check("unknown documentation slug returns 404, not a soft 404", status, 404);
  }
  {
    // The global error page must not be indexable. It is not, because it is a
    // 5xx — assert the status rather than the presence of a noindex tag, since
    // a 5xx is the thing that actually keeps it out of the index.
    const { status } = await fetchHead("/_global-error");
    check("/_global-error returns 5xx, so crawlers will not index it", status >= 500 && status < 600, true);
  }

  {
    const { headers } = await fetchHead("/");
    check("X-Powered-By is suppressed", headers.get("x-powered-by") ?? "absent", "absent");
    check("X-Content-Type-Options", headers.get("x-content-type-options") ?? "", "nosniff");
    check("Referrer-Policy is set", /./.test(headers.get("referrer-policy") ?? ""), true);
  }

  {
    const res = await fetch(`${SERVER}/opengraph-image`);
    const buf = Buffer.from(await res.arrayBuffer());
    const isPng = buf
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    check("opengraph-image is a PNG", isPng, true);
    if (isPng) {
      check("opengraph-image is 1200×630", `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}`, "1200x630");
    }
  }

  {
    const res = await fetch(`${SERVER}/manifest.webmanifest`);
    let manifest = null;
    try {
      manifest = JSON.parse(await res.text());
    } catch {
      /* reported below */
    }
    check("manifest.webmanifest parses", manifest !== null, true);
    if (manifest) check("manifest declares icons", Array.isArray(manifest.icons) && manifest.icons.length > 0, true);
  }

  {
    const res = await fetch(`${SERVER}/llms.txt`);
    const body = await res.text();
    check("llms.txt returns 200", res.status, 200);
    check("llms.txt starts with a heading", (body.trim().split("\n")[0] ?? "").slice(0, 1), "#");
  }

  // The host-scoped apex redirect cannot be reached with fetch: undici drops a
  // caller-supplied Host header, so the request never looks like an apex one.
  section("6. Apex host redirect (raw socket)");
  {
    const { port } = new URL(SERVER);
    const raw = (hostHeader, path) =>
      new Promise((resolve, reject) => {
        const socket = connect({ host: "127.0.0.1", port: Number(port) }, () => {
          socket.write(`GET ${path} HTTP/1.1\r\nHost: ${hostHeader}\r\nConnection: close\r\n\r\n`);
        });
        let data = "";
        socket.setEncoding("utf8");
        socket.on("data", (c) => (data += c));
        socket.on("end", () => resolve(data));
        socket.on("error", reject);
      });

    for (const path of ["/", "/docs"]) {
      const response = await raw("aphelion-community.com", path);
      const location =
        response.split("\r\n").find((h) => /^location:/i.test(h)) ?? "(no location)";
      check(`apex${path} redirects 308`, response.split("\r\n")[0] ?? "", /308/);
      check(`apex${path} targets www`, location, `location: ${SITE}${path === "/" ? "" : path}`);
    }

    const wwwResponse = await raw("www.aphelion-community.com", "/");
    check("www host is served, not redirected", wwwResponse.split("\r\n")[0] ?? "", /200/);
  }
}

/* ------------------------------------------------------------------ */

section("Result");
const total = passed + failures.length;
if (failures.length === 0) {
  console.log(`All ${total} checks passed.`);
  process.exitCode = 0;
} else {
  console.log(`${passed}/${total} checks passed.\n`);
  for (const f of failures) console.log(`FAIL  ${f}\n`);
  process.exitCode = 1;
}
