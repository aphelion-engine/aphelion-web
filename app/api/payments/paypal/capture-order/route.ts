import { verifyFirebaseBearer, adminDb } from "@/lib/server/firebase-admin";
import { fulfillCapturedOrder, validateCapturedOrder } from "@/lib/server/licensing";
import { assertBrowserOrigin, jsonError } from "@/lib/server/request-security";
import { paypalApi, type PayPalOrder } from "@/lib/server/paypal";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    assertBrowserOrigin(request);
    const user = await verifyFirebaseBearer(request.headers.get("authorization"));
    const body = await request.json();
    if (!body || typeof body.orderId !== "string" || !/^[A-Z0-9-]{10,80}$/.test(body.orderId)) return jsonError("A valid order ID is required.");
    const purchaseSnap = await adminDb().collection("purchases").doc(body.orderId).get();
    if (!purchaseSnap.exists || purchaseSnap.data()?.uid !== user.uid) return jsonError("Payment record was not found.", 404);
    const order = await paypalApi<PayPalOrder>(
      `/v2/checkout/orders/${encodeURIComponent(body.orderId)}/capture`,
      { method: "POST", headers: { Prefer: "return=representation" } },
    );
    const captureId = await validateCapturedOrder(order);
    const result = await fulfillCapturedOrder(body.orderId, captureId, true);
    return Response.json({ fulfilled: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to confirm payment.";
    return jsonError(message, message.includes("Authentication") || message.includes("origin") ? 401 : 400);
  }
}
