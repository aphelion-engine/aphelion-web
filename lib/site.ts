export const GITHUB_ORG = "aphelion-engine";

export const SITE_NAME = "Aphelion";

/** Short product name used in titles and structured data. */
export const PRODUCT_NAME = "Aphelion Editor";

export const GITHUB_EDITOR_REPO = "aphelion-editor";
export const GITHUB_SDK_REPO = "aphelion-sdk";

export const GITHUB_EDITOR_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_EDITOR_REPO}`;
export const GITHUB_SDK_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_SDK_REPO}`;

export const EDITOR_RELEASES_URL = `${GITHUB_EDITOR_URL}/releases`;
export const SDK_RELEASES_URL = `${GITHUB_SDK_URL}/releases`;
export const EDITOR_ISSUES_URL = `${GITHUB_EDITOR_URL}/issues`;
export const EDITOR_CONTRIBUTING_URL = `${GITHUB_EDITOR_URL}/blob/main/CONTRIBUTING.md`;

/**
 * The release the website talks about.
 *
 * This is the **single source** for the version shown anywhere on the site:
 * the homepage badge, the footer status bar, the download page, structured
 * data, and the release link. It mirrors `APP_VERSION` in
 * `aphelion-editor/src/config/constants.py`, which is the editor's own
 * source of truth. Bumping a release is one edit here.
 *
 * The value was `0.1.0` while the editor had moved on to `0.1.2`, and the
 * SDK's own version is tracked separately because it ships on its own
 * cadence.
 */
export const EDITOR_VERSION = "0.1.2";

/** Mirrors `version` in `aphelion-sdk/pyproject.toml`. */
export const SDK_VERSION = "0.1.0";

export const PYTHON_REQUIREMENT = "3.11+";

/**
 * Node types the editor registers at launch.
 *
 * Counted from `global_node_registry.get_all_nodes()` after
 * `NodeLoader.load_defaults()` — the same list the Add-Node menu and the
 * search palette read — and cross-checked against the number of categories
 * it groups them into. The site previously said 77, which was true at some
 * earlier point and had been wrong for a long time.
 */
export const EDITOR_NODE_COUNT = 172;

/** Categories `get_categories()` returns for those nodes. */
export const EDITOR_NODE_CATEGORY_COUNT = 21;

export const SITE_DESCRIPTION =
  "Aphelion Editor is a node-based video compositor and editor for desktop. Build a graph, preview through a proxy, and export MP4 or a PNG sequence from any Viewer.";

/**
 * One-sentence answer to "what is this?", written to be quotable by an
 * answer engine without becoming a keyword list.
 *
 * Deliberately says nothing about licensing. `pyproject.toml` in both
 * packages declares `LicenseRef-Proprietary`, and there is no LICENSE file,
 * so any stronger claim here would be unsupported.
 */
export const SITE_SUMMARY =
  "Aphelion Editor is a node-based video compositor and video editor for desktop workflows. It is written in Python, runs on Windows, macOS and Linux, ships a Windows installer, and can be extended with custom video-effect nodes written in Python.";

export const PIP_PACKAGE_INSTALL = "pip install aphelion-plugin-sdk";
export const PIP_CHECKOUT_INSTALL = "pip install -e ./aphelion-sdk";

export const EDITOR_CLONE_INSTALL = 'pip install -e ".[dev,freeze]"';
export const EDITOR_LAUNCH = "python main.py";

/* ==================================================================== *
 * Licensing
 * ==================================================================== *
 *
 * ## Why this is a constant and not prose
 *
 * The SEO brief asked for the site to position Aphelion as *open source*
 * and to target searches like "open source video editor". The repository
 * says otherwise:
 *
 *   - `aphelion-editor/pyproject.toml` → `license = "LicenseRef-Proprietary"`
 *   - `aphelion-sdk/pyproject.toml`    → `license = "LicenseRef-Proprietary"`
 *   - `aphelion-sdk/README.md`         → "## License — Proprietary"
 *   - and there is no `LICENSE` file in either package or at the repo root.
 *
 * Publishing "open source" from the website would be a false statement about
 * a commercial product, so the site does not make it. `pyproject.toml` is
 * the canonical source and it wins.
 *
 * ## To flip this
 *
 * If the project does adopt a licence, this is the only place to change:
 *
 *   1. Add a real `LICENSE` file to both packages and set the licence field
 *      in both `pyproject.toml` files.
 *   2. Set `IS_OPEN_SOURCE = true` below.
 *   3. The site then adds the "open source" framing to the homepage, the
 *      About page and the social card automatically, and re-enables the
 *      `license` property in the `SoftwareApplication` structured data.
 *
 * Until step 1 is done, `IS_OPEN_SOURCE` must stay `false`. Claiming a
 * licence the project does not grant is worse than ranking lower.
 */
export const IS_OPEN_SOURCE = false;

/**
 * How the source is described when it is readable but not licensed for
 * reuse. Phrased to be accurate for a proprietary, source-available project:
 * people may read it and learn from it; nobody is told they may reuse it.
 */
export const SOURCE_ACCESS_STATEMENT =
  "The complete source is on GitHub. You can read it, and the architecture and plugin documentation are part of the published docs.";

/** Shown on `/about`. Only overridden from prose if a licence is added. */
export const LICENSE_STATEMENT =
  "Aphelion is proprietary software, distributed under the terms declared in each package's `pyproject.toml`. No licence to reuse, modify or redistribute the source is granted by its availability on GitHub. If you need clarification before using Aphelion commercially, contact the maintainers.";

/**
 * What the editor does, stated plainly. Each line maps to something in
 * `aphelion-editor/docs/` rather than to a marketing category.
 */
export type Capability = {
  label: string;
  detail: string;
};

export const EDITOR_CAPABILITIES: readonly Capability[] = [
  {
    label: "Node graph",
    detail: `${EDITOR_NODE_COUNT} built-in nodes covering input, generators, color, filters, compositing, transform, keying, roto, tracking, timing, distort, stylize and math.`,
  },
  {
    label: "Preview",
    detail:
      "Decode-time proxy defaults to 960px, with an optional 640px playback proxy. Frames are cached and prefetched, and heavy work runs off the UI thread.",
  },
  {
    label: "Color",
    detail:
      "Grading, exposure, hue/saturation, white balance, levels, vibrance, shadows/highlights, monochrome, posterize and creative looks.",
  },
  {
    label: "Keying and roto",
    detail:
      "Chroma key, matte edge, spill suppression, bezier roto shapes, point and planar tracking, and corner pin.",
  },
  {
    label: "Timeline",
    detail:
      "In/out points, playback and keyframed properties. A new project starts at 1920×1080, 30 fps, 10 seconds.",
  },
  {
    label: "Export",
    detail:
      "MP4 (H.264) or a PNG sequence from whichever Viewer is active. Encoder selection prefers a GPU encoder when the bundled FFmpeg offers one.",
  },
  {
    label: "Projects",
    detail: "`.aph` files are JSON. Autosave starts once the project has a path on disk.",
  },
  {
    label: "Plugins",
    detail:
      "Drop-in `aphelion_sdk` modules or wheels, enabled, disabled and reloaded from Preferences → Plugins.",
  },
];

/**
 * Known gaps. The site should be candid about these: the project is
 * pre-1.0 and saying so is worth more than a uniform wall of positives.
 */
export const EDITOR_LIMITATIONS: readonly string[] = [
  `Version ${EDITOR_VERSION}. Expect rough edges, and APIs that can still move before 1.0.`,
  "The installable MSI is Windows only. macOS and Linux run from a Python checkout.",
  "The plugin SDK covers video effects. Audio plugin bases are not shipped yet.",
];

export type EditorRequirement = {
  dependency: string;
  version: string;
  role: string;
};

export const EDITOR_REQUIREMENTS: readonly EditorRequirement[] = [
  { dependency: "Python", version: PYTHON_REQUIREMENT, role: "Runtime" },
  { dependency: "PyQt6", version: "≥ 6.6", role: "Application shell" },
  { dependency: "NumPy", version: "≥ 1.26", role: "Frame buffers" },
  { dependency: "OpenCV", version: "≥ 4.8", role: "Decode, tracking, effects" },
  { dependency: "imageio + imageio-ffmpeg", version: "≥ 2.34", role: "Media I/O" },
  { dependency: "cx_Freeze", version: "≥ 8.6", role: "Optional freeze and MSI" },
];
