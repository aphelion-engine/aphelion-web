import type { DocsSource } from "@/lib/docs/catalog";
import { fetchGithubFile, fetchGithubTree } from "@/lib/docs/github";
import { listLocalMarkdown, readLocalFile } from "@/lib/docs/local";
import { rewriteMarkdownLinks } from "@/lib/docs/links";
import {
  hrefForPage,
  isDocsMarkdownPath,
  repoPathFromSlug,
  slugFromRepoPath,
  titleFromRepoPath,
  type DocsPage,
} from "@/lib/docs/paths";

function toPages(source: DocsSource, paths: string[]): DocsPage[] {
  const unique = [...new Set(paths.filter(isDocsMarkdownPath))];
  const pages = unique.map((repoPath) => {
    const slug = slugFromRepoPath(repoPath);
    return {
      path: repoPath,
      slug,
      href: hrefForPage(source.id, slug),
      title: titleFromRepoPath(repoPath),
    };
  });
  pages.sort((a, b) => {
    if (a.slug.length === 0) {
      return -1;
    }
    if (b.slug.length === 0) {
      return 1;
    }
    return a.title.localeCompare(b.title);
  });
  const seen = new Set<string>();
  return pages.filter((page) => {
    if (seen.has(page.href)) {
      return false;
    }
    seen.add(page.href);
    return true;
  });
}

export async function listDocsPages(source: DocsSource): Promise<DocsPage[]> {
  try {
    const tree = await fetchGithubTree(source);
    return toPages(source, tree);
  } catch {
    const local = await listLocalMarkdown(source);
    return toPages(source, local);
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
    const guessed = repoPathFromSlug(slug);
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
        },
        markdown,
        githubBlobUrl: `https://github.com/${source.owner}/${source.repo}/blob/${source.branch}/${guessed}`,
      };
    } catch {
      return null;
    }
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
