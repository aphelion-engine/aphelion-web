import { LogoGithub } from "@gravity-ui/icons";
import { Chip } from "@heroui/react";
import NextLink from "next/link";

import type { DocsSource } from "@/lib/docs/catalog";
import { DOCS_SOURCES } from "@/lib/docs/catalog";
import type { DocsPage } from "@/lib/docs/paths";

type DocsSidebarProps = {
  source: DocsSource;
  pages: readonly DocsPage[];
  currentHref: string;
};

export function DocsSidebar({ source, pages, currentHref }: DocsSidebarProps): React.ReactElement {
  return (
    <aside className="w-full shrink-0 border-separator lg:w-64 lg:border-r">
      <div className="sticky top-14 space-y-6 py-6 lg:pr-6">
        <div className="flex flex-wrap gap-2">
          {DOCS_SOURCES.map((item) => (
            <NextLink
              key={item.id}
              href={`/docs/${item.id}`}
              className={
                item.id === source.id
                  ? "rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
                  : "rounded-md bg-surface-secondary px-2.5 py-1 text-xs text-muted hover:text-foreground"
              }
            >
              {item.label.replace("Aphelion ", "")}
            </NextLink>
          ))}
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">Guides</p>
          <nav className="flex flex-col gap-0.5">
            {pages.map((page) => {
              const active = page.href === currentHref;
              return (
                <NextLink
                  key={page.href}
                  href={page.href}
                  className={
                    active
                      ? "rounded-md bg-surface-secondary px-2 py-1.5 text-sm text-foreground"
                      : "rounded-md px-2 py-1.5 text-sm text-muted hover:bg-surface-secondary hover:text-foreground"
                  }
                >
                  {page.title}
                </NextLink>
              );
            })}
          </nav>
        </div>
        <a
          href={source.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-foreground"
        >
          <LogoGithub className="size-4" />
          {source.owner}/{source.repo}
        </a>
        <Chip size="sm" variant="soft">
          <Chip.Label>Synced from GitHub</Chip.Label>
        </Chip>
      </div>
    </aside>
  );
}
