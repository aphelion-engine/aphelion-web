import type { Metadata } from "next";
import NextLink from "next/link";

import { ButtonLink } from "@/components/button-link";
import { noIndexMetadata } from "@/lib/seo";
import { GITHUB_EDITOR_URL } from "@/lib/site";
import { TEXT_LINK } from "@/lib/ui";

/**
 * A 404 must not be indexed.
 *
 * Next serves `app/not-found.tsx` with a real HTTP 404 status for an
 * unmatched route, which is the half of the problem that matters most — a
 * missing page answering `200 OK` is a soft 404 and gets indexed as content.
 * The metadata below handles the other half: if a crawler arrives here by
 * following a stale link, it is told explicitly not to record the page.
 */
export const metadata: Metadata = noIndexMetadata(
  "Page not found | Aphelion Editor",
  "That page does not exist. Browse the Aphelion Editor documentation, or download the editor.",
);

export default function NotFound(): React.ReactElement {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <p className="font-mono text-xs text-muted">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">That page isn&apos;t here</h1>
      <p className="mt-3 max-w-lg text-sm text-muted">
        Documentation pages are rendered from markdown in the repositories, so a link goes stale
        whenever a file is renamed. The docs index reads the current file list, so it is always up
        to date.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/docs">Browse the documentation</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Back to the homepage
        </ButtonLink>
      </div>
      <nav aria-label="Popular pages" className="mt-10">
        <h2 className="aph-section-title">Looking for something in particular?</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/features", label: "Features overview" },
            { href: "/editor", label: "Download Aphelion Editor" },
            { href: "/docs/editor/getting-started", label: "Installation guide" },
            { href: "/docs/editor/user-guide", label: "User guide" },
            { href: "/plugins", label: "Plugins" },
            { href: "/sdk", label: "Plugin SDK" },
          ].map((item) => (
            <li key={item.href}>
              <NextLink className={TEXT_LINK} href={item.href}>
                {item.label}
              </NextLink>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-8 text-sm text-muted">
        Still stuck?{" "}
        <a className={TEXT_LINK} href={GITHUB_EDITOR_URL} target="_blank" rel="noreferrer">
          Search the source repository on GitHub
        </a>
        .
      </p>
    </div>
  );
}
