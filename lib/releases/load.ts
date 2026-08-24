import { createGithubFetchInit } from "@/lib/github/client";
import { classifyReleases, type ClassifiedReleases, type GithubRelease } from "@/lib/releases/types";

export async function fetchRepoReleases(
  owner: string,
  repo: string,
): Promise<GithubRelease[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=100`;
  const response = await fetch(url, createGithubFetchInit());
  if (!response.ok) {
    throw new Error(`GitHub releases ${owner}/${repo}: ${response.status}`);
  }
  const payload = (await response.json()) as GithubRelease[];
  return payload;
}

export async function loadClassifiedReleases(
  owner: string,
  repo: string,
): Promise<ClassifiedReleases> {
  try {
    const releases = await fetchRepoReleases(owner, repo);
    return classifyReleases(releases);
  } catch {
    return { latest: null, stable: null, others: [] };
  }
}
