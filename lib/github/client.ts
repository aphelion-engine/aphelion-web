export const GITHUB_RELEASES_TAG = "github-releases";

export const RELEASES_REVALIDATE_SECONDS = 60;

export function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "aphelion-web",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function createGithubFetchInit(): RequestInit {
  return {
    headers: githubHeaders(),
    next: { revalidate: RELEASES_REVALIDATE_SECONDS, tags: [GITHUB_RELEASES_TAG] },
  };
}
