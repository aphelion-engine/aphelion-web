import "server-only";

import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/server/firebase-admin";
import { licensePricing, type PayPalOrder } from "@/lib/server/paypal";

export const ALLOWED_PRODUCTS = new Set(["aphelion-editor"]);

function secret(name: string): Buffer {
  const value = process.env[name];
  if (!value) throw new Error(`Server configuration is missing ${name}.`);
  return Buffer.from(value, name === "LICENSE_ENCRYPTION_KEY" ? "base64" : "utf8");
}

function encryptionKey(): Buffer {
  const key = secret("LICENSE_ENCRYPTION_KEY");
  if (key.length !== 32) throw new Error("LICENSE_ENCRYPTION_KEY must decode to 32 bytes of base64.");
  return key;
}

export function hashLicenseKey(value: string): string {
  return createHmac("sha256", secret("LICENSE_HASH_SECRET")).update(value).digest("hex");
}

function encryptLicenseKey(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function decryptLicenseKey(value: string): string {
  const payload = Buffer.from(value, "base64url");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), payload.subarray(0, 12));
  decipher.setAuthTag(payload.subarray(12, 28));
  return Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]).toString("utf8");
}

function newLicenseKey(): string {
  return `APHL-${randomBytes(18).toString("hex").toUpperCase().match(/.{1,6}/g)!.join("-")}`;
}

function equalAmount(a: string | undefined, b: string): boolean {
  if (!a) return false;
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function fulfillCapturedOrder(orderId: string, captureId: string | undefined, reveal: boolean) {
  const db = adminDb();
  const purchaseRef = db.collection("purchases").doc(orderId);
  const result = await db.runTransaction(async (transaction) => {
    const purchaseSnap = await transaction.get(purchaseRef);
    if (!purchaseSnap.exists) throw new Error("Payment record was not found.");
    const purchase = purchaseSnap.data()!;
    if (purchase.status === "completed") {
      if (reveal && !purchase.keyRevealClaimedAt && purchase.licenseKeyCiphertext) {
        transaction.update(purchaseRef, { keyRevealClaimedAt: FieldValue.serverTimestamp() });
        return { ciphertext: purchase.licenseKeyCiphertext as string, reveal: true };
      }
      return { reveal: false };
    }
    if (purchase.status !== "pending") throw new Error("Payment record is not eligible for fulfillment.");

    const rawKey = newLicenseKey();
    const licenseRef = db.collection("licenses").doc();
    const now = FieldValue.serverTimestamp();
    const ciphertext = encryptLicenseKey(rawKey);
    transaction.create(licenseRef, {
      ownerUid: purchase.uid,
      keyHash: hashLicenseKey(rawKey),
      keyPrefix: rawKey.slice(0, 9),
      keyLastFour: rawKey.slice(-4),
      keyCiphertext: ciphertext,
      purchasedAt: now,
      purchaseId: orderId,
      paypalCaptureId: captureId || null,
      redemptionCount: 0,
      redeemedProducts: [],
    });
    transaction.update(purchaseRef, {
      status: "completed",
      licenseId: licenseRef.id,
      completedAt: now,
      paypalCaptureId: captureId || null,
      ...(reveal ? { keyRevealClaimedAt: now } : {}),
    });
    return { ciphertext, reveal };
  });
  return result.reveal && result.ciphertext ? { licenseKey: decryptLicenseKey(result.ciphertext) } : {};
}

export async function validateCapturedOrder(order: PayPalOrder) {
  const pricing = licensePricing();
  const capture = order.purchase_units?.flatMap((unit) => unit.payments?.captures || []).find((item) => item.status === "COMPLETED");
  const orderAmount = order.purchase_units?.[0]?.amount;
  if (order.status !== "COMPLETED" || !capture || !equalAmount(orderAmount?.value, pricing.price) || orderAmount?.currency_code !== pricing.currency || !equalAmount(capture.amount?.value, pricing.price) || capture.amount?.currency_code !== pricing.currency) {
    throw new Error("Payment amount or status could not be verified.");
  }
  return capture.id;
}

export function normalizeLicenseKey(value: unknown): string {
  if (typeof value !== "string" || value.length > 128) throw new Error("Enter a valid license key.");
  const normalized = value.trim().toUpperCase();
  if (!/^APHL(?:-[A-F0-9]{6}){3}$/.test(normalized)) throw new Error("Enter a valid license key.");
  return normalized;
}

export function productIsAllowed(productId: unknown): productId is string {
  return typeof productId === "string" && ALLOWED_PRODUCTS.has(productId);
}

export { FieldValue, Timestamp };
