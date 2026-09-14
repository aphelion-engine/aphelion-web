import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsShell } from "@/components/docs/shell";
import { JsonLd } from "@/components/json-ld";
import { getDocsSource, isDocsSourceId } from "@/lib/docs/catalog";
import { listDocsPages, loadDoc } from "@/lib/docs/load";
import type { DocsPage } from "@/lib/docs/paths";
import {
    breadcrumbSchema,
    jsonLdGraph,
    pageMetadata,
    techArticleSchema,
    type BreadcrumbEntry,
} from "@/lib/seo";

export const revalidate = 120;

type DocsRouteProps = {
  params: Promise<{ source: string; slug?: string[] }>;
};

/**
 * Derive a meta description from the markdown itself.
 *
 * A documentation page's first real paragraph is the most accurate summary
 * that exists, and it is already written for humans. Building descriptions
 * this way gives 27 pages 27 distinct descriptions instead of one generic
 * string, without a parallel metadata file that would drift the moment a
 * page is edited — which is exactly what happened here before, when every
 * doc page shipped with a title and nothing else.
 *
 * Markdown syntax is stripped, and the result is clipped on a word boundary
 * near where search engines truncate a snippet.
 */
function describeMarkdown(markdown: string, title: string): string {
  const prose = markdown
    // Fenced code, headings, tables, images and quote markers carry no
    // meaning in a snippet.
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+.*$/gm, " ")
    .replace(/^\s{0,3}>.*$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, " ")
    .replace(/[*_`|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (prose.length === 0) {
    return `${title} — Aphelion Editor documentation.`;
  }

  const LIMIT = 158;
  if (prose.length <= LIMIT) {
    return prose;
  }
  const clipped = prose.slice(0, LIMIT);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 80 ? lastSpace : LIMIT).trimEnd()}…`;
}

/** Title used in the `<title>` tag and on the social card. */
function docsTitle(page: DocsPage, sourceLabel: string): string {
  return `${page.title} | ${sourceLabel} Documentation`;
}

export async function generateMetadata({ params }: DocsRouteProps): Promise<Metadata> {
  const { source: sourceId, slug = [] } = await params;
  if (!isDocsSourceId(sourceId)) {
    return { title: { absolute: "Documentation | Aphelion Editor" } };
  }
  const source = getDocsSource(sourceId);
  if (!source) {
    return { title: { absolute: "Documentation | Aphelion Editor" } };
  }

  const doc = await loadDoc(source, slug);
  if (!doc) {
    // A slug that resolves to nothing must never be indexed as a soft 404.
    return {
      title: { absolute: "Page not found | Aphelion Editor Documentation" },
      robots: { index: false, follow: true },
    };
  }

  return pageMetadata({
    title: docsTitle(doc.page, source.label),
    absoluteTitle: true,
    description: describeMarkdown(doc.markdown, doc.page.title),
    path: doc.page.href,
    type: "article",
  });
}

export default async function DocsPage({ params }: DocsRouteProps): Promise<React.ReactElement> {
  const { source: sourceId, slug = [] } = await params;
  if (!isDocsSourceId(sourceId)) {
    notFound();
  }
  const source = getDocsSource(sourceId);
  if (!source) {
    notFound();
  }
  const [pages, doc] = await Promise.all([listDocsPages(source), loadDoc(source, slug)]);
  if (!doc) {
    notFound();
  }

  const crumbs: BreadcrumbEntry[] = [
    { name: "Aphelion", path: "/" },
    { name: "Documentation", path: "/docs" },
    { name: source.label, path: `/docs/${source.id}` },
    ...(doc.page.group ? [{ name: doc.page.group, path: `/docs/${source.id}` }] : []),
    { name: doc.page.title },
  ];

  const description = describeMarkdown(doc.markdown, doc.page.title);

  return (
    <>
      <DocsShell
        source={source}
        pages={pages}
        currentHref={doc.page.href}
        currentSlug={doc.page.slug}
        githubBlobUrl={doc.githubBlobUrl}
        markdown={doc.markdown}
        crumbs={crumbs}
      />
      <JsonLd
        data={jsonLdGraph([
          breadcrumbSchema(crumbs),
          techArticleSchema({
            headline: doc.page.title,
            description,
            path: doc.page.href,
          }),
        ])}
      />
    </>
  );
}
