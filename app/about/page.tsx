import type { Metadata } from "next";
import NextLink from "next/link";

import { PageHeader, Section } from "@/components/page";
import { pageMetadata } from "@/lib/seo";
import {
    EDITOR_ISSUES_URL,
    EDITOR_NODE_CATEGORY_COUNT,
    EDITOR_NODE_COUNT,
    EDITOR_RELEASES_URL,
    EDITOR_VERSION,
    GITHUB_EDITOR_URL,
    LICENSE_STATEMENT,
    PYTHON_REQUIREMENT,
    SOURCE_ACCESS_STATEMENT,
} from "@/lib/site";
import { TEXT_LINK } from "@/lib/ui";

export const metadata: Metadata = pageMetadata({
  // "About Aphelion Editor" would render as "About Aphelion Editor |
  // Aphelion Editor" once the root template appends the brand.
  title: "About",
  description:
    `What Aphelion Editor is, what state the project is in at version ${EDITOR_VERSION}, where the source lives, how bugs are reported, and how the application is licensed.`,
  path: "/about",
});

const FACTS: readonly { label: string; value: string }[] = [
  { label: "Product", value: "Aphelion Editor" },
  { label: "Version", value: EDITOR_VERSION },
  { label: "Kind", value: "Desktop node-based video compositor and editor" },
  { label: "Written in", value: `Python ${PYTHON_REQUIREMENT}, with a C extension for frame kernels` },
  { label: "Platforms", value: "Windows (MSI installer), macOS and Linux (from source)" },
  { label: "Built-in nodes", value: `${EDITOR_NODE_COUNT} across ${EDITOR_NODE_CATEGORY_COUNT} categories` },
  { label: "Source", value: "github.com/aphelion-engine/aphelion-editor" },
];

export default function AboutPage(): React.ReactElement {
  return (
    <div>
      <PageHeader
        eyebrow={
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
            <NextLink className={TEXT_LINK} href="/">
              Aphelion
            </NextLink>
            <span aria-hidden> › </span>
            <span aria-current="page">About</span>
          </nav>
        }
        title="About Aphelion Editor"
        lede={
          <>
            Aphelion Editor is a desktop, node-based video compositor and editor. It is developed by
            the Aphelion Engine project and distributed from GitHub, with a Windows installer and a
            Python source tree for macOS and Linux.
          </>
        }
      />

      <Section id="facts" title="Project facts">
        <dl className="aph-panel">
          {FACTS.map((fact, index) => (
            <div
              key={fact.label}
              className={`grid gap-1 px-4 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6 ${
                index > 0 ? "border-t border-[#2a2a2a]" : ""
              }`}
            >
              <dt className="font-mono text-xs text-[#9ecfff] sm:pt-0.5">{fact.label}</dt>
              <dd className="text-sm text-muted">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="status" title="Where the project is">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="aph-prose">
            <p>
              Version {EDITOR_VERSION} is an early release. The node graph, timeline, keying, roto,
              tracking and export paths are implemented and documented, and the plugin SDK is
              published, but the project is pre-1.0 and APIs can still move.
            </p>
            <p>
              The site is deliberately specific about what works and what does not. The known gaps
              as of this version are that the installable MSI is Windows only, that macOS and Linux
              run from a Python checkout rather than an installer, and that the plugin SDK covers
              video effects only — audio plugin bases are not shipped.
            </p>
            <p>
              <NextLink className={TEXT_LINK} href="/editor">
                Releases and installation
              </NextLink>
              {" · "}
              <NextLink className={TEXT_LINK} href="/docs/editor/getting-started">
                Getting started guide
              </NextLink>
            </p>
          </div>
          <aside className="aph-panel aph-prose px-4 py-4">
            <h3 className="!mt-0">How this site is built</h3>
            <p>
              The documentation on this site is not a copy. It is rendered from the markdown files
              in the editor and SDK repositories on a short cache, so the published docs and the
              source cannot drift apart, and a corrected page is corrected here at the same time.
            </p>
          </aside>
        </div>
      </Section>

      <Section id="source" title="Source and reporting problems">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aph-prose">
            <h3 className="!mt-0">Reading the source</h3>
            <p>{SOURCE_ACCESS_STATEMENT}</p>
            <p>
              <a className={TEXT_LINK} href={GITHUB_EDITOR_URL} target="_blank" rel="noreferrer">
                github.com/aphelion-engine/aphelion-editor
              </a>
            </p>
            <h3>Reporting a bug</h3>
            <p>
              Bug reports go to the repository&apos;s issue tracker. A report that includes the
              version, the operating system, and the steps that reproduce the problem is
              dramatically faster to act on than one that does not.
            </p>
            <p>
              <a className={TEXT_LINK} href={EDITOR_ISSUES_URL} target="_blank" rel="noreferrer">
                Open an issue on GitHub
              </a>
              {" · "}
              <a className={TEXT_LINK} href={EDITOR_RELEASES_URL} target="_blank" rel="noreferrer">
                Release notes
              </a>
            </p>
          </div>
          <div className="aph-prose">
            <h3 className="!mt-0">Licensing</h3>
            <p>{LICENSE_STATEMENT}</p>
            <p className="text-xs">
              The authoritative statement for any release is the licence field in that
              package&apos;s <code>pyproject.toml</code>. This page summarises it; it does not
              replace it.
            </p>
          </div>
        </div>
      </Section>

      <Section id="more" title="More">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/features", label: "Features", detail: "What the editor does, area by area." },
            { href: "/docs", label: "Documentation", detail: "Guides and tutorials." },
            { href: "/plugins", label: "Plugins", detail: "Adding nodes in Python." },
            { href: "/sdk", label: "Plugin SDK", detail: "The developer surface." },
          ].map((item) => (
            <li key={item.href}>
              <NextLink className="aph-card h-full" href={item.href}>
                <span className="text-base font-semibold text-[#e6e6e6]">{item.label}</span>
                <span className="text-sm text-muted">{item.detail}</span>
              </NextLink>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
