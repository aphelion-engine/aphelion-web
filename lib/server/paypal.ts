import "server-only";

const TIMEOUT_MS = 10_000;

function paypalBaseUrl(): string {
  const environment = process.env.PAYPAL_ENVIRONMENT;
  if (environment !== "sandbox" && environment !== "live") {
    throw new Error("PAYPAL_ENVIRONMENT must be sandbox or live.");
  }
  return environment === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Server configuration is missing ${name}.`);
  return value;
}

export function licensePricing(): { price: string; currency: string } {
  const price = required("LICENSE_PRICE");
  if (!/^\d{1,10}\.\d{2}$/.test(price) || Number(price) <= 0) {
    throw new Error("LICENSE_PRICE must be a positive amount with two decimal places.");
  }
  const currency = process.env.LICENSE_CURRENCY || "USD";
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("LICENSE_CURRENCY must be a three-letter uppercase code.");
  return { price, currency };
}

async function paypalFetch<T>(path: string, init: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${paypalBaseUrl()}${path}`, { ...init, signal: controller.signal });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`PayPal request failed with status ${response.status}.`);
    return body as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function accessToken(): Promise<string> {
  const credentials = Buffer.from(`${required("PAYPAL_CLIENT_ID")}:${required("PAYPAL_CLIENT_SECRET")}`).toString("base64");
  const result = await paypalFetch<{ access_token?: string }>("/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!result.access_token) throw new Error("PayPal did not return an access token.");
  return result.access_token;
}

export async function paypalApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  return paypalFetch<T>(path, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
}

export type PayPalOrder = {
  id: string;
  status?: string;
  links?: { href: string; rel: string }[];
  purchase_units?: { amount?: { value?: string; currency_code?: string }; payments?: { captures?: { id: string; status?: string; amount?: { value?: string; currency_code?: string } }[] } }[];
};

export type PayPalWebhookVerification = { verification_status?: string };
