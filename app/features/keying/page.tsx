import type { Metadata } from "next";
import NextLink from "next/link";

import { PageHeader, Section } from "@/components/page";
import { pageMetadata } from "@/lib/seo";
import { TEXT_LINK } from "@/lib/ui";

export const metadata: Metadata = pageMetadata({
  title: "Chroma Keying and Mattes | Aphelion Editor",
  absoluteTitle: true,
  description:
    "Chroma keying in Aphelion Editor: pull a matte from a key colour, refine edges, suppress spill, and combine masks into one matte.",
  path: "/features/keying",
});

const STEPS: readonly { name: string; body: string }[] = [
  {
    name: "Key",
    body: "Pick the screen colour and the keyer separates foreground from background. Because the keyer is a node, the signal it sees is whatever is wired into it — you can grade the plate before keying rather than after.",
  },
  {
    name: "Refine the matte",
    body: "Choke pulls the matte in to remove a fringe; feather softens it to sit against motion blur. Both act on the matte, not the image, so you can see the alpha on its own while you tune it.",
  },
  {
    name: "Suppress spill",
    body: "Green or blue bounced onto the subject is desaturated toward neutral without desaturating the rest of the frame, which is the difference between a key that holds on hair and one that does not.",
  },
  {
    name: "Combine",
    body: "A second matte — a garbage matte from a roto shape, or a second key — is merged with the first by add, subtract, intersect or maximum, so one matte can clean up what the other could not.",
  },
  {
    name: "Premultiply",
    body: "Premultiply and unpremultiply nodes are available for the points in a graph where an element's RGB has to be consistent with its alpha, such as before a blur.",
  },
];

export default function KeyingPage(): React.ReactElement {
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
            <span aria-current="page">Keying</span>
          </nav>
        }
        title="Chroma keying and matte work in Aphelion Editor"
        lede={
          <>
            Keying is a pipeline, not a button. Aphelion splits it into nodes that each do one thing —
            pull the matte, refine it, clean the spill, combine it with another — so you can see and
            control each stage instead of tuning a single opaque control.
          </>
        }
      />

      <Section id="pipeline" title="The keying pipeline">
        <ol className="space-y-3">
          {STEPS.map((step, index) => (
            <li key={step.name} className="aph-card !flex-row gap-4">
              <span className="font-mono text-xs text-[#9ecfff]">{index + 1}</span>
              <span className="flex flex-col gap-1">
                <span className="text-base font-semibold text-[#e6e6e6]">{step.name}</span>
                <span className="text-sm text-muted">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="masks" title="Masks are first-class, not an afterthought">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="aph-prose">
            <p>
              A matte node outputs a mask on its own socket, separate from the frame. That means a
              mask can be routed independently of the image it came from: into an effect&apos;s mask
              input to limit where it applies, into a combine node to be merged with another matte,
              or into a Viewer to be inspected as a greyscale image.
            </p>
            <p>
              This is why a chroma key rarely needs to be perfect on its own. A key that holds
              everywhere except a shadow on the floor can be combined with a hand-drawn roto matte
              that covers that region, and the result is one clean mask without re-tuning the key.
            </p>
          </div>
          <aside className="aph-panel aph-prose px-4 py-4">
            <h3 className="!mt-0">Inspecting a matte</h3>
            <p>
              Any mask output can be wired into a Viewer whose output is treated as greyscale, which
              makes it possible to judge a key by the matte itself rather than by how the composite
              happens to look against one background.
            </p>
            <p>
              <NextLink className={TEXT_LINK} href="/features/roto">
                Rotoscoping and masks
              </NextLink>
            </p>
          </aside>
        </div>
      </Section>

      <Section id="go-deeper" title="Go deeper">
        <ul className="grid gap-4 sm:grid-cols-2">
          <li>
            <NextLink className="aph-card h-full" href="/docs/editor/tutorials/06-keying-and-compositing">
              <span className="text-base font-semibold text-[#e6e6e6]">
                Tutorial: keying and compositing
              </span>
              <span className="text-sm text-muted">
                A worked example that pulls a matte and composites an element over a new background.
              </span>
            </NextLink>
          </li>
          <li>
            <NextLink className="aph-card h-full" href="/docs/editor/tutorials/07-roto-and-masks">
              <span className="text-base font-semibold text-[#e6e6e6]">Tutorial: roto and masks</span>
              <span className="text-sm text-muted">
                Building animated mattes and combining them with a key.
              </span>
            </NextLink>
          </li>
        </ul>
      </Section>
    </div>
  );
}
