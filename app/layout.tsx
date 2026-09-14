import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
    jsonLdGraph,
    organizationSchema,
    SITE_URL,
    websiteSchema,
} from "@/lib/seo";
import {
    EDITOR_VERSION,
    PRODUCT_NAME,
    SITE_DESCRIPTION,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Homepage title.
 *
 * Leads with the product name because that is what people search for and
 * what the brand needs to own, then states the category so the snippet is
 * self-explanatory before anyone clicks. Under 60 characters so it survives
 * Google's truncation.
 */
const DEFAULT_TITLE = `${PRODUCT_NAME} | Node-Based Video Compositor for Desktop`;

export const metadata: Metadata = {
  // Always set. Leaving this conditional meant absolute URLs — canonicals,
  // Open Graph images — silently vanished from production whenever the
  // environment variable was missing.
  metadataBase: new URL(SITE_URL),
  applicationName: PRODUCT_NAME,
  title: {
    default: DEFAULT_TITLE,
    // Every title on the site ends `| Aphelion Editor`, whether it comes
    // through this template or is set absolutely by a page with a longer,
    // already-complete title. The template previously used `· Aphelion`,
    // which left three pages rendering a different separator and a
    // different brand from the other eleven.
    template: `%s | ${PRODUCT_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "node based video editor",
    "node based compositor",
    "video compositing software",
    "Python video editor",
    "desktop video compositor",
    "node graph video editor",
  ],
  authors: [{ name: "Aphelion Engine", url: "https://github.com/aphelion-engine" }],
  creator: "Aphelion Engine",
  publisher: "Aphelion Engine",
  category: "Multimedia",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: PRODUCT_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
  // `app/icon.svg` and `app/icon.ico` are picked up by Next's file
  // conventions, so icon links are generated without repeating them here.
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false, address: false, email: false },
  other: {
    "software-version": EDITOR_VERSION,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#1e1e1e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-1.5 focus:text-sm focus:text-accent-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {/* Site-level identity, declared once. Page-level graphs reference
            these nodes by `@id` rather than restating them. */}
        <JsonLd data={jsonLdGraph([organizationSchema(), websiteSchema()])} />
      </body>
    </html>
  );
}
