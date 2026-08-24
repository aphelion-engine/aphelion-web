export const GITHUB_ORG = "aphelion-engine";

export const SITE_NAME = "Aphelion";

export const GITHUB_EDITOR_URL = `https://github.com/${GITHUB_ORG}/aphelion-editor`;

export const GITHUB_EDITOR_REPO = "aphelion-editor";

export const GITHUB_SDK_REPO = "aphelion-sdk";

export const GITHUB_SDK_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_SDK_REPO}`;

export const SDK_VERSION = "0.1.0";

export const SDK_DOWNLOAD_HREF = "/api/sdk/download";

export const PIP_GIT_INSTALL = `pip install aphelion-plugin-sdk`;

export const PIP_LOCAL_INSTALL = "pip install -e ./aphelion-sdk";

export type ProductStatus = "available" | "coming_soon";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  href: string;
  docsHref: string | null;
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "editor",
    name: "Aphelion Editor",
    tagline: "Node-based video compositor",
    description:
      "A professional dark compositor for cutting, grading, and building graphs. Plugins extend nodes, panels, and dialogs through the Aphelion SDK.",
    status: "available",
    href: "/products#editor",
    docsHref: "/docs/editor",
  },
  {
    id: "line",
    name: "More Aphelion apps",
    tagline: "One family, more surfaces",
    description:
      "Aphelion is a product line. Additional apps will share the same dark UI language and the same plugin SDK. Nothing else ships yet.",
    status: "coming_soon",
    href: "/products",
    docsHref: null,
  },
];
