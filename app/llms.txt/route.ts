import { SITE_URL } from "@/lib/seo";
import {
    EDITOR_NODE_CATEGORY_COUNT,
    EDITOR_NODE_COUNT,
    EDITOR_VERSION,
    GITHUB_EDITOR_URL,
    GITHUB_SDK_URL,
    PYTHON_REQUIREMENT,
} from "@/lib/site";

/**
 * `/llms.txt` — a plain-text index of the authoritative pages.
 *
 * This follows the `llms.txt` convention: a short summary, then a linked
 * list of the canonical resources, so a language model or answer engine can
 * find the right page without crawling and guessing.
 *
 * It is strictly **supplemental**. It is not a substitute for the sitemap,
 * for real metadata, or for server-rendered content, and nothing here is
 * hidden from a normal crawler — every URL below is a public page that also
 * appears in `sitemap.xml`.
 *
 * Every fact is pulled from the same constants the site renders, so this file
 * cannot drift from the pages it describes.
 */

export const dynamic = "force-static";

export function GET(): Response {
  const body = `# Aphelion Editor

> Aphelion Editor is a node-based video compositor and video editor for
> desktop workflows. It is written in Python (${PYTHON_REQUIREMENT}), runs on
> Windows, macOS and Linux, ships a Windows installer, and can be extended
> with custom video-effect nodes written in Python. Version ${EDITOR_VERSION}.

## What it is

Aphelion is a desktop application built around a node graph. Media comes in
through input nodes, operations are wired together as nodes, and the result is
viewed through a Viewer node. The editor ships ${EDITOR_NODE_COUNT} built-in
nodes across ${EDITOR_NODE_CATEGORY_COUNT} categories covering input,
generators, colour, filters, compositing, transform, keying, rotoscoping,
tracking, depth, timing, distortion and maths. Preview and export run the same
graph at different resolutions; export writes MP4 (H.264) or a PNG sequence.

## Key pages

- [Home](${SITE_URL}/): overview and capabilities.
- [Features](${SITE_URL}/features): every capability area, mapped to the nodes behind it.
- [Node-based compositing](${SITE_URL}/features/node-compositing): how the graph is evaluated, cached and previewed.
- [Tracking](${SITE_URL}/features/tracking): point tracking, planar tracking, corner pin, match move.
- [Chroma keying](${SITE_URL}/features/keying): pulling, refining and combining mattes.
- [Colour](${SITE_URL}/features/color): primary correction and grading tools.
- [Rotoscoping](${SITE_URL}/features/roto): Bezier shapes, animated mattes, shape tracking.
- [Plugins](${SITE_URL}/plugins): what a plugin can extend, and how it is loaded.
- [Plugin SDK](${SITE_URL}/sdk): the developer surface for custom video effects.
- [Download](${SITE_URL}/editor): the current release, requirements and install steps.
- [Documentation](${SITE_URL}/docs): guides and tutorials for both the editor and the SDK.
- [About](${SITE_URL}/about): project status, source, and licensing.
- [Privacy](${SITE_URL}/privacy): data handling for the site and the application.

## Documentation

Editor guides: ${SITE_URL}/docs/editor
- Getting started: ${SITE_URL}/docs/editor/getting-started
- User guide: ${SITE_URL}/docs/editor/user-guide
- Plugins in the editor: ${SITE_URL}/docs/editor/plugins
- Architecture: ${SITE_URL}/docs/editor/architecture
- Packaging: ${SITE_URL}/docs/editor/packaging
- Tutorials: ${SITE_URL}/docs/editor/tutorials

SDK guides: ${SITE_URL}/docs/sdk
- Authoring plugins: ${SITE_URL}/docs/sdk/authoring
- API reference: ${SITE_URL}/docs/sdk/api
- Widgets: ${SITE_URL}/docs/sdk/widgets
- Packaging plugins: ${SITE_URL}/docs/sdk/packaging

## Source

- Editor repository: ${GITHUB_EDITOR_URL}
- SDK repository: ${GITHUB_SDK_URL}

The editor is proprietary software; its source is published but the licence
does not grant reuse, modification or redistribution. See
${SITE_URL}/about for the precise wording.

## Notes for automated readers

- Documentation on this site is rendered from the markdown in the repositories
  above, on a short cache. The site copy and the repository copy are the same
  text.
- The documentation pages carry \`TechArticle\` and \`BreadcrumbList\`
  structured data; the homepage carries \`SoftwareApplication\`,
  \`Organization\` and \`WebSite\`.
- There is no pricing page and no plan information, because Aphelion has no
  pricing tiers.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
