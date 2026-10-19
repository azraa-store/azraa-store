# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read this first: project status (updated 2026-10-19)

This section is a durable, account-independent continuity record, read it
before anything else. It survives a conversation reset or a switch to a
different Claude account, since it's committed to this repo rather than
living only in chat history or local memory. Claude's local memory files
(if present, under the user's `.claude` config directory) carry additional
session-by-session narrative detail and feedback/preferences; this section
is the durable backup of the load-bearing facts. If memory is present and
disagrees with this section, prefer whichever is more recent/specific, and
update both to match.

**Repo topology**: this repo (`azraa-store/azraa-store`, public) is the
frontend only. A separate repo, `azraa-store/azraa-backend` (private),
holds the Node/Express backend (payment verification, Turnstile
verification) deployed independently on Render, see `### Payments`
below. They were briefly merged into one repo (a `backend/` folder here)
and explicitly un-merged back to two repos; don't re-suggest merging them.
An old personal repo (`Ndubuisi-Godcares/azraa.git`) is kept as a git
remote (`old-personal-origin`) for history only, never push there.
Standing instruction: commit and push after every verified change,
without waiting to be asked.

**Third-party accounts already set up** (by the user directly in each
dashboard; secret values never pass through Claude, only env var *names*
are shared in chat):
- **Supabase**: project live, schema applied (`supabase/schema.sql`,
  re-run it after any change to that file). Auth → Emails → Templates has
  custom AZRAA-branded HTML pasted in for Confirm signup, Reset password,
  Magic link, and Change email, plus the 7 "Security" notification
  templates, see `supabase/email-templates/` in this repo for a durable
  copy of all of them (Supabase itself has no way to sync/export these,
  so that folder is the only backup). Password policy: 8+ chars, upper +
  lower case, a digit, a symbol, enforced both in Supabase's own Auth
  settings and client-side (`src/utils/passwordPolicy.js`).
- **Cloudflare**: `azraa.store` domain on Cloudflare DNS, redirecting
  apex → `www.azraa.store` (that redirect is handled by Vercel, not a
  Cloudflare rule). R2 bucket created with custom domain `cdn.azraa.store`
  connected, but **not yet wired into any frontend code** (no
  `VITE_R2_PUBLIC_BASE_URL` usage exists yet, product images still serve
  from `public/products/*.jpg` in this repo). Turnstile widget created,
  hostnames allow-listed for `www.azraa.store` and the Vercel fallback
  domain (NOT `localhost`, so the widget only completes in production,
  not local dev, unless `localhost` is added to its hostname list too),
  confirmed working end-to-end in production.
- **Resend**: used as Supabase's custom SMTP (domain verified, API key
  with Sending-access-only permission). This replaced Supabase's default
  rate-limited mailer and is confirmed working, sign-up confirmation
  emails send successfully.
- **Render**: `azraa-backend` deployed from the separate backend repo,
  via `render.yaml` blueprint. Payment provider secret keys
  (Razorpay/Paystack/PayPal) are NOT yet entered, deliberately deferred,
  see below.
- **Sentry**: two projects created (`azraa-store` on the React platform,
  `azraa-backend` on Express/Node) but the SDK is not yet installed or
  initialized in either codebase, this is configured account-side only
  so far.
- **Google OAuth**: not started. Planned next step for auth (after email
  password + magic link, both confirmed working), needs a Google Cloud
  OAuth consent screen + client ID/secret, then enabling the Google
  provider in Supabase's Auth settings.

**Explicitly deferred, do not start proactively**: real payment gateway
keys/testing. The user said to exclude this until deliberately testing
payments right before launch, resurface it only when the conversation
turns to going live/launching.

**Known loose ends, worth resurfacing if relevant**:
- The old hero intro video (removed from the live site for showing two
  real trademarks, a Harry Potter Slytherin design and a real band's tour
  merch) still exists in this repo's git history from before its removal.
  Not scrubbed (would need a history rewrite + force-push). See
  `### Hero image` below.
- Cloudflare's "Proxy Detected" warning on `azraa.store`/`www.azraa.store`
  in Vercel's domain settings was flagged, recommended fix is switching
  those two DNS records to "DNS only" (grey cloud) in Cloudflare, not
  confirmed done.
- The two newsletter sign-up forms (homepage section + footer) are still
  non-functional client-side mocks, no real email-collection backend
  exists for them yet.
- No `orders` table exists in Supabase yet; `azraa-backend`'s
  `markOrderPaid()` is a no-op stub until that schema is added.
- A full IP/trademark audit excluded 10 photographed products from the
  catalogue for carrying real trademarks, see `### Categories` /
  `src/services/catalog.js` and the memory IP-safety notes; their raw
  files live only in a local, gitignored `trademark/` folder, never
  commit anything there.

## Commands

```bash
npm install
npm run dev        # Vite dev server, http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the production build, http://localhost:4173
```

No test suite, linter, or type checker is configured. There is no single-test command.

Python inventory CLI (standalone, stdlib only, separate from the frontend):

```bash
cd inventory
python manage.py seed
python manage.py view "Round Neck"
python manage.py set "Round Neck T-Shirt" White M 120
python manage.py order   round-neck-t-shirt White M 5 --ref AZ10001
python manage.py restore round-neck-t-shirt White M 5 --ref AZ10001
python manage.py unavailable leather-bags
python manage.py history
```

Asset pipeline scripts (OpenCV, run manually when source assets change):

```bash
python scripts/process-logo.py   # assets/company-logo.png -> public brand/* + favicons
python scripts/process-hero.py   # assets/hero.png -> public/textures/hero-range.jpg (4K upscale)
```

## Architecture

React 18 + React Router 6 + GSAP/Lenis on Vite. **All backend is mock services + `localStorage`**, each file shaped so a real API can be swapped in later, when working on `services/`, preserve that seam rather than hardcoding client-side-only assumptions.

- `src/config/site.js`, single source of truth for public contact channels (WhatsApp number/link).
- `src/i18n/assistant.js`, assistant UI languages + string table (en/hi/bn/sw/fr/ar). Routing/intent matching is English-keyword-only regardless of UI language; only labels/content are translated.
- `src/data/`, static catalogue data: countries, categories, products, colors, logistics, faqs (FAQ answers are per-language objects `{en,hi,bn,sw,fr,ar}`).
- `src/services/`, the mock backend: `catalog`, `auth`, `orders`, `wholesale`, `pricing`, `fx`, `region`, `inventory`, `assistant`, `payments/{index,razorpay,paystack,paypal}`.
- `src/context/`, app-wide React state: `ThemeContext`, `RegionContext`, `AuthContext`, `CartContext`, `AssistantContext`.
- `src/components/chrome/`, site-wide shell: `Header`, `MobileMenu`, `SearchOverlay`, `CountryPicker`, `ThemeToggle`, `RegionModal`, `CartDrawer`, `Footer`, `FxNote`, `WhatsAppFab`, `AzraaBot`, `Logo`.
- `src/components/home/`, `commerce/`, `ui/`, page-section, product-card, and shared primitive components respectively.
- `src/pages/`, one component per route; `auth/` and `account/` and `admin/` are subfolders.
- `src/styles/`, `global.css` (design tokens), `site.css`, `extras.css`.

### Theming

`ThemeContext` sets `data-theme="light|dark"` on `<html>`; a pre-paint script in `index.html` prevents a flash. Every color is a CSS variable token in `global.css` (`--bg`, `--ink`, `--ink-dim`, `--ink-faint`, `--hover-wash`, `--scrim`, `--hero-*`, etc.), don't hardcode colors in component styles, add/use tokens. Light is the default art direction (warm-white editorial); dark is the secondary theme.

### Pricing

Every product in `data/products.js` carries both a retail and a wholesale price, each as `{ inr, usd }`. INR is the source of truth; USD is the canonical cross-rate reference derived once via `CONFIG_INR_PER_USD` (currently 90). `services/pricing.js` resolves the displayed price: India sees exact INR, US sees USD (default), everywhere else converts live from USD via `services/fx.js` (keyless `open.er-api.com`, cached 12h, dated-snapshot fallback surfaced via `FxNote`). Never add a second conversion hop, one conversion only, so rounding errors don't compound. `data/logistics.js` holds per-order delivery pricing (retail vs wholesale rate); `EXPRESS_MULTIPLIER` (1.6×) applies on top.

### Retail vs wholesale

One product, one page, a Retail/Wholesale switch, not separate flows. The switch changes unit price, minimum order quantity (MOQ: 12 for apparel, 6–8 for shoes/bags), logistics rate, and the cart line's order type. Wholesale is a **direct purchase at or above MOQ**, not an enquiry. `/wholesale/enquiry` is only for opening a trade account (custom pricing/terms). A cart with any wholesale line makes the whole order wholesale-typed.

### Country / region

`RegionModal` greets first-time visitors with India/Nigeria/Other plus an optional IP-based "Detect my region" (keyless, never forces the browser geolocation prompt). `services/region.js` separately exposes a permission-gated `geolocateCountry()` for explicit precise-location opt-in. Detection only suggests a default, the `CountryPicker` (header/footer/checkout) is the actual source of truth and always wins, persisting across the session.

### Authentication

Provider dispatcher in `services/auth.js`, mirroring the `services/payments/` registry pattern: real Supabase Auth (`services/auth/supabase.js`) when `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are set, otherwise a localStorage mock (`services/auth/mock.js`) so the full flow is testable without credentials. Both backends expose the exact same function signatures so `AuthContext` and every consuming page are backend-agnostic. Schema (`profiles` + `addresses` tables, RLS policies, the auto-create-profile trigger) lives in `supabase/schema.sql`, run once in the Supabase SQL editor. `signUp()` returns `{ user, needsConfirmation }`: Supabase's default email-confirmation requirement means a fresh sign-up may not get an immediate session, so `SignUpPage` shows a "check your email" state instead of navigating straight to `/account` in that case. The password-reset email link lands on `/reset-password/confirm` (`ResetConfirmPage`), which Supabase's client authenticates automatically via the URL token before the user sets a new password.

### Inventory

Tracked at product → colour → size → quantity in `services/inventory.js`; customers only ever see derived In stock/Low stock/Out of stock (thresholds are per-product). Confirmed orders decrement via `orders.js` → `inventory.applyOrder`, which checks every line before committing anything (never oversells). Cancellations restore via `cancelOrder` → `restoreOrder`. Abandoned carts never touch stock. The Python CLI in `inventory/` reads/writes the same JSON shape as the browser store but is standalone (stdlib only), keep them shape-compatible if you change one. `/admin` is a demo-gated (passphrase `azraa-admin`) placeholder for a future server-authenticated admin view.

### Categories

Live categories: Men, Shoes, Bags, Ladies. Food exists in `data/categories.js` with `active: false`, hidden from nav/shop/search/direct URLs by that flag, not deleted. Check `active` before assuming a category list is exhaustive.

### Payments

Modular provider registry in `services/payments/`, enabled per country (India: Razorpay/PayPal; Nigeria/GH/KE/ZA: Paystack/PayPal; elsewhere: PayPal). Flutterwave was removed (not in use); if it's reintroduced later, mirror the existing provider-file pattern rather than reaching for a different integration approach. Only publishable keys ever go client-side (`import.meta.env`); with none set, a provider runs in mock mode so checkout is end-to-end testable without real credentials. Each provider file documents the backend call it's standing in for. Final charge amounts must be (re-)validated server-side in the charge currency, the client-side price is not trusted for the actual charge.

The backend that handles this server-side validation (plus Cloudflare Turnstile verification) lives in a **separate repo**, `azraa-store/azraa-backend`, deployed independently on Render, nothing from it belongs in this repo, and this repo should never hold backend secret keys.

### AZRAA assistant

Bottom-right chat widget on every page (`components/chrome/AzraaBot.jsx` + `context/AssistantContext.jsx`), introduces itself as "AZRAA". `services/assistant.js` runs **locally by default**, an intent router over the live catalogue, region-aware pricing/inventory, and FAQ data, no key ever in the browser. If `VITE_ASSISTANT_ENDPOINT` is set, every turn POSTs to that backend instead (model runs server-side) and returns the same reply shape `{content,chips,products,links,handoff}`; the UI doesn't change either way, and it silently falls back to local on a request error. First open shows a language picker (en/hi/bn/sw/fr/ar, Arabic renders RTL), persisted to `localStorage`; non-English intent routing still matches on English keywords, so a chip's `send` value stays English while its visible `label` is translated.

### Hero image

The hero is the full product photograph shown complete and uncropped (`components/home/HomeHero.jsx`), `width:100%; height:auto`, no `object-fit` crop or zoom. The checked-in source `assets/hero.png` is sub-1080p; `scripts/process-hero.py` (OpenCV) upscales it to `public/textures/hero-range.jpg` (3840×2136, bilateral denoise → two-step Lanczos → gentle unsharp, no added grain), regenerate via that script rather than hand-editing the JPG if the source photo changes. There is no 3D/WebGL hero anymore (removed; `three`/`@react-three/*`/`postprocessing` are not dependencies), don't reintroduce a Three.js scene without checking with the user first, since it was deliberately deleted for bundle size.

## Still needs real data

Product photography, final wholesale prices for TBD items, company registration/address/support contacts, legal copy, and live payment credentials are placeholders marked *coming soon*/*to follow* in place, don't treat them as bugs.
