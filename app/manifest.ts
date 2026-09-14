import type { MetadataRoute } from "next";

import { PRODUCT_NAME, SITE_DESCRIPTION } from "@/lib/site";

/**
 * Web app manifest.
 *
 * The editor is a desktop application, not a PWA, so this exists for
 * identity rather than offline capability: it is what gives the browser tab,
 * the Android home screen and the Windows taskbar a consistent name, colour
 * and icon set for the site itself. There is deliberately no `serviceWorker`
 * and no offline story to promise.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PRODUCT_NAME,
    short_name: "Aphelion",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#1e1e1e",
    theme_color: "#1e1e1e",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon_source.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
