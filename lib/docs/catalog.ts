export const DOCS_REVALIDATE_SECONDS = 120;

export type DocsSourceId = "editor" | "sdk";

export type DocsSource = {
  id: DocsSourceId;
  label: string;
  description: string;
  owner: string;
  repo: string;
  branch: string;
  localDir: string;
  githubUrl: string;
};

export const DOCS_SOURCES: readonly DocsSource[] = [
  {
    id: "editor",
    label: "Aphelion Editor",
    description: "Install, workspace, plugins, architecture, and packaging.",
    owner: "aphelion-engine",
    repo: "aphelion-editor",
    branch: "main",
    localDir: "aphelion-editor",
    githubUrl: "https://github.com/aphelion-engine/aphelion-editor",
  },
  {
    id: "sdk",
    label: "Aphelion SDK",
    description: "Author plugins, widgets, API reference, and packaging.",
    owner: "aphelion-engine",
    repo: "aphelion-sdk",
    branch: "main",
    localDir: "aphelion-sdk",
    githubUrl: "https://github.com/aphelion-engine/aphelion-sdk",
  },
];

export function getDocsSource(id: string): DocsSource | null {
  return DOCS_SOURCES.find((source) => source.id === id) ?? null;
}

export function isDocsSourceId(id: string): id is DocsSourceId {
  return DOCS_SOURCES.some((source) => source.id === id);
}
