import { LogoGithub } from "@gravity-ui/icons";
import NextLink from "next/link";

import type { DocsSource } from "@/lib/docs/catalog";
import { DOCS_SOURCES } from "@/lib/docs/catalog";
import type { DocsPage } from "@/lib/docs/paths";

type DocsSidebarProps = {
  source: DocsSource;
  pages: readonly DocsPage[];
  currentHref: string;
};

function GuideLink({
  page,
  currentHref,
}: {
  page: DocsPage;
  currentHref: string;
}): React.ReactElement {
  const active = page.href === currentHref;
  return (
    <li>
      <NextLink
        href={page.href}
        aria-current={active ? "page" : undefined}
        className="aph-nav-item"
      >
        {page.title}
      </NextLink>
    </li>
  );
}

function GuideLinks({
  pages,
  currentHref,
}: {
  pages: readonly DocsPage[];
  currentHref: string;
}): React.ReactElement {
  const topLevel = pages.filter((page) => page.group === "");
  const grouped = new Map<string, DocsPage[]>();
  for (const page of pages) {
    if (page.group === "") {
      continue;
    }
    const existing = grouped.get(page.group);
    if (existing) {
      existing.push(page);
    } else {
      grouped.set(page.group, [page]);
    }
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-0.5">
        {topLevel.map((page) => (
          <GuideLink key={page.href} page={page} currentHref={currentHref} />
        ))}
      </ul>
      {[...grouped.entries()].map(([group, groupPages]) => (
        <div key={group}>
          <p className="mb-1 px-2 text-[10px] font-semibold tracking-[0.09em] text-muted uppercase">
            {group}
          </p>
          <ul className="space-y-0.5">
            {groupPages.map((page) => (
              <GuideLink key={page.href} page={page} currentHref={currentHref} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function DocsSidebar({ source, pages, currentHref }: DocsSidebarProps): React.ReactElement {
  return (
    <aside className="w-full shrink-0 border-separator lg:w-60 lg:border-r">
      <div className="space-y-5 py-6 lg:sticky lg:top-14 lg:pr-6">
        <nav aria-label="Documentation source" className="flex flex-wrap gap-1.5">
          {DOCS_SOURCES.map((item) => {
            const active = item.id === source.id;
            return (
              <NextLink
                key={item.id}
                href={`/docs/${item.id}`}
                aria-current={active ? "page" : undefined}
                className={active ? "aph-chip aph-chip--accent" : "aph-chip"}
              >
                {item.label.replace("Aphelion ", "")}
              </NextLink>
            );
          })}
        </nav>

        <nav aria-label="Guides">
          <details className="guides-disclosure">
            <summary className="mb-2 text-[10px] font-semibold tracking-[0.09em] text-muted uppercase">
              Guides ({pages.length})
            </summary>
            <p className="mb-2 hidden text-[10px] font-semibold tracking-[0.09em] text-muted uppercase lg:block">
              Guides ({pages.length})
            </p>
            {pages.length > 0 ? (
              <GuideLinks pages={pages} currentHref={currentHref} />
            ) : (
              <p className="px-2 text-xs text-muted">
                Couldn&apos;t read the file list from GitHub.{" "}
                <a className="aph-link" href={source.githubUrl} target="_blank" rel="noreferrer">
                  Browse the repository
                </a>
                .
              </p>
            )}
          </details>
        </nav>

        <a
          href={source.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="aph-nav-item"
        >
          <LogoGithub className="size-4 shrink-0" />
          {source.owner}/{source.repo}
        </a>
      </div>
    </aside>
  );
}
