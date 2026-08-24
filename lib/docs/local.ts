import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import type { DocsSource } from "@/lib/docs/catalog";
import { isDocsMarkdownPath } from "@/lib/docs/paths";

function sourceRoot(source: DocsSource): string {
  return path.resolve(process.cwd(), "..", source.localDir);
}

async function walkMarkdown(dir: string, relativePrefix: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const relative = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      files.push(...(await walkMarkdown(full, relative)));
      continue;
    }
    if (entry.isFile() && isDocsMarkdownPath(relative.replace(/\\/g, "/"))) {
      files.push(relative.replace(/\\/g, "/"));
    }
  }
  return files;
}

export async function listLocalMarkdown(source: DocsSource): Promise<string[]> {
  const root = sourceRoot(source);
  const info = await stat(root);
  if (!info.isDirectory()) {
    throw new Error(`Local docs root missing: ${root}`);
  }
  const docsDir = path.join(root, "docs");
  const files = await walkMarkdown(docsDir, "docs");
  try {
    await stat(path.join(root, "README.md"));
    files.push("README.md");
  } catch {
    /* optional */
  }
  return files;
}

export async function readLocalFile(source: DocsSource, repoPath: string): Promise<string> {
  const full = path.join(sourceRoot(source), ...repoPath.split("/"));
  return readFile(full, "utf8");
}
