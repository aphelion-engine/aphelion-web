import { ArrowDownToSquare } from "@gravity-ui/icons";
import type { Metadata } from "next";
import NextLink from "next/link";

import { ButtonLink } from "@/components/button-link";
import { CopyCommand } from "@/components/copy-command";
import { ReleaseBoard } from "@/components/releases/release-board";
import { loadClassifiedReleases } from "@/lib/releases/load";
import { pickPrimaryAsset } from "@/lib/releases/types";
import { pageMetadata } from "@/lib/seo";
import {
    GITHUB_ORG,
    GITHUB_SDK_REPO,
    GITHUB_SDK_URL,
    PIP_CHECKOUT_INSTALL,
    PIP_PACKAGE_INSTALL,
    PYTHON_REQUIREMENT,
    SDK_RELEASES_URL,
    SDK_VERSION,
} from "@/lib/site";
import { INLINE_CODE, TEXT_LINK } from "@/lib/ui";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Plugin SDK — Video Effects in Python | Aphelion Editor",
  absoluteTitle: true,
  description:
    "The Aphelion plugin SDK adds custom video-effect nodes in Python. Install with pip, subclass an effect base, and drop it into the plugin folder.",
  path: "/sdk",
});

type ApiEntry = {
  name: string;
  detail: string;
};

const API_SURFACE: readonly ApiEntry[] = [
  {
    name: "VideoEffectPlugin",
    detail:
      "Subclass it, declare plugin_name and plugin_category, and implement process_frame.",
  },
  {
    name: "register_plugin",
    detail: "Class decorator that adds the plugin to the node list on startup.",
  },
  {
    name: "Property factories",
    detail:
      "slider_property, toggle_property, choice_property, color_property, text_property, number_property and custom_property build inspector controls.",
  },
  {
    name: "Frame and ColorRgb",
    detail:
      "Frame is a float32 RGB array in the 0 to 1 range, the same buffers the graph passes around.",
  },
  {
    name: "PanelWidget and DialogWidget",
    detail:
      "Attach docked panels and popup dialogs to a plugin with widgets = (...). They render with host primitives or, if you prefer, PyQt6 widgets directly.",
  },
  {
    name: "Discovery helpers",
    detail:
      "get_registered_plugins and discover_installed_plugins are available for tools that need to inspect what is loaded.",
  },
];

const EXAMPLES: readonly { file: string; note: string }[] = [
  {
    file: "grayscale_effect.py",
    note: "The smallest useful effect: one slider, one frame transform.",
  },
  {
    file: "effect_with_widget.py",
    note: "The same effect with a docked status panel and a notes dialog.",
  },
];

export default async function SdkPage(): Promise<React.ReactElement> {
  const classified = await loadClassifiedReleases(GITHUB_ORG, GITHUB_SDK_REPO);
  const latestAsset = classified.latest ? pickPrimaryAsset(classified.latest) : null;
  const latestHref =
    latestAsset?.browser_download_url ?? classified.latest?.html_url ?? SDK_RELEASES_URL;

  return (
    <div>
      <section className="aph-graph border-b border-[#121212]">
        <div className="mx-auto max-w-6xl px-4 py-12 lg:py-14">
          <p className="aph-timecode">
            v{SDK_VERSION} · Python {PYTHON_REQUIREMENT}
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Write Aphelion plugins in Python
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            A plugin imports <code className={INLINE_CODE}>aphelion_sdk</code> and nothing else.
            Editor internals are off limits, which is what lets a plugin keep working across
            releases.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Video effects are supported. Audio plugin bases are not available yet.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink size="lg" href={latestHref}>
              <ArrowDownToSquare className="size-5" />
              {classified.latest ? `Get ${classified.latest.tag_name}` : "Releases on GitHub"}
            </ButtonLink>
            <ButtonLink size="lg" href="/docs/sdk/authoring" variant="secondary">
              Authoring guide
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm text-muted">
            Repository:{" "}
            <a className={TEXT_LINK} href={GITHUB_SDK_URL} target="_blank" rel="noreferrer">
              github.com/{GITHUB_ORG}/{GITHUB_SDK_REPO}
            </a>
          </p>
        </div>
      </section>

      <section className="border-b border-[#121212]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="aph-section-title">Releases</h2>
          <div className="mt-6">
            <ReleaseBoard
              classified={classified}
              githubUrl={SDK_RELEASES_URL}
              emptyLabel="No GitHub releases yet. Tag a release on aphelion-sdk and it will appear here."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[#121212]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="aph-section-title">Public API</h2>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            The public surface is small on purpose. Full reference in the{" "}
            <NextLink className={TEXT_LINK} href="/docs/sdk">
              SDK docs
            </NextLink>
            .
          </p>
          <dl className="aph-panel mt-6">
            {API_SURFACE.map((entry, index) => (
              <div
                key={entry.name}
                className={`grid gap-1 px-4 py-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6 ${
                  index > 0 ? "border-t border-[#2a2a2a]" : ""
                }`}
              >
                <dt className="font-mono text-xs text-[#9ecfff] sm:pt-0.5">{entry.name}</dt>
                <dd className="text-sm text-muted">{entry.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-[#121212]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="aph-section-title">Install</h2>
            <div className="mt-4 space-y-4">
              <CopyCommand label="Install the published package" command={PIP_PACKAGE_INSTALL} />
              <CopyCommand
                label="Or install from a checkout of this repository"
                command={PIP_CHECKOUT_INSTALL}
              />
            </div>
            <p className="mt-4 text-sm text-muted">
              Installing the editor already pulls the SDK in, so this is only needed when you are
              building plugins somewhere else.
            </p>
          </div>

          <div>
            <h2 className="aph-section-title">Examples</h2>
            <ul className="mt-4 space-y-2">
              {EXAMPLES.map((example) => (
                <li key={example.file} className="aph-row px-4 py-3">
                  <a
                    className={`${TEXT_LINK} font-mono text-sm`}
                    href={`${GITHUB_SDK_URL}/blob/main/examples/${example.file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    examples/{example.file}
                  </a>
                  <p className="mt-1 text-sm text-muted">{example.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Drop a plugin file into <code className={INLINE_CODE}>plugins/</code> or{" "}
              <code className={INLINE_CODE}>userdata/plugins/</code> and reload it from
              Preferences, under Plugins.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
