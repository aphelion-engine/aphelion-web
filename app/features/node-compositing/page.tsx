import type { Metadata } from "next";
import NextLink from "next/link";

import { PageHeader, Section } from "@/components/page";
import { pageMetadata } from "@/lib/seo";
import {
    EDITOR_NODE_CATEGORY_COUNT,
    EDITOR_NODE_COUNT,
    PIP_PACKAGE_INSTALL,
} from "@/lib/site";
import { TEXT_LINK } from "@/lib/ui";

export const metadata: Metadata = pageMetadata({
  title: "Node-Based Video Compositing | Aphelion Editor",
  absoluteTitle: true,
  description:
    "How node-based compositing works in Aphelion Editor: build a graph of image operations, preview through a proxy, and export at full resolution.",
  path: "/features/node-compositing",
});

export default function NodeCompositingPage(): React.ReactElement {
  return (
    <div>
      <PageHeader
        eyebrow={
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
            <NextLink className={TEXT_LINK} href="/">
              Aphelion
            </NextLink>
            <span aria-hidden> › </span>
            <NextLink className={TEXT_LINK} href="/features">
              Features
            </NextLink>
            <span aria-hidden> › </span>
            <span aria-current="page">Node compositing</span>
          </nav>
        }
        title="Node-based video compositing in Aphelion Editor"
        lede={
          <>
            In a node-based compositor you describe an image as a chain of operations rather than a
            stack of layers. Aphelion Editor takes that model and applies it to video: every node
            receives a frame, returns a frame, and the graph is what gets cached, previewed and
            exported.
          </>
        }
      />

      <Section id="model" title="The evaluation model">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="aph-prose">
            <p>
              A node declares typed sockets — a Frame input, a Frame output, or a Mask — and a set of
              properties. Wiring an output into an input establishes a dependency. The editor walks
              that dependency graph once per frame, in topological order, so a node is evaluated
              after everything it depends on and never twice.
            </p>
            <p>
              Because the order is known ahead of time, the editor can also work out which nodes are
              unreachable from the active Viewer and skip them entirely, which is why a large graph
              with many dead branches still previews at the cost of only the live path.
            </p>
            <p>
              Every node result is cached per frame and keyed by the node&apos;s own inputs and
              properties. Change a property on one node and only that node and its downstream
              consumers are recomputed; the rest of the graph is served from cache.
            </p>
          </div>
          <aside className="aph-panel aph-prose px-4 py-4">
            <h3 className="!mt-0">Why it stays responsive</h3>
            <p>
              Frames are cached in a byte-budgeted store rather than by count, so a 4K project and a
              720p project get comparable numbers of cached frames from the same memory budget.
            </p>
            <p>
              Preview decode is capped at the Viewer&apos;s preview width — 960px by default — so a
              4K source is not decoded at 4K to fill a window a fraction of that size.
            </p>
            <p>
              Heavy work runs off the UI thread, with stale results discarded by generation counter
              rather than allowed to overwrite a newer frame.
            </p>
          </aside>
        </div>
      </Section>

      <Section
        id="library"
        title="What ships in the node library"
        aside={
          <p className="aph-chip">
            {EDITOR_NODE_COUNT} nodes · {EDITOR_NODE_CATEGORY_COUNT} categories
          </p>
        }
      >
        <div className="aph-prose">
          <p>
            The built-in library covers the operations a compositor needs before you reach for a
            plugin. Categories the editor registers at launch:
          </p>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Input/Output",
            "Audio",
            "Generator",
            "Depth Generator",
            "Color",
            "Creative",
            "Filter",
            "Stylize",
            "Distort",
            "Effects",
            "Compositing",
            "Transform",
            "Timing",
            "Depth",
            "Keying",
            "Roto",
            "Tracking",
            "Math",
            "Values",
            "Logic",
            "Utility",
          ].map((category) => (
            <li key={category} className="aph-card !flex-row !items-center !py-2.5">
              <span className="font-mono text-xs text-[#9ecfff]">{category}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm">
          <NextLink className={TEXT_LINK} href="/features">
            See what each category covers
          </NextLink>
        </p>
      </Section>

      <Section id="workflow" title="A compositing session, start to finish">
        <ol className="aph-prose space-y-4">
          <li>
            <strong className="text-[#e6e6e6]">Bring in media.</strong> An input node points at a
            video file, image sequence or still. It decodes on demand and reports the media&apos;s
            frame count, rate and dimensions to the timeline.
          </li>
          <li>
            <strong className="text-[#e6e6e6]">Build the branch.</strong> Wire the source into
            whatever it needs — a keyer, a colour correction, a transform — and add a Viewer node at
            the end of the branch you want to look at.
          </li>
          <li>
            <strong className="text-[#e6e6e6]">Preview.</strong> The Viewer is what runs. Its
            resolution and proxy settings decide how much work each frame costs while you are
            scrubbing and playing back.
          </li>
          <li>
            <strong className="text-[#e6e6e6]">Animate.</strong> Any numeric property can hold
            keyframes or be driven by another node, so a value can follow a tracker, an expression or
            the timeline.
          </li>
          <li>
            <strong className="text-[#e6e6e6]">Export.</strong> Export renders the same graph at full
            resolution to MP4 (H.264) or a PNG sequence, from the active Viewer.
          </li>
        </ol>
        <p className="mt-6 text-sm">
          <NextLink className={TEXT_LINK} href="/docs/editor/tutorials/06-keying-and-compositing">
            Tutorial: keying and compositing an element
          </NextLink>
          {" · "}
          <NextLink className={TEXT_LINK} href="/docs/editor/user-guide">
            User guide: the workspace and node graph
          </NextLink>
        </p>
      </Section>

      <Section id="extend" title="When the library is not enough">
        <div className="aph-prose">
          <p>
            If you need an operation the built-in nodes do not cover, the plugin SDK exposes the same
            base classes the built-in effects use. A custom effect is a Python class that receives a
            frame and returns a modified one, and it is registered by dropping the module into the
            plugins folder — no rebuild of the editor required.
          </p>
          <p>
            This is the main practical difference between a compositor with a fixed effect set and
            one you can extend: the ceiling is a Python file rather than a feature request.
          </p>
          <p>
            <NextLink className={TEXT_LINK} href="/sdk">
              Aphelion Plugin SDK: install, API surface and packaging
            </NextLink>
            {" · "}
            <NextLink className={TEXT_LINK} href="/plugins">
              How Aphelion discovers and loads plugins
            </NextLink>
          </p>
          <p className="font-mono text-xs text-muted">{PIP_PACKAGE_INSTALL}</p>
        </div>
      </Section>
    </div>
  );
}
