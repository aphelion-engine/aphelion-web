import type { MetadataRoute } from "next";

import { DOCS_SOURCES } from "@/lib/docs/catalog";
import { listDocsPages } from "@/lib/docs/load";
import { absoluteUrl } from "@/lib/seo";

/** Rebuild the sitemap on the same cadence as the documentation. */
export const revalidate = 3600;

/**
 * Site-relative paths that always exist.
 *
 * Kept as a literal list rather than derived from the filesystem because a
 * sitemap is a promise about URLs, and a route that exists but is not listed
 * here would silently drop out of the index.
 *
 * `/download` is absent on purpose: it is a permanent redirect to `/editor`,
 * and a sitemap must list destinations, never redirects.
 */
const STATIC_PATHS: readonly { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/features", priority: 0.9 },
  { path: "/editor", priority: 0.9 },
  { path: "/plugins", priority: 0.8 },
  { path: "/sdk", priority: 0.8 },
  { path: "/docs", priority: 0.8 },
  { path: "/about", priority: 0.6 },
  { path: "/privacy", priority: 0.2 },
];

const FEATURE_PATHS: readonly { path: string; priority: number }[] = [
  { path: "/features/node-compositing", priority: 0.8 },
  { path: "/features/tracking", priority: 0.7 },
  { path: "/features/color", priority: 0.7 },
  { path: "/features/keying", priority: 0.7 },
  { path: "/features/roto", priority: 0.7 },
];

/**
 * `/sitemap.xml`.
 *
 * Documentation entries are **derived**, not hand-maintained: the same
 * loader that renders the pages enumerates them, so a new markdown file in
 * either repository appears here without anyone editing this file. That is
 * the only way a docs sitemap stays correct — a hand-written list of 27
 * entries is wrong the first time a page is renamed.
 *
 * `lastModified` is omitted throughout. The GitHub tree API this uses does
 * not report per-file modification times, and a fabricated date is worse
 * than no date: crawlers use it to decide what to re-fetch, so a wrong value
 * actively misleads.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    ...STATIC_PATHS,
    ...FEATURE_PATHS,
  ].map(({ path, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));

  const docEntries = await Promise.all(
    DOCS_SOURCES.map(async (source) => {
      const pages = await listDocsPages(source);
      return pages.map((page) => ({
        url: absoluteUrl(page.href),
        changeFrequency: "weekly" as const,
        // Guides are the pages most likely to answer a search query, so they
        // sit just below the product pages rather than at the bottom.
        priority: 0.6,
      }));
    }),
  );

  return [...staticEntries, ...docEntries.flat()];
}
