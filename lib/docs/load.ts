import type { DocsSource } from "@/lib/docs/catalog";
import { fetchGithubFile, fetchGithubTree } from "@/lib/docs/github";
import { rewriteMarkdownLinks } from "@/lib/docs/links";
import { listLocalMarkdown, readLocalFile } from "@/lib/docs/local";
import {
  compareDocsPages,
  groupFromSlug,
  hrefForPage,
  isDocsMarkdownPath,
  repoPathCandidates,
  slugFromRepoPath,
  titleFromRepoPath,
  type DocsPage,
} from "@/lib/docs/paths";

function toPages(source: DocsSource, paths: string[]): DocsPage[] {
  const markdown = [...new Set(paths.filter(isDocsMarkdownPath))];

  // `docs/README.md` is the overview. A README at the repo root is the same
  // thing for anyone browsing GitHub, so listing it too just adds a second
  // entry that reads "Readme" and leads nowhere new. If a repo has no
  // `docs/README.md`, the root README takes over as the overview instead.
  const hasDocsOverview = markdown.some((path) => path.toLowerCase() === "docs/readme.md");
  const selected = hasDocsOverview
    ? markdown.filter((path) => path.toLowerCase() !== "readme.md")
    : markdown;

  const pages = selected.map((repoPath) => {
    const slug =
      !hasDocsOverview && repoPath.toLowerCase() === "readme.md"
        ? []
        : slugFromRepoPath(repoPath);
    return {
      path: repoPath,
      slug,
      href: hrefForPage(source.id, slug),
      title: titleFromRepoPath(repoPath),
      group: groupFromSlug(slug),
    };
  });

  const seen = new Set<string>();
  return pages
    .filter((page) => {
      if (seen.has(page.href)) {
        return false;
      }
      seen.add(page.href);
      return true;
    })
    .sort(compareDocsPages);
}

export async function listDocsPages(source: DocsSource): Promise<DocsPage[]> {
  try {
    return toPages(source, await fetchGithubTree(source));
  } catch {
    // Fall through to the local checkout, which is what a from-source dev
    // server uses when it has no GitHub access.
  }
  try {
    return toPages(source, await listLocalMarkdown(source));
  } catch {
    // Nothing to enumerate. The requested page may still render through
    // loadDoc's direct file fetch, so degrade to an empty list rather than
    // failing the whole route.
    return [];
  }
}

async function readMarkdownFile(source: DocsSource, repoPath: string): Promise<string> {
  try {
    return await fetchGithubFile(source, repoPath);
  } catch {
    return readLocalFile(source, repoPath);
  }
}

export type LoadedDoc = {
  source: DocsSource;
  page: DocsPage;
  markdown: string;
  githubBlobUrl: string;
};

export async function loadDoc(
  source: DocsSource,
  slug: readonly string[],
): Promise<LoadedDoc | null> {
  const pages = await listDocsPages(source);
  const href = hrefForPage(source.id, slug);
  let page = pages.find((item) => item.href === href) ?? null;
  if (!page && slug.length === 0) {
    page = pages.find((item) => item.path.toLowerCase() === "readme.md") ?? null;
  }
  if (!page) {
    // The file list was unavailable (no GitHub access, no local checkout), so
    // the slug has to be resolved straight to a path. A slug can address
    // either a markdown file or a directory index, and the URL gives no way
    // to tell which, so both candidates are tried before giving up.
    for (const guessed of repoPathCandidates(slug)) {
      try {
        const markdown = rewriteMarkdownLinks(
          await readMarkdownFile(source, guessed),
          source,
          guessed,
        );
        return {
          source,
          page: {
            path: guessed,
            slug,
            href,
            title: titleFromRepoPath(guessed),
            group: groupFromSlug(slug),
          },
          markdown,
          githubBlobUrl: `https://github.com/${source.owner}/${source.repo}/blob/${source.branch}/${guessed}`,
        };
      } catch {
        continue;
      }
    }
    return null;
  }
  const markdown = rewriteMarkdownLinks(
    await readMarkdownFile(source, page.path),
    source,
    page.path,
  );
  return {
    source,
    page,
    markdown,
    githubBlobUrl: `https://github.com/${source.owner}/${source.repo}/blob/${source.branch}/${page.path}`,
  };
}
