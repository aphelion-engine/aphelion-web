import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const components: Components = {
  a: ({ href, children }) => (
    <a href={href} className="text-accent underline-offset-2 hover:underline">
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-md border border-separator bg-surface-tertiary p-4 text-sm">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const block = Boolean(className);
    if (block) {
      return <code className={`${className ?? ""} font-mono text-[13px]`}>{children}</code>;
    }
    return (
      <code className="rounded-sm bg-surface-secondary px-1.5 py-0.5 font-mono text-[13px] text-accent-foreground">
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-separator bg-surface-secondary px-3 py-2 text-left font-medium">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-separator px-3 py-2 align-top">{children}</td>,
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
