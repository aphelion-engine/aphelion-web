import { FieldValue } from "firebase-admin/firestore";

import { adminDb, verifyFirebaseBearer } from "@/lib/server/firebase-admin";
import { jsonError, trustedRequestOrigin } from "@/lib/server/request-security";
import { licensePricing, paypalApi, type PayPalOrder } from "@/lib/server/paypal";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    const requestOrigin = trustedRequestOrigin(request);
    const user = await verifyFirebaseBearer(request.headers.get("authorization"));
    const pricing = licensePricing();
    const db = adminDb();
    const active = await db.collection("purchases").where("uid", "==", user.uid).where("status", "==", "pending").limit(1).get();
    if (!active.empty) {
      return Response.json({ orderId: active.docs[0].id }, { status: 200 });
    }

    const purchaseRef = db.collection("purchases").doc();
    const order = await paypalApi<PayPalOrder>("/v2/checkout/orders", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ reference_id: purchaseRef.id, invoice_id: purchaseRef.id, custom_id: user.uid, amount: { currency_code: pricing.currency, value: pricing.price } }],
         application_context: { user_action: "PAY_NOW", return_url: `${requestOrigin}/license?payment=approved`, cancel_url: `${requestOrigin}/license?payment=cancelled` },
      }),
    });
    if (!order.id) throw new Error("PayPal did not return an order ID.");
    await db.collection("purchases").doc(order.id).create({
      uid: user.uid,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      amount: pricing.price,
      currency: pricing.currency,
      paypalOrderId: order.id,
      purchaseReference: purchaseRef.id,
    });
    const approvalUrl = order.links?.find((link) => link.rel === "approve")?.href;
    if (!approvalUrl) throw new Error("PayPal did not return an approval URL.");
    return Response.json({ orderId: order.id, approvalUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create a payment.";
    return jsonError(message, message.includes("required") || message.includes("origin") ? 401 : 400);
  }
}
