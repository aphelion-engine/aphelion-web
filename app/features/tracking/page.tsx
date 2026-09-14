import type { Metadata } from "next";
import NextLink from "next/link";

import { PageHeader, Section } from "@/components/page";
import { pageMetadata } from "@/lib/seo";
import { TEXT_LINK } from "@/lib/ui";

export const metadata: Metadata = pageMetadata({
  title: "Tracking, Planar Tracking and Match Move | Aphelion Editor",
  absoluteTitle: true,
  description:
    "Point tracking, planar tracking, corner pin and match move in Aphelion Editor, including what happens when a tracker loses its target.",
  path: "/features/tracking",
});

export default function TrackingPage(): React.ReactElement {
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
            <span aria-current="page">Tracking</span>
          </nav>
        }
        title="Tracking and match move in Aphelion Editor"
        lede={
          <>
            Tracking is what lets a composite follow the footage instead of being lined up by hand on
            every frame. Aphelion ships point trackers, a planar tracker, a corner pin and a match
            move, and the tracking nodes expose their motion as ordinary properties that other nodes
            can consume.
          </>
        }
      />

      <Section id="trackers" title="What each tracker is for">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              name: "Point tracker",
              body: "Follows a small feature across frames and reports its position, so a shape, mask or corner can ride along with it. This is the tool for stabilising a shot or attaching a label to a moving object.",
              href: "/docs/editor/tutorials/01-point-tracking",
              link: "Tutorial: point tracking",
            },
            {
              name: "Planar tracker",
              body: "Fits a surface to a flat, textured region rather than a single point. Planar tracks survive partial occlusion and give you a position, scale, rotation and perspective that a single point cannot express.",
              href: "/docs/editor/tutorials/03-planar-tracking-match-move",
              link: "Tutorial: planar tracking and match move",
            },
            {
              name: "Corner pin",
              body: "Maps a rectangular image onto four tracked corners, which is how you replace a screen, a poster or a road sign with a stabilised element.",
              href: "/docs/editor/vfx-tools",
              link: "Tracking and VFX tools reference",
            },
            {
              name: "Match move",
              body: "Copies one element's motion onto another so a graphic, matte or second plate inherits the tracked transform without being rewired by hand.",
              href: "/docs/editor/vfx-tools",
              link: "Match move reference",
            },
          ].map((item) => (
            <article key={item.name} className="aph-card">
              <h3 className="text-base font-semibold text-[#e6e6e6]">{item.name}</h3>
              <p className="text-sm text-muted">{item.body}</p>
              <NextLink className={`${TEXT_LINK} text-sm`} href={item.href}>
                {item.link}
              </NextLink>
            </article>
          ))}
        </div>
      </Section>

      <Section id="recovery" title="What happens when a track loses its target">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="aph-prose">
            <p>
              A tracker that silently drifts is worse than one that stops, because you only find out
              after you have built work on top of it. Aphelion&apos;s trackers therefore model their
              own confidence and expose it: a track that loses its target enters a lost state rather
              than continuing to report a confident but wrong position.
            </p>
            <p>
              How the gap is interpreted is a per-node choice. A lost stretch can hold the last good
              sample, be left as a gap you fill by hand, or be re-acquired when the feature comes
              back. Which one is right depends on the shot, so the decision is exposed rather than
              hard-coded.
            </p>
            <p>
              The same machinery protects against false matches — a feature that briefly looks like
              the original but is not — and the search is bounded and cancellable so a bad track on a
              long clip does not lock the interface.
            </p>
          </div>
          <aside className="aph-panel aph-prose px-4 py-4">
            <h3 className="!mt-0">Tracking a soft, patchy feature</h3>
            <p>
              Shape tracking exists for the case where the thing you want to follow has no reliable
              single point — a soft shadow, a gradient, an irregular matte. Rather than tracking a
              pixel pattern, a shape tracker follows a rasterised outline and moves the whole matte
              with it.
            </p>
            <p>
              <NextLink className={TEXT_LINK} href="/features/roto">
                Rotoscoping and masks
              </NextLink>{" "}
              covers how those mattes are built.
            </p>
          </aside>
        </div>
      </Section>

      <Section id="driving" title="Using tracked motion">
        <div className="aph-prose">
          <p>
            A tracker&apos;s output is data, not a special case. Its position, scale and rotation
            appear as properties, which means they can drive a transform, feed a corner pin, sit
            under a keyframe graph, or be combined with another value in the maths nodes. Tracking a
            shot and applying the result are two independent decisions rather than one locked
            pipeline.
          </p>
          <p>
            <NextLink className={TEXT_LINK} href="/docs/editor/tracking-recovery">
              Tracking recovery and evaluation performance
            </NextLink>
            {" · "}
            <NextLink className={TEXT_LINK} href="/docs/editor/vfx-tools">
              Tracking and VFX tools reference
            </NextLink>
            {" · "}
            <NextLink className={TEXT_LINK} href="/features/roto">
              Rotoscoping and masks
            </NextLink>
          </p>
        </div>
      </Section>
    </div>
  );
}
