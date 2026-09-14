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

  if (featured.length === 0 && others.length === 0) {
    return (
      <div className="aph-dock">
        <div className="aph-dock__title">Releases</div>
        <div className="aph-dock__body text-center">
          <p className="text-sm text-muted">{emptyLabel}</p>
          <div className="mt-4 flex justify-center">
            <ButtonLink href={githubUrl} variant="secondary" target="_blank" rel="noreferrer">
              Open GitHub
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
        <div>
          <h3 className="aph-section-title mb-3">
            {others.length} older {others.length === 1 ? "release" : "releases"}
          </h3>
          <div className="space-y-2">
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
