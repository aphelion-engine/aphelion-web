import { ArrowUpRightFromSquare } from "@gravity-ui/icons";

import { DocsMarkdown } from "@/components/docs/markdown";
import { DocsSidebar } from "@/components/docs/sidebar";
import type { DocsSource } from "@/lib/docs/catalog";
import type { DocsPage } from "@/lib/docs/paths";

type DocsShellProps = {
  source: DocsSource;
  pages: readonly DocsPage[];
  currentHref: string;
  githubBlobUrl: string;
  markdown: string;
};

export function DocsShell({
  source,
  pages,
  currentHref,
  githubBlobUrl,
  markdown,
}: DocsShellProps): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:flex-row">
      <DocsSidebar source={source} pages={pages} currentHref={currentHref} />
      <article className="min-w-0 flex-1 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-wider text-muted">{source.label}</p>
          <a
            href={githubBlobUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground"
          >
            Edit on GitHub
            <ArrowUpRightFromSquare className="size-3.5" />
          </a>
        </div>
        <DocsMarkdown markdown={markdown} />
      </article>
    </div>
  );
}
