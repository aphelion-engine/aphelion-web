export type GithubReleaseAsset = {
  id: number;
  name: string;
  size: number;
  browser_download_url: string;
  content_type: string;
};

export type GithubRelease = {
  id: number;
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  prerelease: boolean;
  draft: boolean;
  zipball_url: string;
  assets: GithubReleaseAsset[];
};

export type ReleaseKind = "latest" | "stable" | "other";

export type ClassifiedReleases = {
  latest: GithubRelease | null;
  stable: GithubRelease | null;
  others: GithubRelease[];
};

export function isStableTag(tagName: string): boolean {
  return tagName.endsWith("-stable");
}

export function classifyReleases(releases: readonly GithubRelease[]): ClassifiedReleases {
  const published = releases.filter((release) => !release.draft);
  const latest = published[0] ?? null;
  const stable = published.find((release) => isStableTag(release.tag_name)) ?? null;
  const featuredIds = new Set<number>();
  if (latest) {
    featuredIds.add(latest.id);
  }
  if (stable) {
    featuredIds.add(stable.id);
  }
  const others = published.filter((release) => !featuredIds.has(release.id));
  return { latest, stable, others };
}

export function releaseTitle(release: GithubRelease): string {
  const named = release.name?.trim();
  if (named) {
    return named;
  }
  return release.tag_name;
}

export function formatBytes(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function pickPrimaryAsset(release: GithubRelease): GithubReleaseAsset | null {
  const ranked = [".msi", ".exe", ".dmg", ".whl", ".zip"];
  for (const suffix of ranked) {
    const match = release.assets.find((asset) => asset.name.toLowerCase().endsWith(suffix));
    if (match) {
      return match;
    }
  }
  return release.assets[0] ?? null;
}

export function formatReleaseDate(iso: string | null): string {
  if (!iso) {
    return "Unpublished";
  }
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
