import { FieldValue } from "firebase-admin/firestore";

import { adminDb, verifyFirebaseBearer } from "@/lib/server/firebase-admin";
import { hashLicenseKey, normalizeLicenseKey, productIsAllowed } from "@/lib/server/licensing";
import { assertBrowserOrigin, jsonError } from "@/lib/server/request-security";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    assertBrowserOrigin(request);
    const user = await verifyFirebaseBearer(request.headers.get("authorization"));
    const raw = await request.text();
    if (raw.length > 8_192) return jsonError("Request is too large.", 413);
    const body = JSON.parse(raw) as { licenseKey?: unknown; productId?: unknown; productVersion?: unknown };
    const licenseKey = normalizeLicenseKey(body.licenseKey);
    if (!productIsAllowed(body.productId)) return jsonError("That product is not eligible for licensing.");
    if (body.productVersion !== undefined && (typeof body.productVersion !== "string" || body.productVersion.length > 64)) return jsonError("Invalid product version.");
    const db = adminDb();
    const match = await db.collection("licenses").where("keyHash", "==", hashLicenseKey(licenseKey)).limit(1).get();
    if (match.empty) return jsonError("License key was not found.", 404);
    const licenseRef = match.docs[0].ref;
    const redemptionRef = licenseRef.collection("redemptions").doc(body.productId);
    await db.runTransaction(async (transaction) => {
      const license = await transaction.get(licenseRef);
      const redemption = await transaction.get(redemptionRef);
      if (!license.exists) throw new Error("License key was not found.");
      const data = license.data()!;
      if (data.ownerUid && data.ownerUid !== user.uid) throw new Error("This license belongs to another account.");
      if (redemption.exists) {
        if (redemption.data()?.uid !== user.uid) throw new Error("This product has already been redeemed.");
        return;
      }
      transaction.create(redemptionRef, { uid: user.uid, productId: body.productId, productVersion: body.productVersion || null, redeemedAt: FieldValue.serverTimestamp() });
      transaction.update(licenseRef, { ownerUid: user.uid, redemptionCount: FieldValue.increment(1), redeemedProducts: FieldValue.arrayUnion(body.productId) });
    });
    return Response.json({ status: "active", productId: body.productId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to redeem license.";
    return jsonError(message, message.includes("Authentication") || message.includes("origin") ? 401 : 400);
  }
}
