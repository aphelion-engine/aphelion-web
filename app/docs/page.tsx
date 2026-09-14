import type { Metadata } from "next";
import NextLink from "next/link";

import { DOCS_SOURCES } from "@/lib/docs/catalog";
import { listDocsPages } from "@/lib/docs/load";
import { pageMetadata } from "@/lib/seo";
import { TEXT_LINK } from "@/lib/ui";

export const revalidate = 120;

export const metadata: Metadata = pageMetadata({
  title: "Documentation — Guides and Reference | Aphelion Editor",
  absoluteTitle: true,
  description:
    "Aphelion Editor and plugin SDK documentation: installation, the node graph, tracking, keying, rotoscoping, exporting and writing plugins.",
  path: "/docs",
});

export default async function DocsIndexPage(): Promise<React.ReactElement> {
  const catalogs = await Promise.all(
    DOCS_SOURCES.map(async (source) => ({
      source,
      pages: await listDocsPages(source),
    })),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:py-14">
      <h1 className="aph-page-title">Documentation</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Every page is rendered from the markdown already in the two repositories, on a two-minute
        cache. Nothing is copied into the website, so the docs and the source cannot drift apart.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {catalogs.map(({ source, pages }) => (
          <section key={source.id} className="aph-dock">
            <div className="aph-dock__title justify-between">
              <span>{source.label}</span>
              <span className="aph-chip">{pages.length} pages</span>
            </div>
            <div className="aph-dock__body space-y-3">
              <p className="text-sm text-muted">{source.description}</p>
              <ul className="space-y-0.5">
                {pages.map((page) => (
                  <li key={page.href}>
                    <NextLink className="aph-nav-item" href={page.href}>
                      {page.title}
                    </NextLink>
                  </li>
                ))}
              </ul>
              <p>
                <a className={TEXT_LINK} href={source.githubUrl} target="_blank" rel="noreferrer">
                  {source.owner}/{source.repo}
                </a>
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
