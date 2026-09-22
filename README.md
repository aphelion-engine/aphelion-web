# aphelion-web

Website for [Aphelion Editor](../aphelion-editor) and the [plugin SDK](../aphelion-sdk).

Next.js App Router, React 19, Tailwind v4 with the HeroUI theme tokens. Deployed on Vercel.

The site deliberately does **not** hard-code release data. Releases and documentation are read
from the two GitHub repositories at request time and cached:

| Content | Source | Cache |
|---|---|---|
| Releases | GitHub Releases API (`aphelion-editor`, `aphelion-sdk`) | 60s |
| Docs | Markdown in `docs/` of each repo, falling back to the local checkout | 120s |

## Running it

```bash
npm install
npm run dev
```

There is no mock data path. Without network access the release boards render their empty state and
the docs fall back to reading the sibling `aphelion-editor/` and `aphelion-sdk/` folders, so run the
development server from inside `aphelion-engine/` if you want local docs.

## Checks

```bash
npm run lint
npm run build
```

The build is the only check that does not need a running server. The SEO audit also inspects
server-rendered documentation pages and live redirect behaviour, so it has two modes:

```bash
npm run audit:seo                # built output: sitemap, robots, metadata, internal links
npm run build && npm run start   # then, in another shell:
npm run audit:seo:live           # also crawls the docs pages and checks the runtime
```

It exits non-zero and is specific enough to gate a release: it asserts that every internal link
resolves, that no title exceeds 60 characters or description 160, that canonicals and `og:url`
match the sitemap exactly, that documentation pages carry `BreadcrumbList` and `TechArticle`, and
that an unknown route — including an unknown documentation slug — returns a real 404 rather than a
soft one.

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | No | Raises the GitHub API rate limit and allows reading private repos |
| `NEXT_PUBLIC_SITE_URL` | No | Overrides the canonical origin, for preview deployments. Defaults to `https://www.aphelion-community.com`, which is always applied — an unset variable no longer drops absolute URLs from the output |
| `DOCS_REVALIDATE_SECRET` | No | Shared secret for `POST /api/docs/revalidate` |

## Where things live

```
app/            Routes. /editor, /docs/[source]/[...slug], /sdk, /api/*
components/     Header, footer, release board, docs shell and markdown renderer
lib/site.ts     Product facts, links and versions shown across the site
lib/seo.ts      Canonical host, URL building and per-page metadata
lib/ui.ts       Shared class tokens
lib/releases/   GitHub releases fetching and classification
lib/docs/       GitHub docs fetching, path mapping, link rewriting
scripts/        seo-audit.mjs — the regression suite described above
```

Release and version numbers shown on the site live in `lib/site.ts`. Keep them in step with each
package's `pyproject.toml`.
