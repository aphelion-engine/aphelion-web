import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsShell } from "@/components/docs/shell";
import { getDocsSource, isDocsSourceId } from "@/lib/docs/catalog";
import { listDocsPages, loadDoc } from "@/lib/docs/load";

export const revalidate = 120;

type DocsRouteProps = {
  params: Promise<{ source: string; slug?: string[] }>;
};

export async function generateMetadata({ params }: DocsRouteProps): Promise<Metadata> {
  const { source: sourceId, slug = [] } = await params;
  if (!isDocsSourceId(sourceId)) {
    return { title: "Docs" };
  }
  const source = getDocsSource(sourceId);
  if (!source) {
    return { title: "Docs" };
  }
  const doc = await loadDoc(source, slug);
  return {
    title: doc ? `${doc.page.title} · ${source.label}` : source.label,
  };
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
  return (
    <DocsShell
      source={source}
      pages={pages}
      currentHref={doc.page.href}
      githubBlobUrl={doc.githubBlobUrl}
      markdown={doc.markdown}
    />
  );
}
