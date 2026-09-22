import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/server/firebase-admin";
import { fulfillCapturedOrder, validateCapturedOrder } from "@/lib/server/licensing";
import { jsonError } from "@/lib/server/request-security";
import { paypalApi, type PayPalOrder, type PayPalWebhookVerification } from "@/lib/server/paypal";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    const rawBody = await request.text();
    if (rawBody.length > 256_000) return jsonError("Webhook payload is too large.", 413);
    const event = JSON.parse(rawBody) as { id?: string; event_type?: string; resource?: { id?: string; supplementary_data?: { related_ids?: { order_id?: string } } } };
    if (!event.id) return jsonError("Webhook event ID is required.");
    const verification = await paypalApi<PayPalWebhookVerification>("/v1/notifications/verify-webhook-signature", {
      method: "POST",
      body: JSON.stringify({
        auth_algo: request.headers.get("paypal-auth-algo"),
        cert_url: request.headers.get("paypal-cert-url"),
        transmission_id: request.headers.get("paypal-transmission-id"),
        transmission_sig: request.headers.get("paypal-transmission-sig"),
        transmission_time: request.headers.get("paypal-transmission-time"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: event,
      }),
    });
    if (verification.verification_status !== "SUCCESS") return jsonError("Webhook signature verification failed.", 400);

    const eventRef = adminDb().collection("paypalWebhookEvents").doc(event.id);
    const eventSnap = await eventRef.get();
    if (eventSnap.exists && eventSnap.data()?.status === "completed") return Response.json({ received: true });
    await eventRef.set({ status: "processing", eventType: event.event_type || null, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

    const supported = new Set(["PAYMENT.CAPTURE.COMPLETED", "CHECKOUT.ORDER.COMPLETED"]);
    const orderId = event.resource?.supplementary_data?.related_ids?.order_id || (event.event_type === "CHECKOUT.ORDER.COMPLETED" ? event.resource?.id : undefined);
    if (supported.has(event.event_type || "") && orderId) {
      const order = await paypalApi<PayPalOrder>(`/v2/checkout/orders/${encodeURIComponent(orderId)}`);
      const captureId = await validateCapturedOrder(order);
      await fulfillCapturedOrder(orderId, captureId, false);
    }
    await eventRef.update({ status: "completed", completedAt: FieldValue.serverTimestamp() });
    return Response.json({ received: true });
  } catch {
    return jsonError("Webhook could not be processed.", 400);
  }
}
