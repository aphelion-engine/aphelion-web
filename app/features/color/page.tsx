import type { Metadata } from "next";
import NextLink from "next/link";

import { PageHeader, Section } from "@/components/page";
import { pageMetadata } from "@/lib/seo";
import { TEXT_LINK } from "@/lib/ui";

export const metadata: Metadata = pageMetadata({
  title: "Colour Correction and Grading | Aphelion Editor",
  absoluteTitle: true,
  description:
    "Colour tools in Aphelion Editor: exposure, white balance, hue and saturation, levels, vibrance, shadows, highlights and creative grading looks.",
  path: "/features/color",
});

const PRIMARY_TOOLS: readonly { name: string; body: string }[] = [
  {
    name: "Exposure and contrast",
    body: "Lift or lower a shot without clipping highlights, and set the black and white points with a levels control when you need the range pinned exactly.",
  },
  {
    name: "White balance",
    body: "Neutralise a colour cast by shifting along temperature and tint, which is the usual first move on footage that was shot under mixed light.",
  },
  {
    name: "Hue and saturation",
    body: "Rotate hue globally, or push and pull saturation on its own. Vibrance is available separately for the case where you want the muted colours left alone.",
  },
  {
    name: "Shadows and highlights",
    body: "Recover detail in the ends of the range independently, so a blown sky and a crushed foreground can be dealt with in one node.",
  },
  {
    name: "Monochrome",
    body: "Collapse to greyscale with control over how each colour contributes, rather than a flat desaturation.",
  },
  {
    name: "Posterise",
    body: "Quantise the tonal range into a fixed number of steps, either as a stylisation or as a diagnostic for banding.",
  },
];

export default function ColorPage(): React.ReactElement {
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
            <span aria-current="page">Colour</span>
          </nav>
        }
        title="Colour correction and grading in Aphelion Editor"
        lede={
          <>
            Colour work in Aphelion is node work. A correction is a node you can place anywhere in
            the graph, so you can grade one branch of a composite while leaving another untouched,
            key off a corrected signal instead of the raw plate, or apply the same look to several
            sources by feeding a single corrector.
          </>
        }
      />

      <Section id="primary" title="Primary correction">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRIMARY_TOOLS.map((tool) => (
            <li key={tool.name} className="aph-card">
              <span className="text-base font-semibold text-[#e6e6e6]">{tool.name}</span>
              <span className="text-sm text-muted">{tool.body}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="why-nodes" title="Why grading as nodes matters">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="aph-prose">
            <p>
              In a layer-based editor, a correction applies to a stack, and its position in that
              stack is the only thing controlling what it sees. In a graph, the correction sees
              exactly what is wired into it. That difference is what makes it possible to grade a
              foreground element against the background it will be composited over, rather than
              grading both and hoping.
            </p>
            <p>
              It also means a grade can be reused. Because a node&apos;s output is an ordinary frame,
              one corrector can feed several downstream branches, which is how you keep two elements
              matched without duplicating the settings that matched them.
            </p>
            <p>
              And because effects accept a mask input, a correction can be limited to part of the
              frame without a separate node — including a mask produced by a keyer or a roto shape.
            </p>
          </div>
          <aside className="aph-panel aph-prose px-4 py-4">
            <h3 className="!mt-0">Auto balance</h3>
            <p>
              Aphelion includes an automatic balance node for a fast neutral starting point on
              footage with an obvious cast. It is a starting point, not a replacement for a manual
              grade, and it sits in the graph like anything else so you can override it downstream.
            </p>
            <p>
              <NextLink className={TEXT_LINK} href="/features">
                See all feature areas
              </NextLink>
            </p>
          </aside>
        </div>
      </Section>

      <Section id="related" title="Related">
        <ul className="grid gap-4 sm:grid-cols-3">
          <li>
            <NextLink className="aph-card h-full" href="/features/keying">
              <span className="text-base font-semibold text-[#e6e6e6]">Chroma keying</span>
              <span className="text-sm text-muted">
                Pull a matte from a colour, then refine and combine it.
              </span>
            </NextLink>
          </li>
          <li>
            <NextLink className="aph-card h-full" href="/features/roto">
              <span className="text-base font-semibold text-[#e6e6e6]">Roto and masks</span>
              <span className="text-sm text-muted">
                Limit any correction to part of the frame with an animated shape.
              </span>
            </NextLink>
          </li>
          <li>
            <NextLink className="aph-card h-full" href="/docs/editor/user-guide">
              <span className="text-base font-semibold text-[#e6e6e6]">User guide</span>
              <span className="text-sm text-muted">
                Workspace, node graph, timeline and export.
              </span>
            </NextLink>
          </li>
        </ul>
      </Section>
    </div>
  );
}
