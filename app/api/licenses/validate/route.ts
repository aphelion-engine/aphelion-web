import { createPrivateKey, sign } from "node:crypto";

import { adminDb } from "@/lib/server/firebase-admin";
import { hashLicenseKey, normalizeLicenseKey, productIsAllowed } from "@/lib/server/licensing";

export const runtime = "nodejs";

/**
 * Desktop activation endpoint. It intentionally returns only an active bit;
 * it never exposes ownership, purchase, or account data to the client.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      licenseKey?: unknown;
      productId?: unknown;
      productVersion?: unknown;
    };
    const key = normalizeLicenseKey(body.licenseKey);
    if (!productIsAllowed(body.productId)) {
      return Response.json({ active: false, error: "Product is not eligible for licensing." }, { status: 400 });
    }
    if (body.productVersion !== undefined && typeof body.productVersion !== "string") {
      return Response.json({ active: false, error: "Invalid product version." }, { status: 400 });
    }
    const match = await adminDb().collection("licenses").where("keyHash", "==", hashLicenseKey(key)).limit(1).get();
    if (match.empty) return Response.json({ active: false, error: "License key was not found." }, { status: 404 });
    const claims = Buffer.from(JSON.stringify({
      productId: body.productId,
      productVersion: body.productVersion || null,
      issuedAt: new Date().toISOString(),
    }), "utf8");
    const encodedClaims = claims.toString("base64url");
    const privateKey = createPrivateKey(process.env.LICENSE_SIGNING_PRIVATE_KEY || "");
    const signature = sign(null, claims, privateKey).toString("base64url");
    return Response.json({ active: true, productId: body.productId, entitlement: `${encodedClaims}.${signature}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to validate license.";
    return Response.json({ active: false, error: message }, { status: 400 });
  }
}
