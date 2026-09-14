import { ArrowDownToSquare } from "@gravity-ui/icons";
import type { Metadata } from "next";
import NextLink from "next/link";

import { ButtonLink } from "@/components/button-link";
import { CopyCommand } from "@/components/copy-command";
import { ReleaseBoard } from "@/components/releases/release-board";
import { loadClassifiedReleases } from "@/lib/releases/load";
import { pickPrimaryAsset } from "@/lib/releases/types";
import {
    EDITOR_CLONE_INSTALL,
    EDITOR_LAUNCH,
    EDITOR_RELEASES_URL,
    EDITOR_REQUIREMENTS,
    EDITOR_VERSION,
    GITHUB_EDITOR_REPO,
    GITHUB_EDITOR_URL,
    GITHUB_ORG,
    PYTHON_REQUIREMENT,
} from "@/lib/site";
import { INLINE_CODE, TEXT_LINK } from "@/lib/ui";

import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Download Aphelion Editor for Windows and Build from Source",
  absoluteTitle: true,
  description:
    `Download the latest Aphelion Editor release, or build it from a Python ${PYTHON_REQUIREMENT} checkout. ` +
    "System requirements and installation steps.",
  path: "/editor",
});

export default async function EditorPage(): Promise<React.ReactElement> {
  const classified = await loadClassifiedReleases(GITHUB_ORG, GITHUB_EDITOR_REPO);
  const latestAsset = classified.latest ? pickPrimaryAsset(classified.latest) : null;
  const downloadHref =
    latestAsset?.browser_download_url ?? classified.latest?.html_url ?? EDITOR_RELEASES_URL;

  return (
    <div>
      <section className="aph-graph border-b border-[#121212]">
        <div className="mx-auto max-w-6xl px-4 py-12 lg:py-14">
          <p className="aph-timecode">
            v{EDITOR_VERSION} · Python {PYTHON_REQUIREMENT}
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Download Aphelion Editor
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Builds come from the repository&apos;s GitHub releases. The newest release is listed
            first, and anything tagged <code className={INLINE_CODE}>-stable</code> gets its own
            entry. The Windows installer bundles the plugin SDK wheel.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink size="lg" href={downloadHref}>
              <ArrowDownToSquare className="size-5" />
              {classified.latest ? `Download ${classified.latest.tag_name}` : "Releases on GitHub"}
            </ButtonLink>
            <ButtonLink size="lg" href="/docs/editor/getting-started" variant="secondary">
              Install guide
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-b border-[#121212]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="aph-section-title">Releases</h2>
          <div className="mt-6">
            <ReleaseBoard
              classified={classified}
              githubUrl={EDITOR_RELEASES_URL}
              emptyLabel="No GitHub releases yet. Publish one on aphelion-editor and it will appear here."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[#121212]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="aph-section-title">Build from source</h2>
            <p className="mt-4 text-sm text-muted">
              This is the only route on macOS and Linux. Clone the repository, then from{" "}
              <code className={INLINE_CODE}>aphelion-editor/</code> run:
            </p>
            <div className="mt-4 space-y-4">
              <CopyCommand
                label="Install the editor with its test and freeze extras"
                command={EDITOR_CLONE_INSTALL}
              />
              <CopyCommand label="Launch the editor" command={EDITOR_LAUNCH} />
              <CopyCommand
                label="Build a Windows MSI installer (Windows only)"
                command="python main.py --build-installer"
              />
            </div>
            <p className="mt-4 text-sm text-muted">
              Full setup notes, including virtual environment activation, are in the{" "}
              <NextLink className={TEXT_LINK} href="/docs/editor/getting-started">
                getting started guide
              </NextLink>
              .
            </p>
          </div>

          <div>
            <h2 className="aph-section-title">Requirements</h2>
            <div className="aph-panel mt-4 overflow-hidden">
              <table className="aph-table">
                <caption className="sr-only">Aphelion Editor runtime dependencies</caption>
                <thead>
                  <tr>
                    <th scope="col">Dependency</th>
                    <th scope="col">Version</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {EDITOR_REQUIREMENTS.map((requirement) => (
                    <tr key={requirement.dependency}>
                      <td>{requirement.dependency}</td>
                      <td className="font-mono text-xs">{requirement.version}</td>
                      <td>{requirement.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted">
              The MSI is Windows only. On other platforms the editor runs from a Python
              environment.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="max-w-2xl text-sm text-muted">
            Aphelion Editor is the only application in the line so far. Source and issues are at{" "}
            <a className={TEXT_LINK} href={GITHUB_EDITOR_URL} target="_blank" rel="noreferrer">
              github.com/{GITHUB_ORG}/{GITHUB_EDITOR_REPO}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
