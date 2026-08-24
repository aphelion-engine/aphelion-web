import { DOCS_REVALIDATE_SECONDS, type DocsSource } from "@/lib/docs/catalog";

const GITHUB_DOCS_TAG = "github-docs";

type GitTreeEntry = {
  path?: string;
  type?: string;
};

type GitTreeResponse = {
  tree?: GitTreeEntry[];
};

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "aphelion-web-docs",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function cacheInit(): RequestInit {
  return {
    headers: githubHeaders(),
    next: { revalidate: DOCS_REVALIDATE_SECONDS, tags: [GITHUB_DOCS_TAG] },
  };
}

export async function fetchGithubTree(source: DocsSource): Promise<string[]> {
  const url = `https://api.github.com/repos/${source.owner}/${source.repo}/git/trees/${source.branch}?recursive=1`;
  const response = await fetch(url, cacheInit());
  if (!response.ok) {
    throw new Error(`GitHub tree ${source.repo}: ${response.status}`);
  }
  const payload = (await response.json()) as GitTreeResponse;
  const tree = payload.tree ?? [];
  return tree
    .filter((entry) => entry.type === "blob" && typeof entry.path === "string")
    .map((entry) => entry.path as string);
}

export async function fetchGithubFile(source: DocsSource, path: string): Promise<string> {
  const encoded = path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const url = `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${source.branch}/${encoded}`;
  const response = await fetch(url, cacheInit());
  if (!response.ok) {
    throw new Error(`GitHub file ${source.repo}/${path}: ${response.status}`);
  }
  return response.text();
}

export { GITHUB_DOCS_TAG };
