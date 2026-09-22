# Licensing security

The licensing API is server-only. Firebase ID tokens are verified with Firebase Admin before account or payment operations. Firestore client access to `purchases`, `licenses`, `redemptions`, and webhook idempotency records is denied by `firestore.rules`; deploy those rules before production checkout.

## Setup

1. Copy `.env.example` to the deployment environment and fill every placeholder. Never put Admin, PayPal, hash, or encryption secrets in a `NEXT_PUBLIC_*` variable.
2. Create a PayPal REST app in the intended sandbox or live account. Configure `PAYPAL_ENVIRONMENT`, credentials, and a webhook endpoint at `/api/payments/paypal/webhook`. Subscribe to `PAYMENT.CAPTURE.COMPLETED` and `CHECKOUT.ORDER.COMPLETED`, then set the resulting webhook ID.
3. Set `LICENSE_PRICE` explicitly with two decimal places. The browser never supplies or determines this amount.
4. Deploy the Firestore rules and ensure the Admin service account can read/write the required collections.

Keys are generated with Node cryptographic randomness. Only an HMAC lookup hash and AES-GCM ciphertext are stored. The raw key is revealed once after server verification of a completed capture; account views show only a prefix and last four characters. Rotate secrets deliberately: changing the hash secret prevents old keys from being found, and changing the encryption key prevents ciphertext recovery, so migrate/re-encrypt before rotation.

Product clients should call `POST /api/licenses/redeem` with a Firebase ID token, the key, and an allowlisted product ID such as `aphelion-editor`. The response is a safe active status; it is not a substitute for the product's own signed entitlement/session validation. Add future product IDs to the server allowlist and update the product integration intentionally.

The desktop editor uses `POST /api/licenses/validate` for its offline-friendly
activation state. That endpoint returns only `{ active, productId, entitlement }`;
it never returns account or purchase data. The editor stores the signed
entitlement and the key's last four characters, not a trusted local boolean.

Set `LICENSE_SIGNING_PRIVATE_KEY` to the Ed25519 PKCS#8 private key in the
server environment. The corresponding public key is embedded in the editor;
never place the private key in the repository, installer, `.env` checked into
source, or a client environment variable.

Use PayPal sandbox credentials and webhook configuration in non-production deployments. Treat webhook verification and capture lookup as mandatory: fulfillment must not depend on client redirects or client-provided prices.
