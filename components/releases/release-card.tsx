import { ArrowDownToSquare } from "@gravity-ui/icons";

import { ButtonLink } from "@/components/button-link";
import {
    formatBytes,
    formatReleaseDate,
    pickPrimaryAsset,
    releaseTitle,
    type GithubRelease,
    type ReleaseKind,
} from "@/lib/releases/types";

type ReleaseCardProps = {
  release: GithubRelease;
  kinds: readonly ReleaseKind[];
  featured: boolean;
};

function kindLabel(kind: ReleaseKind): string {
  if (kind === "latest") {
    return "Latest";
  }
  if (kind === "stable") {
    return "Stable";
  }
  return "Older";
}

function kindClass(kind: ReleaseKind): string {
  if (kind === "stable") {
    return "aph-chip aph-chip--success";
  }
  if (kind === "latest") {
    return "aph-chip aph-chip--accent";
  }
  return "aph-chip";
}

export function ReleaseCard({ release, kinds, featured }: ReleaseCardProps): React.ReactElement {
  const primaryAsset = pickPrimaryAsset(release);
  const assets = release.assets;
  const primaryHref = primaryAsset?.browser_download_url ?? release.zipball_url;

  return (
    <article className={featured ? "aph-panel p-5" : "aph-row p-4"}>
      <div className="flex flex-wrap items-center gap-2">
        {kinds.map((kind) => (
          <span key={kind} className={kindClass(kind)}>
            {kindLabel(kind)}
          </span>
        ))}
        {release.prerelease ? <span className="aph-chip aph-chip--warn">Pre-release</span> : null}
        <span className="ml-auto font-mono text-[11px] text-muted">
          {formatReleaseDate(release.published_at)}
        </span>
      </div>

      <h3
        className={
          featured
            ? "mt-3 text-lg font-semibold tracking-tight"
            : "mt-2 text-base font-medium"
        }
      >
        {releaseTitle(release)}
      </h3>
      <p className="mt-0.5 font-mono text-xs text-muted">{release.tag_name}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <ButtonLink size={featured ? "md" : "sm"} href={primaryHref}>
          <ArrowDownToSquare className="size-4" />
          {primaryAsset ? `Download ${primaryAsset.name}` : "Download source zip"}
        </ButtonLink>
        <a
          href={release.html_url}
          target="_blank"
          rel="noreferrer"
          className="aph-link text-sm"
        >
          Release notes
        </a>
      </div>

      {assets.length > 1 ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-muted transition-colors hover:text-foreground">
            {assets.length} assets
          </summary>
          <ul className="mt-2 space-y-1.5 border-t border-separator pt-2">
            {assets.map((asset) => (
              <li key={asset.id} className="flex items-baseline justify-between gap-4 text-sm">
                <a className="aph-link break-anywhere" href={asset.browser_download_url}>
                  {asset.name}
                </a>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {formatBytes(asset.size)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </article>
  );
}
