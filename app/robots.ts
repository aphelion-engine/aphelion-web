import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * `/robots.txt`.
 *
 * Everything public is crawlable. There is deliberately **no** `Disallow`
 * for `/_next/`, `*.js` or `*.css`: search engines need to fetch render-
 * blocking assets to evaluate a page, and blocking them is a common way to
 * tank a Core Web Vitals assessment for no benefit. The framework's hashed
 * asset paths are already canonical by construction.
 *
 * The `/api/` routes are disallowed because they return JSON or binary
 * payloads, not pages. `robots.txt` only stops crawling — it is not an
 * access control — which is fine here, since neither route exposes anything
 * private.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
