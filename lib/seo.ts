/**
 * Central SEO utilities.
 *
 * Everything that affects how a page appears to a crawler or a social card
 * funnels through here, so a policy change (canonical host, Twitter card
 * type, robots default) is one edit rather than a sweep across every route.
 *
 * ## Canonical host
 *
 * `SITE_URL` is the single decision. The site is canonically served from
 * `www.`; the apex host must 301 to it, and the redirect is declared in
 * `next.config.ts` so the deployment carries it rather than relying on an
 * operator remembering. `NEXT_PUBLIC_SITE_URL` overrides it for preview
 * deployments, where absolute URLs should point at the preview host instead.
 */

import type { Metadata } from "next";

import { GITHUB_EDITOR_URL, GITHUB_ORG, SITE_NAME } from "@/lib/site";

/** Canonical origin, with no trailing slash. */
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aphelion-community.com"
).replace(/\/+$/, "");

/** Default social card. 1200×630 is the size every platform crops from. */
export const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Twitter/X account for the project, if one is ever created. */
export const TWITTER_HANDLE: string | null = null;

/**
 * Absolute URL for a site-relative path. Passes through absolute URLs.
 *
 * The root normalises to the bare origin, without a trailing slash. Next
 * rewrites a canonical of `/` that way, so emitting `…/` from the sitemap
 * would be a second spelling of the same page — and a canonical that
 * disagrees with the sitemap by one character is exactly the kind of thing
 * that shows up as "duplicate, Google chose a different canonical".
 */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? SITE_URL : `${SITE_URL}${normalized}`;
}

export type PageMetadataInput = {
  /** Page title, without the brand. Used verbatim when `absoluteTitle` is set. */
  title: string;
  /** Set when `title` already reads as a complete title tag. */
  absoluteTitle?: boolean;
  description: string;
  /** Site-relative path. Becomes the canonical URL and the OG URL. */
  path: string;
  /** Site-relative or absolute social image. Defaults to the generated card. */
  image?: string;
  /** Open Graph object type. */
  type?: "website" | "article";
  /** ISO date for `article:published_time` and friends. */
  publishedTime?: string;
  /** Set for pages that genuinely should not be indexed, such as a 404. */
  noindex?: boolean;
};

/**
 * Build a complete `Metadata` object for one page.
 *
 * Applying this everywhere is what guarantees no page ships with a title but
 * no canonical, or a canonical but no social card — the failure mode of
 * hand-written metadata blocks, which is how `/docs/**` ended up with titles
 * and nothing else.
 */
export function pageMetadata({
  title,
  absoluteTitle = false,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  noindex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    // `absolute` skips the root layout's `%s · Aphelion` template, which a
    // documentation page does not want: "Planar Tracking | Aphelion Editor
    // Documentation" is a better title than "... · Aphelion Editor · Aphelion".
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      ...(TWITTER_HANDLE ? { site: TWITTER_HANDLE, creator: TWITTER_HANDLE } : {}),
    },
  };
}

/** Metadata for a page that must not be indexed and must not set a canonical. */
export function noIndexMetadata(title: string, description: string): Metadata {
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: true },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD                                                             */
/* ------------------------------------------------------------------ */

/** A `schema.org` node. Loosely typed: JSON-LD has many optional fields. */
export type JsonLdNode = Record<string, unknown>;

export type BreadcrumbEntry = {
  name: string;
  /** Site-relative path. Omit on the final (current) crumb. */
  path?: string;
};

/** The Aphelion project as an organization. */
export function organizationSchema(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Aphelion Engine",
    alternateName: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/icon.svg"),
    sameAs: [GITHUB_EDITOR_URL, `https://github.com/${GITHUB_ORG}`],
  };
}

/** The website itself, so search engines can attach a sitelinks searchbox. */
export function websiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description:
      "Aphelion Editor — a node-based video compositor and editor for desktop. Build a node graph, preview through a proxy, and export MP4 or a PNG sequence from any Viewer.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

export type SoftwareApplicationInput = {
  version: string;
  downloadUrl: string;
  /** Only what the project actually ships today. */
  operatingSystem: string;
};

/**
 * The editor as a `SoftwareApplication`.
 *
 * Only factual, verifiable properties appear here. No `aggregateRating`,
 * `review`, `offers` or `award` — the project has published none of those,
 * and inventing them is both dishonest and a structured-data violation.
 */
export function softwareApplicationSchema({
  version,
  downloadUrl,
  operatingSystem,
}: SoftwareApplicationInput): JsonLdNode {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: "Aphelion Editor",
    alternateName: "Aphelion",
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Video compositor",
    operatingSystem,
    softwareVersion: version,
    url: `${SITE_URL}/`,
    downloadUrl,
    codeRepository: GITHUB_EDITOR_URL,
    description:
      "Node-based video compositor and editor. Build a node graph, preview through a proxy, and export MP4 or a PNG sequence from any Viewer.",
    features:
      "Node graph compositing, timeline and keyframes, color correction, chroma keying, rotoscoping, point and planar tracking, preview proxies, MP4/H.264 and PNG sequence export, Python plugin SDK.",
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** A breadcrumb trail. The final crumb is the current page. */
export function breadcrumbSchema(entries: readonly BreadcrumbEntry[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      ...(entry.path ? { item: absoluteUrl(entry.path) } : {}),
    })),
  };
}

export type TechArticleInput = {
  headline: string;
  description: string;
  path: string;
  /** ISO date, when it is actually known. Omitted otherwise. */
  dateModified?: string;
};

/** A documentation page as a `TechArticle`. */
export function techArticleSchema({
  headline,
  description,
  path,
  dateModified,
}: TechArticleInput): JsonLdNode {
  return {
    "@type": "TechArticle",
    headline,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    inLanguage: "en",
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(dateModified ? { dateModified } : {}),
  };
}

/** Wrap nodes in a single `@graph` document. */
export function jsonLdGraph(nodes: readonly JsonLdNode[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [...nodes],
  };
}
