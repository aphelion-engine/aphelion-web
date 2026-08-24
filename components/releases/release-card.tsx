import { ArrowDownToSquare, LogoGithub } from "@gravity-ui/icons";
import { Chip } from "@heroui/react";

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
  return "Release";
}

export function ReleaseCard({ release, kinds, featured }: ReleaseCardProps): React.ReactElement {
  const primaryAsset = pickPrimaryAsset(release);
  const assets = release.assets;
  const primaryHref = primaryAsset?.browser_download_url ?? release.zipball_url;
  const primaryLabel = primaryAsset ? primaryAsset.name : `${release.tag_name}.zip`;

  return (
    <article
      className={
        featured
          ? "release-card-featured rounded-2xl p-6 shadow-[0_24px_60px_-20px_rgba(43,110,168,0.55)]"
          : "rounded-xl border border-separator bg-surface p-5"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        {kinds.map((kind) => (
          <Chip
            key={kind}
            size="sm"
            variant="soft"
            color={kind === "stable" ? "success" : kind === "latest" ? "accent" : "default"}
          >
            <Chip.Label>{kindLabel(kind)}</Chip.Label>
          </Chip>
        ))}
        {release.prerelease ? (
          <Chip size="sm" variant="soft">
            <Chip.Label>Pre-release</Chip.Label>
          </Chip>
        ) : null}
      </div>
      <h3 className={featured ? "mt-3 text-2xl font-semibold tracking-tight" : "mt-3 text-lg font-semibold"}>
        {releaseTitle(release)}
      </h3>
      <p className="mt-1 font-mono text-sm text-muted">{release.tag_name}</p>
      <p className="mt-1 text-sm text-muted">{formatReleaseDate(release.published_at)}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <ButtonLink href={primaryHref} size={featured ? "lg" : "md"}>
          <ArrowDownToSquare className="size-4" />
          {assets.length > 0 ? `Download ${primaryLabel}` : "Download source zip"}
        </ButtonLink>
        <ButtonLink href={release.html_url} variant="secondary" target="_blank" rel="noreferrer">
          <LogoGithub className="size-4" />
          Notes
        </ButtonLink>
      </div>
      {assets.length > 1 ? (
        <ul className="mt-4 space-y-2 border-t border-separator pt-4">
          {assets.map((asset) => (
            <li key={asset.id} className="flex items-center justify-between gap-3 text-sm">
              <a className="text-accent hover:underline" href={asset.browser_download_url}>
                {asset.name}
              </a>
              <span className="shrink-0 text-muted">{formatBytes(asset.size)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
