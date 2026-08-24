import { LogoGithub } from "@gravity-ui/icons";

import { ButtonLink } from "@/components/button-link";
import { ReleaseCard } from "@/components/releases/release-card";
import type { ClassifiedReleases, GithubRelease, ReleaseKind } from "@/lib/releases/types";

type ReleaseBoardProps = {
  classified: ClassifiedReleases;
  githubUrl: string;
  emptyLabel: string;
};

function kindsFor(release: GithubRelease, classified: ClassifiedReleases): ReleaseKind[] {
  const kinds: ReleaseKind[] = [];
  if (classified.latest?.id === release.id) {
    kinds.push("latest");
  }
  if (classified.stable?.id === release.id) {
    kinds.push("stable");
  }
  if (kinds.length === 0) {
    kinds.push("other");
  }
  return kinds;
}

export function ReleaseBoard({
  classified,
  githubUrl,
  emptyLabel,
}: ReleaseBoardProps): React.ReactElement {
  const { latest, stable, others } = classified;
  const featured: GithubRelease[] = [];
  if (latest) {
    featured.push(latest);
  }
  if (stable && stable.id !== latest?.id) {
    featured.push(stable);
  }

  if (!latest && !stable && others.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-separator bg-surface-secondary px-6 py-12 text-center">
        <p className="text-muted">{emptyLabel}</p>
        <div className="mt-4 flex justify-center">
          <ButtonLink href={githubUrl} variant="secondary" target="_blank" rel="noreferrer">
            <LogoGithub className="size-4" />
            Open GitHub
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {featured.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {featured.map((release) => (
            <ReleaseCard
              key={release.id}
              release={release}
              kinds={kindsFor(release, classified)}
              featured
            />
          ))}
        </div>
      ) : null}

      {others.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">All other releases</h2>
          <div className="grid gap-3">
            {others.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                kinds={kindsFor(release, classified)}
                featured={false}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
