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

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | No | Raises the GitHub API rate limit and allows reading private repos |
| `NEXT_PUBLIC_SITE_URL` | No | Absolute base URL for Open Graph tags. Omitted if unset |
| `DOCS_REVALIDATE_SECRET` | No | Shared secret for `POST /api/docs/revalidate` |

## Where things live

```
app/            Routes. /editor, /docs/[source]/[...slug], /sdk, /api/*
components/     Header, footer, release board, docs shell and markdown renderer
lib/site.ts     Product facts, links and versions shown across the site
lib/ui.ts       Shared class tokens
lib/releases/   GitHub releases fetching and classification
lib/docs/       GitHub docs fetching, path mapping, link rewriting
```

Release and version numbers shown on the site live in `lib/site.ts`. Keep them in step with each
package's `pyproject.toml`.
