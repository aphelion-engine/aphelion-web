import NextLink from "next/link";

import {
    EDITOR_ISSUES_URL,
    EDITOR_NODE_CATEGORY_COUNT,
    EDITOR_NODE_COUNT,
    EDITOR_RELEASES_URL,
    EDITOR_VERSION,
    GITHUB_EDITOR_URL,
    PYTHON_REQUIREMENT,
    SDK_RELEASES_URL,
} from "@/lib/site";

/**
 * Footer link groups.
 *
 * A footer is the cheapest way to guarantee that every important page is one
 * hop from every other page, which is what keeps crawl depth flat. It is
 * grouped by intent rather than dumped into one alphabetical list so that it
 * stays useful to a reader as well as to a crawler — and it is deliberately
 * short. A hundred-link footer is a link farm and is treated as one.
 */
const GROUPS: readonly {
  heading: string;
  links: readonly { href: string; label: string; external?: boolean }[];
}[] = [
  {
    heading: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/features/node-compositing", label: "Node compositing" },
      { href: "/editor", label: "Download" },
      { href: EDITOR_RELEASES_URL, label: "Release notes", external: true },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/docs/editor/getting-started", label: "Installation" },
      { href: "/docs/editor/user-guide", label: "User guide" },
      { href: "/docs/editor/tutorials", label: "Tutorials" },
    ],
  },
  {
    heading: "Develop",
    links: [
      { href: "/plugins", label: "Plugins" },
      { href: "/sdk", label: "Plugin SDK" },
      { href: "/docs/sdk/api", label: "SDK API reference" },
      { href: SDK_RELEASES_URL, label: "SDK releases", external: true },
    ],
  },
  {
    heading: "Project",
    links: [
      { href: "/about", label: "About" },
      { href: GITHUB_EDITOR_URL, label: "GitHub", external: true },
      { href: EDITOR_ISSUES_URL, label: "Report an issue", external: true },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter(): React.ReactElement {
  return (
    <footer className="aph-statusbar mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <nav aria-label="Footer" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((group) => (
            <div key={group.heading}>
              <h2 className="mb-2 text-[10px] font-semibold tracking-[0.09em] text-muted uppercase">
                {group.heading}
              </h2>
              <ul className="space-y-1 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <NextLink href={link.href}>{link.label}</NextLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-[#2a2a2a] pt-4">
          <span className="aph-timecode">Aphelion Editor v{EDITOR_VERSION}</span>
          <span className="aph-statusbar__sep" aria-hidden>
            |
          </span>
          <span>Python {PYTHON_REQUIREMENT}</span>
          <span className="aph-statusbar__sep" aria-hidden>
            |
          </span>
          <span>
            {EDITOR_NODE_COUNT} nodes · {EDITOR_NODE_CATEGORY_COUNT} categories
          </span>
        </div>
      </div>
    </footer>
  );
}
