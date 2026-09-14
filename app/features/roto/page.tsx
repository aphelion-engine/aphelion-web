import type { Metadata } from "next";
import NextLink from "next/link";

import { PageHeader, Section } from "@/components/page";
import { pageMetadata } from "@/lib/seo";
import { TEXT_LINK } from "@/lib/ui";

export const metadata: Metadata = pageMetadata({
  title: "Rotoscoping and Animated Masks | Aphelion Editor",
  absoluteTitle: true,
  description:
    "Rotoscoping in Aphelion Editor: draw Bezier shapes, animate them over time, feather and choke the matte, and hand a shape to a tracker.",
  path: "/features/roto",
});

export default function RotoPage(): React.ReactElement {
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
            <span aria-current="page">Rotoscoping</span>
          </nav>
        }
        title="Rotoscoping and animated masks in Aphelion Editor"
        lede={
          <>
            Rotoscoping is what you do when a key cannot do the job: a soft edge, a shadow, an
            object with no colour separation from its background. Aphelion builds these as Bezier
            shapes that animate over time, and hands them to a tracker when the movement is better
            described than drawn.
          </>
        }
      />

      <Section id="shapes" title="Shapes, drawn and animated">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="aph-prose">
            <p>
              A roto shape is a closed Bezier outline rasterised into a matte. Points are placed in
              the viewport, and any point can be keyframed, so a shape can change both its position
              and its outline over the length of a shot — which is what a matte following a turning
              head actually needs.
            </p>
            <p>
              The rasterised matte is a full frame-sized greyscale image, so it plugs into the same
              mask sockets as a keyer&apos;s output. There is no separate &ldquo;roto mode&rdquo;: a
              hand-drawn matte and an extracted one are the same kind of value and combine freely.
            </p>
            <p>
              Feather and choke are applied to the rasterised matte rather than to the shape, so a
              soft edge behaves like a soft edge rather than like an inflated polygon.
            </p>
          </div>
          <aside className="aph-panel aph-prose px-4 py-4">
            <h3 className="!mt-0">Garbage mattes</h3>
            <p>
              The most common use of a hand-drawn shape is not a finished matte but a cleanup: a
              rough polygon that excludes a light stand, a boom or a tracking marker from an
              otherwise good key. Because masks combine with add, subtract, intersect and maximum,
              this is a two-node fix.
            </p>
            <p>
              <NextLink className={TEXT_LINK} href="/features/keying">
                Chroma keying and matte work
              </NextLink>
            </p>
          </aside>
        </div>
      </Section>

      <Section id="shape-tracker" title="Shape tracking">
        <div className="aph-prose">
          <p>
            A plain point tracker follows a pixel pattern, which fails on soft or low-contrast
            features. Shape tracking inverts the problem: you describe the region you care about as
            an outline, and the tracker follows that region, translating the whole matte with it.
          </p>
          <p>
            That makes it the right tool for following the movement of something without a crisp
            feature — a shadow, a gradient, a soft-edged object — where you know the shape and only
            need to know where it went.
          </p>
          <p>
            Because the shape&apos;s motion comes out as ordinary properties, it can be combined with
            a hand-animated offset, driven by a keyframe curve, or split so that tracking and manual
            correction each own part of the movement.
          </p>
          <p>
            <NextLink className={TEXT_LINK} href="/docs/editor/shape-tracker">
              Shape Tracker reference
            </NextLink>
            {" · "}
            <NextLink className={TEXT_LINK} href="/docs/editor/tutorials/02-shape-tracker-masks">
              Tutorial: Shape Tracker masks
            </NextLink>
            {" · "}
            <NextLink className={TEXT_LINK} href="/docs/editor/tutorials/07-roto-and-masks">
              Tutorial: roto and masks
            </NextLink>
          </p>
        </div>
      </Section>

      <Section id="related" title="Related">
        <ul className="grid gap-4 sm:grid-cols-3">
          <li>
            <NextLink className="aph-card h-full" href="/features/tracking">
              <span className="text-base font-semibold text-[#e6e6e6]">Tracking</span>
              <span className="text-sm text-muted">
                Point and planar trackers, corner pin and match move.
              </span>
            </NextLink>
          </li>
          <li>
            <NextLink className="aph-card h-full" href="/features/keying">
              <span className="text-base font-semibold text-[#e6e6e6]">Keying</span>
              <span className="text-sm text-muted">
                Extract a matte from colour, then refine and combine it.
              </span>
            </NextLink>
          </li>
          <li>
            <NextLink className="aph-card h-full" href="/features">
              <span className="text-base font-semibold text-[#e6e6e6]">All features</span>
              <span className="text-sm text-muted">
                Every capability area, mapped to the nodes behind it.
              </span>
            </NextLink>
          </li>
        </ul>
      </Section>
    </div>
  );
}
