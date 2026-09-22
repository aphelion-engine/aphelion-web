import type { Metadata } from "next";
import Image from "next/image";
import NextLink from "next/link";

import { ButtonLink } from "@/components/button-link";
import { JsonLd } from "@/components/json-ld";
import { PluginExample } from "@/components/plugin-example";
import {
    jsonLdGraph,
    pageMetadata,
    softwareApplicationSchema,
} from "@/lib/seo";
import {
    EDITOR_CAPABILITIES,
    EDITOR_LIMITATIONS,
    EDITOR_NODE_CATEGORY_COUNT,
    EDITOR_NODE_COUNT,
    EDITOR_RELEASES_URL,
    EDITOR_VERSION,
    GITHUB_EDITOR_REPO,
    GITHUB_EDITOR_URL,
    GITHUB_ORG,
    PYTHON_REQUIREMENT,
    SITE_SUMMARY,
} from "@/lib/site";
import { INLINE_CODE, TEXT_LINK } from "@/lib/ui";

export const metadata: Metadata = pageMetadata({
  title: "Aphelion Editor | Node-Based Video Compositor for Desktop",
  absoluteTitle: true,
  description:
    `Aphelion Editor is a node-based video compositor for desktop: ${EDITOR_NODE_COUNT} ` +
    "built-in nodes, tracking, keying, rotoscoping, colour tools and a Python plugin SDK.",
  path: "/",
});

/** The questions a visitor — or an answer engine — asks first. */
const KEY_FACTS: readonly { question: string; answer: React.ReactNode }[] = [
  {
    question: "What is Aphelion Editor?",
    answer:
      "A desktop video compositor and editor built around a node graph. You bring media in, wire operations together, and view the result through a Viewer node.",
  },
  {
    question: "What does it run on?",
    answer: `Windows, macOS and Linux. The Windows installer is published on GitHub releases; macOS and Linux run from a Python ${PYTHON_REQUIREMENT} checkout.`,
  },
  {
    question: "What can it do?",
    answer: `Node compositing, colour correction, chroma keying, rotoscoping, point and planar tracking, transforms and distortions, proxy preview and frame caching, and MP4 or PNG sequence export — ${EDITOR_NODE_COUNT} built-in nodes across ${EDITOR_NODE_CATEGORY_COUNT} categories.`,
  },
  {
    question: "Can I extend it?",
    answer:
      "Yes. The plugin SDK lets you write custom video-effect nodes in Python and drop them into the editor, where they appear alongside the built-in nodes.",
  },
  {
    question: "Is it free to use?",
    answer: (
      <>
        That depends on what you intend to do — the licence terms are declared in each
        package&apos;s <code className={INLINE_CODE}>pyproject.toml</code> and summarised on the{" "}
        <NextLink className={TEXT_LINK} href="/about">
          about page
        </NextLink>
        .
      </>
    ),
  },
];

export default function HomePage(): React.ReactElement {
  return (
    <div>
      <section className="aph-graph border-b border-[#121212]">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 lg:pt-16">
          <p className="aph-timecode">
            v{EDITOR_VERSION} · Python {PYTHON_REQUIREMENT} · Windows, macOS, Linux
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
            Aphelion Editor — a node-based video compositor for the desktop
          </h1>
          <p className="aph-lede mt-5 text-base">{SITE_SUMMARY}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink size="lg" href="/editor">
              Download for Windows
            </ButtonLink>
            <ButtonLink size="lg" href="/features" variant="secondary">
              See what it does
            </ButtonLink>
            <NextLink className={`${TEXT_LINK} text-sm`} href="/docs/editor/getting-started">
              Install guide
            </NextLink>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-12">
          <figure>
            <div className="aph-dock">
              <div className="aph-dock__title">Default workspace</div>
              <Image
                src="/aphelion-editor-app-sample.png"
                alt="Aphelion Editor showing a node graph above a timeline, with the property inspector on the right"
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, (max-width: 1152px) 100vw, 1152px"
                className="h-auto w-full"
                priority
              />
            </div>
            <figcaption className="mt-2 text-xs text-muted">
              Node graph, timeline and property inspector.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-[#121212]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="aph-section-title">What Aphelion Editor is</h2>
          <dl className="aph-panel mt-6">
            {KEY_FACTS.map((fact, index) => (
              <div
                key={fact.question}
                className={`grid gap-1 px-4 py-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-6 ${
                  index > 0 ? "border-t border-[#2a2a2a]" : ""
                }`}
              >
                <dt className="font-mono text-xs text-[#9ecfff] sm:pt-0.5">{fact.question}</dt>
                <dd className="text-sm text-muted">{fact.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-[#121212]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="aph-section-title">Capabilities</h2>
            <NextLink className={`${TEXT_LINK} text-sm`} href="/features">
              All features in detail
            </NextLink>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            The{" "}
            <NextLink className={TEXT_LINK} href="/docs/editor/user-guide">
              user guide
            </NextLink>{" "}
            covers the workspace and shortcuts, and the{" "}
            <NextLink className={TEXT_LINK} href="/docs/editor/plugins">
              plugin docs
            </NextLink>{" "}
            cover writing nodes.
          </p>

          <dl className="aph-panel mt-6">
            {EDITOR_CAPABILITIES.map((capability, index) => (
              <div
                key={capability.label}
                className={`grid gap-1 px-4 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6 ${
                  index > 0 ? "border-t border-[#2a2a2a]" : ""
                }`}
              >
                <dt className="font-mono text-xs text-[#9ecfff] sm:pt-0.5">{capability.label}</dt>
                <dd className="text-sm text-muted">{capability.detail}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/features/node-compositing",
                label: "Node-based compositing",
                detail: "How the graph is evaluated, cached and previewed.",
              },
              {
                href: "/features/tracking",
                label: "Tracking and match move",
                detail: "Point tracking, planar tracking, corner pin, and track recovery.",
              },
              {
                href: "/features/keying",
                label: "Chroma keying",
                detail: "Extract a matte, refine its edges, and combine mattes.",
              },
              {
                href: "/features/color",
                label: "Colour correction",
                detail: "Primary correction, tonal control and grading looks.",
              },
              {
                href: "/features/roto",
                label: "Rotoscoping and masks",
                detail: "Animated Bezier shapes and shape tracking.",
              },
              {
                href: "/plugins",
                label: "Plugins",
                detail: "Add your own nodes in Python.",
              },
            ].map((item) => (
              <li key={item.href}>
                <NextLink className="aph-card h-full" href={item.href}>
                  <span className="text-base font-semibold text-[#e6e6e6]">{item.label}</span>
                  <span className="text-sm text-muted">{item.detail}</span>
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-[#121212]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12">
          <div>
            <h2 className="aph-section-title">Writing nodes</h2>
            <p className="mt-4 text-sm text-muted">
              A plugin is a Python class that imports{" "}
              <code className={INLINE_CODE}>aphelion_sdk</code> and returns a modified frame. Drop
              the file in <code className={INLINE_CODE}>plugins/</code> and it appears in the node
              list with its own inspector properties. Plugins are enabled, disabled and reloaded
              from Preferences, under Plugins, without restarting.
            </p>
            <p className="mt-3 text-sm text-muted">
              The SDK ships video effect bases. Audio plugin bases are not available yet.
            </p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <NextLink className={TEXT_LINK} href="/sdk">
                SDK install steps and API surface
              </NextLink>
              <NextLink className={TEXT_LINK} href="/plugins">
                How plugins are loaded
              </NextLink>
            </p>
          </div>
          <PluginExample />
        </div>
      </section>

      <section className="border-b border-[#121212]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div>
            <h2 className="aph-section-title">Project status</h2>
            <p className="mt-4 text-sm text-muted">
              Version {EDITOR_VERSION}. The points below are worth knowing before installing.
            </p>
            <p className="mt-4 text-sm">
              <NextLink className={TEXT_LINK} href="/about">
                More about the project
              </NextLink>
            </p>
          </div>
          <ul className="space-y-2">
            {EDITOR_LIMITATIONS.map((limitation) => (
              <li key={limitation} className="aph-row flex gap-3 px-4 py-3 text-sm text-muted">
                <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#ffbe3c]" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-[#121212]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
            <div>
              <h2 className="aph-section-title">Free to try. One license for everything.</h2>
              <p className="mt-4 text-sm text-muted">
                Aphelion Editor is free to download and use for a seven-day trial. After that, it
                asks you to purchase a license, but it does not lock you out or disable your work.
                The model is intentionally closer to Reaper or WinRAR than a hard stop.
              </p>
              <p className="mt-4 text-sm text-muted">
                A single lifetime Aphelion license covers Aphelion Editor and all current and future
                Aphelion software. There is no recurring subscription for the license.
              </p>
              <NextLink className={`${TEXT_LINK} mt-5 inline-flex text-sm`} href="/license">
                Read the licensing details and purchase
              </NextLink>
            </div>
            <dl className="aph-panel">
              {[
                ["01", "Download", "Install Aphelion Editor and explore the complete node-based compositor."],
                ["02", "Seven days", "Use the editor normally. The trial reminder appears after seven days."],
                ["03", "Own the suite", "Purchase one lifetime license and redeem it once for each Aphelion product you use."],
              ].map(([number, title, detail], index) => (
                <div
                  key={number}
                  className={`grid gap-3 px-4 py-4 sm:grid-cols-[2.5rem_8rem_minmax(0,1fr)] sm:items-start sm:gap-4 ${
                    index > 0 ? "border-t border-[#2a2a2a]" : ""
                  }`}
                >
                  <span className="font-mono text-xs text-[#50a0ff]">{number}</span>
                  <dt className="text-sm font-semibold text-[#e6e6e6]">{title}</dt>
                  <dd className="text-sm text-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="aph-section-title">Get Aphelion Editor</h2>
            <p className="mt-4 text-sm text-muted">
              The Windows installer bundles the plugin SDK. On macOS and Linux, install from a
              checkout of the repository.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/editor">Download</ButtonLink>
              <ButtonLink href="/docs/editor/getting-started" variant="secondary">
                Installation guide
              </ButtonLink>
            </div>
          </div>
          <div>
            <h2 className="aph-section-title">Source and releases</h2>
            <p className="mt-4 text-sm text-muted">
              The source is on GitHub at{" "}
              <a className={TEXT_LINK} href={GITHUB_EDITOR_URL} target="_blank" rel="noreferrer">
                {GITHUB_ORG}/{GITHUB_EDITOR_REPO}
              </a>
              . Release builds and their notes are on the{" "}
              <a className={TEXT_LINK} href={EDITOR_RELEASES_URL} target="_blank" rel="noreferrer">
                releases page
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <JsonLd
        data={jsonLdGraph([
          softwareApplicationSchema({
            version: EDITOR_VERSION,
            downloadUrl: `${EDITOR_RELEASES_URL}`,
            operatingSystem: "Windows, macOS, Linux",
          }),
        ])}
      />
    </div>
  );
}
