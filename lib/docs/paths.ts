export type DocsPage = {
  path: string;
  slug: readonly string[];
  href: string;
  title: string;
};

function humanizeSegment(segment: string): string {
  return segment
    .replace(/\.md$/i, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function titleFromRepoPath(path: string): string {
  const fileName = path.split("/").pop() ?? path;
  if (fileName.toLowerCase() === "readme.md") {
    return "Overview";
  }
  return humanizeSegment(fileName);
}

export function slugFromRepoPath(path: string): string[] {
  const normalized = path.replace(/\\/g, "/");
  if (normalized.toLowerCase() === "docs/readme.md") {
    return [];
  }
  if (normalized.toLowerCase() === "readme.md") {
    return ["readme"];
  }
  if (normalized.startsWith("docs/")) {
    const rest = normalized.slice("docs/".length).replace(/\.md$/i, "");
    return rest.split("/").filter((part) => part.length > 0);
  }
  return [normalized.replace(/\.md$/i, "")];
}

export function hrefForPage(sourceId: string, slug: readonly string[]): string {
  if (slug.length === 0) {
    return `/docs/${sourceId}`;
  }
  return `/docs/${sourceId}/${slug.join("/")}`;
}

export function repoPathFromSlug(slug: readonly string[]): string {
  if (slug.length === 0) {
    return "docs/README.md";
  }
  return `docs/${slug.join("/")}.md`;
}

export function isDocsMarkdownPath(path: string): boolean {
  const normalized = path.replace(/\\/g, "/");
  if (!normalized.toLowerCase().endsWith(".md")) {
    return false;
  }
  if (normalized.toLowerCase() === "readme.md") {
    return true;
  }
  return normalized.startsWith("docs/") && !normalized.includes("/.");
}
