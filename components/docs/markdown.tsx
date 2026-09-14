import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const EXTERNAL_HREF = /^https?:\/\//i;

const components: Components = {
  a: ({ href, children }) => {
    // Docs links are rewritten to site routes during loading, so anything
    // still absolute points off-site and should open in a new tab.
    const external = Boolean(href && EXTERNAL_HREF.test(href));
    return (
      <a
        href={href}
        className="aph-link"
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  pre: ({ children }) => (
    <pre className="aph-terminal aph-terminal__code">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    if (className) {
      return <code className={`${className} font-mono`}>{children}</code>;
    }
    return <code className="aph-key">{children}</code>;
  },
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="aph-table">{children}</table>
    </div>
  ),
};

type DocsMarkdownProps = {
  markdown: string;
};

export function DocsMarkdown({ markdown }: DocsMarkdownProps): React.ReactElement {
  return (
    <div className="docs-prose">
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
        {markdown}
      </Markdown>
    </div>
  );
}
