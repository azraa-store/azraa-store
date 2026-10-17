# azraa-backend

Small Node/Express service that holds the secrets and server-only logic the
`azraa-store` frontend (this repo's root) can't run in the browser: payment
provider order creation + verification, and Cloudflare Turnstile token
verification. Deployed separately on Render, with its root directory set to
`backend/` (see `render.yaml` at the repo root) — the frontend stays on
Vercel, unaffected by anything in this folder.

Everything else (catalogue, auth, orders, inventory reads) is expected to
talk to Supabase directly from the frontend — this service is deliberately
minimal, not a general-purpose API.

## Run locally

```bash
cd backend
npm install
cp .env.example .env   # fill in whichever provider keys you're testing
npm run dev
```

Health check: `GET /healthz`.

## Endpoints

- `POST /api/turnstile/verify` — `{ token }` → `{ success }`
- `POST /api/payments/razorpay/session` — `{ orderId, amount, currency }` → `{ razorpayOrderId, amount, currency, keyId }`
- `POST /api/payments/razorpay/verify` — `{ razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId }` → `{ status }`
- `POST /api/payments/paystack/session` — `{ orderId, email, amount, currency }` → `{ accessCode, reference }`
- `GET  /api/payments/paystack/verify/:reference?orderId=` → `{ status }`
- `POST /api/payments/flutterwave/session` — `{ orderId, amount, currency, email, redirectUrl }` → `{ txRef, paymentLink }`
- `GET  /api/payments/flutterwave/verify/:transactionId?orderId=` → `{ status }`
- `POST /api/payments/paypal/session` — `{ orderId, amount, currency }` → `{ paypalOrderId }`
- `POST /api/payments/paypal/capture` — `{ paypalOrderId, orderId }` → `{ status }`

Each endpoint 503s with `{ error: "<provider> not configured" }` if its
secret key env var isn't set, so you can deploy this before every provider
account exists and bring them online one at a time.

## Not yet wired up

`markOrderPaid()` in `src/supabaseAdmin.js` updates an `orders` table that
doesn't exist yet — until the Supabase schema is created it just logs and
no-ops, so payment flows are still testable end to end. Also not in scope
yet: Cloudflare R2 (product image storage) and the general-purpose
catalogue/auth/orders API, which live in Supabase directly rather than here.

## Env vars (Render dashboard, not committed)

See `.env.example`. `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, and
every provider secret key are server-only — never put these in the
frontend's env vars.
