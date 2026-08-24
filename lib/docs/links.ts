import type { DocsSource, DocsSourceId } from "@/lib/docs/catalog";
import { hrefForPage, slugFromRepoPath } from "@/lib/docs/paths";

function stripHash(href: string): { path: string; hash: string } {
  const index = href.indexOf("#");
  if (index === -1) {
    return { path: href, hash: "" };
  }
  return { path: href.slice(0, index), hash: href.slice(index) };
}

function posixJoin(baseDir: string, relative: string): string {
  const parts = [...baseDir.split("/").filter(Boolean), ...relative.split("/")];
  const out: string[] = [];
  for (const part of parts) {
    if (part === "." || part === "") {
      continue;
    }
    if (part === "..") {
      out.pop();
      continue;
    }
    out.push(part);
  }
  return out.join("/");
}

function mapCrossRepo(path: string): string | null {
  const editor = path.match(/aphelion-editor\/docs\/(.*)$/);
  if (editor) {
    const rest = editor[1].replace(/\.md$/i, "");
    if (rest.toLowerCase() === "readme") {
      return "/docs/editor";
    }
    return `/docs/editor/${rest}`;
  }
  const sdk = path.match(/aphelion-sdk\/docs\/(.*)$/);
  if (sdk) {
    const rest = sdk[1].replace(/\.md$/i, "");
    if (rest.toLowerCase() === "readme") {
      return "/docs/sdk";
    }
    return `/docs/sdk/${rest}`;
  }
  return null;
}

export function rewriteDocHref(
  href: string,
  source: DocsSource,
  currentPath: string,
): string {
  if (href.startsWith("#") || href.startsWith("mailto:")) {
    return href;
  }
  if (/^https?:\/\//i.test(href)) {
    return href;
  }

  const { path, hash } = stripHash(href);
  const cross = mapCrossRepo(path);
  if (cross) {
    return `${cross}${hash}`;
  }

  const currentDir = currentPath.includes("/")
    ? currentPath.slice(0, currentPath.lastIndexOf("/"))
    : "";
  const resolved = posixJoin(currentDir, path);

  if (resolved.toLowerCase().endsWith(".md")) {
    const slug = slugFromRepoPath(resolved);
    return `${hrefForPage(source.id as DocsSourceId, slug)}${hash}`;
  }

  return `https://github.com/${source.owner}/${source.repo}/blob/${source.branch}/${resolved}${hash}`;
}

export function rewriteMarkdownLinks(
  markdown: string,
  source: DocsSource,
  currentPath: string,
): string {
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_full, label: string, href: string) => {
    return `[${label}](${rewriteDocHref(href, source, currentPath)})`;
  });
}
