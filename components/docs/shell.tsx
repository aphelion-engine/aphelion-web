import { ArrowUpRightFromSquare } from "@gravity-ui/icons";
import NextLink from "next/link";

import { DocsMarkdown } from "@/components/docs/markdown";
import { DocsSidebar } from "@/components/docs/sidebar";
import type { DocsSource } from "@/lib/docs/catalog";
import type { DocsPage } from "@/lib/docs/paths";
import type { BreadcrumbEntry } from "@/lib/seo";

type DocsShellProps = {
  source: DocsSource;
  pages: readonly DocsPage[];
  currentHref: string;
  currentSlug: readonly string[];
  githubBlobUrl: string;
  markdown: string;
  crumbs: readonly BreadcrumbEntry[];
};

/**
 * Visible breadcrumb trail.
 *
 * The route emits `BreadcrumbList` JSON-LD from the same array, so the
 * visible trail and the structured data cannot disagree. The final crumb is
 * the current page and is marked with `aria-current="page"` rather than
 * being a link to itself.
 */
function Breadcrumbs({ crumbs }: { crumbs: readonly BreadcrumbEntry[] }): React.ReactElement {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={`${crumb.name}-${index}`} className="flex items-center gap-x-2">
              {crumb.path && !last ? (
                <NextLink className="aph-link" href={crumb.path}>
                  {crumb.name}
                </NextLink>
              ) : (
                <span aria-current={last ? "page" : undefined}>{crumb.name}</span>
              )}
              {!last ? (
                <span aria-hidden className="text-[#4a4a4a]">
                  ›
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Previous/next links, in sidebar order.
 *
 * Ordering comes from the same sorted list the sidebar renders, so "next"
 * means the next page a reader would actually reach. This is what turns the
 * documentation into a crawlable path rather than a set of leaves that only
 * the sidebar can reach — and descriptive anchor text here is worth more to
 * a crawler than the sidebar's repeated short labels.
 */
function Pager({
  pages,
  currentHref,
}: {
  pages: readonly DocsPage[];
  currentHref: string;
}): React.ReactElement | null {
  const index = pages.findIndex((page) => page.href === currentHref);
  if (index === -1) {
    return null;
  }
  const previous = index > 0 ? pages[index - 1] : null;
  const next = index < pages.length - 1 ? pages[index + 1] : null;
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Documentation pages"
      className="mt-10 grid gap-3 border-t border-[#121212] pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <NextLink className="aph-pager" href={previous.href} rel="prev">
          <span className="aph-pager__label">Previous</span>
          <span className="aph-pager__title">{previous.title}</span>
        </NextLink>
      ) : (
        <span />
      )}
      {next ? (
        <NextLink className="aph-pager sm:text-right" href={next.href} rel="next">
          <span className="aph-pager__label">Next</span>
          <span className="aph-pager__title">{next.title}</span>
        </NextLink>
      ) : null}
    </nav>
  );
}

export function DocsShell({
  source,
  pages,
  currentHref,
  githubBlobUrl,
  markdown,
  crumbs,
}: DocsShellProps): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:flex-row">
      <DocsSidebar source={source} pages={pages} currentHref={currentHref} />
      <article className="min-w-0 flex-1 py-8">
        <Breadcrumbs crumbs={crumbs} />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[#121212] pb-3">
          <p className="aph-chip">{source.label}</p>
          <a
            href={githubBlobUrl}
            target="_blank"
            rel="noreferrer"
            className="aph-btn aph-btn--ghost aph-btn--sm"
          >
            Edit this page on GitHub
            <ArrowUpRightFromSquare className="size-3.5" />
          </a>
        </div>
        <DocsMarkdown markdown={markdown} />
        <Pager pages={pages} currentHref={currentHref} />
      </article>
    </div>
  );
}
