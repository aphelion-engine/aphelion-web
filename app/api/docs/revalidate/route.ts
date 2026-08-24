import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { GITHUB_DOCS_TAG } from "@/lib/docs/github";

export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.DOCS_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Docs revalidate is not configured." }, { status: 503 });
  }
  const header = request.headers.get("x-aphelion-docs-secret");
  if (header !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  revalidateTag(GITHUB_DOCS_TAG, "max");
  revalidatePath("/docs", "layout");
  return NextResponse.json({ ok: true });
}
