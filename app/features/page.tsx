import type { Metadata } from "next";
import NextLink from "next/link";

import { PageHeader, Section } from "@/components/page";
import { pageMetadata } from "@/lib/seo";
import {
    EDITOR_NODE_CATEGORY_COUNT,
    EDITOR_NODE_COUNT,
    EDITOR_VERSION,
    PYTHON_REQUIREMENT,
} from "@/lib/site";
import { TEXT_LINK } from "@/lib/ui";

export const metadata: Metadata = pageMetadata({
  title: "Features",
  description:
    `What Aphelion Editor does: node-graph compositing, ${EDITOR_NODE_COUNT} built-in nodes, colour tools, keying, rotoscoping, tracking and a Python plugin SDK.`,
  path: "/features",
});

type FeatureLink = {
  href: string;
  title: string;
  summary: string;
};

const FEATURE_PAGES: readonly FeatureLink[] = [
  {
    href: "/features/node-compositing",
    title: "Node compositing",
    summary:
      "How the graph is built, evaluated and cached, and what the built-in node library covers.",
  },
  {
    href: "/features/tracking",
    title: "Tracking and match move",
    summary:
      "Point tracking, planar tracking, corner pin, and what happens when a track loses its target.",
  },
  {
    href: "/features/color",
    title: "Colour",
    summary:
      "Primary correction, white balance, curves-style tonal control and creative grading looks.",
  },
  {
    href: "/features/keying",
    title: "Chroma keying",
    summary:
      "Pulling a matte, refining its edges, suppressing spill, and combining mattes from several sources.",
  },
  {
    href: "/features/roto",
    title: "Rotoscoping and masks",
    summary:
      "Bezier shapes, animated mattes, shape tracking and how masks reach the rest of the graph.",
  },
];

/**
 * Capability groups, mapped to the node categories the editor actually
 * registers. Writing them out is the point: a visitor looking for "does it
 * do planar tracking?" should get a straight answer without opening docs.
 */
const CAPABILITY_GROUPS: readonly { group: string; nodes: string; detail: string }[] = [
  {
    group: "Input",
    nodes: "Input/Output, Audio",
    detail:
      "Video files, image sequences, stills, generated patterns, and audio from the same media.",
  },
  {
    group: "Generators",
    nodes: "Generator, Depth Generator",
    detail:
      "Gradients, noise, solids, text and depth sources that produce a frame rather than transform one.",
  },
  {
    group: "Colour",
    nodes: "Color, Creative",
    detail:
      "Exposure, hue and saturation, white balance, levels, vibrance, shadows and highlights, monochrome, posterise, and a tier of creative looks.",
  },
  {
    group: "Filter and stylise",
    nodes: "Filter, Stylize, Distort, Effects",
    detail:
      "Blur, sharpen, edge treatments, warp and displacement, glitch and grain.",
  },
  {
    group: "Compositing",
    nodes: "Compositing, Math, Logic, Values",
    detail:
      "Merge operations, blend modes, arithmetic and logical operators, and value constants for driving properties.",
  },
  {
    group: "Transform",
    nodes: "Transform, Timing",
    detail:
      "Translate, rotate, scale, corner pin, mirror and border handling, plus retiming and hold frames.",
  },
  {
    group: "Keying and mattes",
    nodes: "Keying, Roto",
    detail:
      "Chroma key, matte refinement, spill suppression, mask combination, premultiply, and Bezier roto shapes.",
  },
  {
    group: "Tracking and depth",
    nodes: "Tracking, Depth",
    detail:
      "Point and planar trackers, match move, depth-map processing and relighting from surface normals.",
  },
];

export default function FeaturesPage(): React.ReactElement {
  return (
    <div>
      <PageHeader
        eyebrow={<p className="aph-timecode">Version {EDITOR_VERSION}</p>}
        title="Aphelion Editor features"
        lede={
          <>
            Aphelion is a desktop compositor built around a node graph. Everything the editor does to
            a frame is a node, and every node is inspectable, keyframable and reorderable. This page
            is the map; each section below links to the documentation that covers it in detail.
          </>
        }
      />

      <Section
        id="at-a-glance"
        title="At a glance"
        aside={
          <p className="aph-chip">
            {EDITOR_NODE_COUNT} nodes · {EDITOR_NODE_CATEGORY_COUNT} categories
          </p>
        }
      >
        <dl className="aph-panel">
          {CAPABILITY_GROUPS.map((item, index) => (
            <div
              key={item.group}
              className={`grid gap-1 px-4 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6 ${
                index > 0 ? "border-t border-[#2a2a2a]" : ""
              }`}
            >
              <dt className="font-mono text-xs text-[#9ecfff] sm:pt-0.5">
                {item.group}
                <span className="mt-1 block text-[10px] font-normal text-muted">{item.nodes}</span>
              </dt>
              <dd className="text-sm text-muted">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="in-depth" title="In depth">
        <ul className="grid gap-4 sm:grid-cols-2">
          {FEATURE_PAGES.map((feature) => (
            <li key={feature.href}>
              <NextLink className="aph-card h-full" href={feature.href}>
                <span className="text-base font-semibold text-[#e6e6e6]">{feature.title}</span>
                <span className="text-sm text-muted">{feature.summary}</span>
              </NextLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="workflow" title="Workflow">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="aph-prose">
            <p>
              A project is a graph plus a timeline. You bring media in with an input node, build the
              look by wiring nodes downstream, and view the result through a Viewer node. The
              timeline drives which frame each source is asked for, and any numeric property can be
              keyframed or driven by another node.
            </p>
            <p>
              Preview and export are the same graph. The Viewer has a resolution and a proxy
              setting, so interacting with a heavy 4K graph stays responsive while the export still
              renders at full size. Export writes MP4 through H.264 or a PNG sequence, from
              whichever Viewer is active.
            </p>
          </div>
          <div className="aph-prose">
            <p>
              The editor runs on Python {PYTHON_REQUIREMENT}. A Windows installer is published on the
              releases page; macOS and Linux run from a checkout of the repository.
            </p>
            <p>
              If a node type is missing, the plugin SDK lets you write it in Python and drop it in.
              Plugins are ordinary Python classes, and they appear in the node menu alongside the
              built-ins.
            </p>
            <p className="pt-1">
              <NextLink className={TEXT_LINK} href="/docs/editor/user-guide">
                Read the Aphelion Editor user guide
              </NextLink>
              {" · "}
              <NextLink className={TEXT_LINK} href="/plugins">
                How plugins work
              </NextLink>
            </p>
          </div>
        </div>
      </Section>

      <Section id="next" title="Where to go next">
        <ul className="grid gap-4 sm:grid-cols-3">
          <li>
            <NextLink className="aph-card h-full" href="/editor">
              <span className="text-base font-semibold text-[#e6e6e6]">Download</span>
              <span className="text-sm text-muted">
                Windows installer, system requirements, and building from source.
              </span>
            </NextLink>
          </li>
          <li>
            <NextLink className="aph-card h-full" href="/docs">
              <span className="text-base font-semibold text-[#e6e6e6]">Documentation</span>
              <span className="text-sm text-muted">
                Guides and tutorials, rendered from the markdown in the repositories.
              </span>
            </NextLink>
          </li>
          <li>
            <NextLink className="aph-card h-full" href="/sdk">
              <span className="text-base font-semibold text-[#e6e6e6]">Plugin SDK</span>
              <span className="text-sm text-muted">
                Write custom video-effect nodes in Python and package them.
              </span>
            </NextLink>
          </li>
        </ul>
      </Section>
    </div>
  );
}
