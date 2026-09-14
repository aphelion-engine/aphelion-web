import type { ReactNode } from "react";

/**
 * Consistent page opening for the marketing and feature routes.
 *
 * Every page gets exactly one `<h1>` here, a lede paragraph that states what
 * the page is about before any list or grid, and an optional breadcrumb
 * trail. Centralising it is what keeps heading order correct: a page that
 * starts with a grid of `<h3>`s is common and unhelpful to both crawlers and
 * screen readers.
 */
type PageHeaderProps = {
  /** Rendered as the page's single `<h1>`. */
  title: string;
  /** One or two sentences answering "what is this page about?". */
  lede: ReactNode;
  /** Optional trail above the title. The last entry is the current page. */
  eyebrow?: ReactNode;
  /** Optional actions rendered under the lede. */
  actions?: ReactNode;
};

export function PageHeader({
  title,
  lede,
  eyebrow,
  actions,
}: PageHeaderProps): React.ReactElement {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-8 lg:pt-14">
      {eyebrow ? <div className="mb-3">{eyebrow}</div> : null}
      <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      <p className="aph-lede mt-4">{lede}</p>
      {actions ? <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

/**
 * A titled band of page content. The `id` makes the section linkable, which
 * gives long feature pages stable in-page anchors.
 */
type SectionProps = {
  id?: string;
  title: string;
  children: ReactNode;
  /** Rendered to the right of the title on wide screens. */
  aside?: ReactNode;
};

export function Section({ id, title, children, aside }: SectionProps): React.ReactElement {
  return (
    <section id={id} className="border-t border-[#121212]">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="aph-section-title">{title}</h2>
          {aside}
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}
