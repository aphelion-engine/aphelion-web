import { verifyFirebaseBearer, adminDb } from "@/lib/server/firebase-admin";
import { jsonError } from "@/lib/server/request-security";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  try {
    const user = await verifyFirebaseBearer(request.headers.get("authorization"));
    const snapshot = await adminDb().collection("licenses").where("ownerUid", "==", user.uid).limit(50).get();
    return Response.json({ licenses: snapshot.docs.map((doc) => { const data = doc.data(); return { id: doc.id, keyPrefix: data.keyPrefix, keyLastFour: data.keyLastFour, purchasedAt: data.purchasedAt?.toDate?.()?.toISOString() || null, redeemedProducts: data.redeemedProducts || [] }; }) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load licenses.";
    return jsonError(message, 401);
  }
}
