export type DocsPage = {
  path: string;
  slug: readonly string[];
  href: string;
  title: string;
  /** Humanized `docs/` sub-directory. Empty for pages that sit at the root. */
  group: string;
};

/**
 * Split on hyphens and capitalize, but keep short all-caps names intact.
 * Without this, `api.md` renders as "Api" and `sdk` as "Sdk".
 */
const ACRONYMS: ReadonlySet<string> = new Set([
  "api",
  "cli",
  "cpu",
  "gpu",
  "ide",
  "json",
  "mp4",
  "png",
  "sdk",
  "ui",
  "ux",
]);

function humanizeSegment(segment: string): string {
  return segment
    .replace(/\.md$/i, "")
    .split("-")
    .map((part) =>
      ACRONYMS.has(part.toLowerCase())
        ? part.toUpperCase()
        : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

export function titleFromRepoPath(path: string): string {
  const normalized = path.replace(/\\/g, "/");
  const fileName = normalized.split("/").pop() ?? normalized;
  if (fileName.toLowerCase() === "readme.md") {
    const parts = normalized.split("/").filter(Boolean);
    // `docs/tutorials/README.md` is the index for the `tutorials` directory,
    // so it is named after that directory. Only the top-level
    // `docs/README.md` is the generic overview — without this distinction
    // the sidebar shows two entries both called "Overview".
    if (parts.length >= 3) {
      return humanizeSegment(parts[parts.length - 2]);
    }
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
    const parts = rest.split("/").filter((part) => part.length > 0);
    // A README inside a sub-directory is that directory's index page, so it
    // lives at the directory's own URL. Leaving the filename in produced
    // `/docs/editor/tutorials/README`, which is both an ugly URL and a
    // different address for the same content.
    if (parts.length > 1 && parts[parts.length - 1].toLowerCase() === "readme") {
      parts.pop();
    }
    return parts;
  }
  return [normalized.replace(/\.md$/i, "")];
}

export function hrefForPage(sourceId: string, slug: readonly string[]): string {
  if (slug.length === 0) {
    return `/docs/${sourceId}`;
  }
  return `/docs/${sourceId}/${slug.join("/")}`;
}

/**
 * Candidate repository paths for a slug, in the order they should be tried.
 *
 * A slug can address either a markdown file (`docs/api.md`) or a directory
 * index (`docs/tutorials/README.md`), and the URL gives no way to tell which.
 * Trying both is what keeps a direct hit on `/docs/editor/tutorials` working
 * when the file list could not be read from GitHub.
 */
export function repoPathCandidates(slug: readonly string[]): string[] {
  if (slug.length === 0) {
    return ["docs/README.md"];
  }
  return [`docs/${slug.join("/")}.md`, `docs/${slug.join("/")}/README.md`];
}

/** Pages nested under `docs/<dir>/` are listed beneath a heading for that dir. */
export function groupFromSlug(slug: readonly string[]): string {
  return slug.length < 2 ? "" : humanizeSegment(slug[0]);
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

/**
 * Reading order for the guides that exist today, keyed by slug so renaming a
 * page's title does not move it. Anything not listed sorts after these, in
 * alphabetical order, which is the right default for reference material.
 */
const GUIDE_ORDER: readonly string[] = [
  "",
  "getting-started",
  "user-guide",
  "authoring",
  "widgets",
  "api",
  "plugins",
  "architecture",
  "development",
  "packaging",
];

export function compareDocsPages(a: DocsPage, b: DocsPage): number {
  const aIndex = GUIDE_ORDER.indexOf(a.slug.join("/"));
  const bIndex = GUIDE_ORDER.indexOf(b.slug.join("/"));
  if (aIndex === -1 && bIndex === -1) {
    return a.title.localeCompare(b.title);
  }
  if (aIndex === -1) {
    return 1;
  }
  if (bIndex === -1) {
    return -1;
  }
  return aIndex - bIndex;
}
