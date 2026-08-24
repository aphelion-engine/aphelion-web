import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { NextResponse } from "next/server";

import { SDK_VERSION } from "@/lib/site";

const ZIP_NAME = `aphelion-sdk-${SDK_VERSION}.zip`;

function runTar(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("tar", args, { windowsHide: true });
    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr || `tar exited with code ${code}`));
    });
  });
}

export async function GET(): Promise<NextResponse> {
  const sdkRoot = path.resolve(process.cwd(), "..", "aphelion-sdk");
  const parent = path.dirname(sdkRoot);
  const tmp = await mkdtemp(path.join(os.tmpdir(), "aphelion-sdk-"));
  const zipPath = path.join(tmp, ZIP_NAME);

  try {
    await runTar([
      "-a",
      "-cf",
      zipPath,
      "--exclude=.venv",
      "--exclude=dist",
      "--exclude=build",
      "--exclude=__pycache__",
      "--exclude=.pytest_cache",
      "--exclude=.mypy_cache",
      "-C",
      parent,
      "aphelion-sdk",
    ]);
    const bytes = await readFile(zipPath);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${ZIP_NAME}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "SDK archive could not be built. Clone the repository and use pip install -e ./aphelion-sdk." },
      { status: 503 },
    );
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}
