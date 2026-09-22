import "server-only";

export function assertBrowserOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  // Native product clients authenticate with a bearer token and generally do
  // not send an Origin header. Browser requests still need same-origin CSRF
  // protection because these endpoints create or mutate entitlements.
  if (!origin) return;
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const developmentOrigins =
    process.env.NODE_ENV === "production"
      ? []
      : ["http://localhost:3000", "http://127.0.0.1:3000"];
  if (![configuredOrigin, ...developmentOrigins].filter(Boolean).includes(origin)) {
    throw new Error("Untrusted request origin.");
  }
}

export function trustedRequestOrigin(request: Request): string {
  assertBrowserOrigin(request);
  const origin = request.headers.get("origin");
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!origin && !configuredOrigin) throw new Error("Server configuration is missing NEXT_PUBLIC_SITE_URL.");
  return origin || configuredOrigin!;
}

export function jsonError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

export function isMethod(request: Request, method: string): boolean {
  return request.method === method;
}
