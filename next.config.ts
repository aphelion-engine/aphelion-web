import type { NextConfig } from "next";

/**
 * Canonical-host policy
 * ---------------------
 * The site is canonically served from **`www.aphelion-community.com`**. That
 * is the host `lib/seo.ts` writes into every canonical tag, Open Graph URL
 * and sitemap entry, and it is the host this file forces everyone onto.
 *
 * The apex → `www` redirect is declared here rather than left to the host
 * dashboard for one reason: canonicals that disagree with the served host
 * are the most common cause of "duplicate, Google chose a different
 * canonical" in Search Console, and a redirect rule that lives in the
 * repository is reviewable and testable while a dashboard setting is not.
 *
 * Redirects are permanent and single-hop. `http` → `https` is handled by the
 * platform's TLS terminator before a request reaches Next, so it is not
 * restated here; doing so would build the chain
 * `http://apex → https://apex → https://www` that the audit warns about.
 */
const CANONICAL_HOST = "www.aphelion-community.com";

const nextConfig: NextConfig = {
  // Sends `X-Powered-By: Next.js`, which is a free fingerprint for no benefit.
  poweredByHeader: false,

  async redirects() {
    return [
      // The editor is the only shipped product, so /products was a
      // misleading name for it. Keep the old URL working.
      { source: "/products", destination: "/editor", permanent: true },

      // The download page and the editor page are the same page. Rather
      // than maintain two URLs holding identical content — which would
      // compete with itself in search results — the natural /download path
      // is a permanent redirect to the canonical /editor page.
      { source: "/download", destination: "/editor", permanent: true },
      { source: "/downloads", destination: "/editor", permanent: true },

      // Retired names for the documentation section.
      { source: "/documentation", destination: "/docs", permanent: true },
      { source: "/doc", destination: "/docs", permanent: true },

      // Apex host → canonical www host. The `has` clause means this only
      // fires when the request actually arrived on the apex domain, so it is
      // inert on preview deployments and on localhost.
      {
        source: "/:path*",
        has: [{ type: "host", value: "aphelion-community.com" }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/icon.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        // Applied site-wide. `/_next/static/**` is deliberately not given a
        // custom Cache-Control: Next already serves it immutable, and
        // overriding that emits a build warning and can break development
        // behaviour for no gain.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
