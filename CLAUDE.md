# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

React 18 + React Router 6 + GSAP/Lenis on Vite. **All backend is mock services + `localStorage`**, each file shaped so a real API can be swapped in later — when working on `services/`, preserve that seam rather than hardcoding client-side-only assumptions.

- `src/config/site.js` — single source of truth for public contact channels (WhatsApp number/link).
- `src/i18n/assistant.js` — assistant UI languages + string table (en/hi/bn/sw/fr/ar). Routing/intent matching is English-keyword-only regardless of UI language; only labels/content are translated.
- `src/data/` — static catalogue data: countries, categories, products, colors, logistics, faqs (FAQ answers are per-language objects `{en,hi,bn,sw,fr,ar}`).
- `src/services/` — the mock backend: `catalog`, `auth`, `orders`, `wholesale`, `pricing`, `fx`, `region`, `inventory`, `assistant`, `payments/{index,razorpay,paystack,flutterwave,paypal}`.
- `src/context/` — app-wide React state: `ThemeContext`, `RegionContext`, `AuthContext`, `CartContext`, `AssistantContext`.
- `src/components/chrome/` — site-wide shell: `Header`, `MobileMenu`, `SearchOverlay`, `CountryPicker`, `ThemeToggle`, `RegionModal`, `CartDrawer`, `Footer`, `FxNote`, `WhatsAppFab`, `AzraaBot`, `Logo`.
- `src/components/home/`, `commerce/`, `ui/` — page-section, product-card, and shared primitive components respectively.
- `src/pages/` — one component per route; `auth/` and `account/` and `admin/` are subfolders.
- `src/styles/` — `global.css` (design tokens), `site.css`, `extras.css`.

### Theming

`ThemeContext` sets `data-theme="light|dark"` on `<html>`; a pre-paint script in `index.html` prevents a flash. Every color is a CSS variable token in `global.css` (`--bg`, `--ink`, `--ink-dim`, `--ink-faint`, `--hover-wash`, `--scrim`, `--hero-*`, etc.) — don't hardcode colors in component styles, add/use tokens. Light is the default art direction (warm-white editorial); dark is the secondary theme.

### Pricing

Every product in `data/products.js` carries both a retail and a wholesale price, each as `{ inr, usd }`. INR is the source of truth; USD is the canonical cross-rate reference derived once via `CONFIG_INR_PER_USD` (currently 90). `services/pricing.js` resolves the displayed price: India sees exact INR, US sees USD (default), everywhere else converts live from USD via `services/fx.js` (keyless `open.er-api.com`, cached 12h, dated-snapshot fallback surfaced via `FxNote`). Never add a second conversion hop — one conversion only, so rounding errors don't compound. `data/logistics.js` holds per-order delivery pricing (retail vs wholesale rate); `EXPRESS_MULTIPLIER` (1.6×) applies on top.

### Retail vs wholesale

One product, one page, a Retail/Wholesale switch — not separate flows. The switch changes unit price, minimum order quantity (MOQ: 12 for apparel, 6–8 for shoes/bags), logistics rate, and the cart line's order type. Wholesale is a **direct purchase at or above MOQ**, not an enquiry. `/wholesale/enquiry` is only for opening a trade account (custom pricing/terms). A cart with any wholesale line makes the whole order wholesale-typed.

### Country / region

`RegionModal` greets first-time visitors with India/Nigeria/Other plus an optional IP-based "Detect my region" (keyless, never forces the browser geolocation prompt). `services/region.js` separately exposes a permission-gated `geolocateCountry()` for explicit precise-location opt-in. Detection only suggests a default — the `CountryPicker` (header/footer/checkout) is the actual source of truth and always wins, persisting across the session.

### Inventory

Tracked at product → colour → size → quantity in `services/inventory.js`; customers only ever see derived In stock/Low stock/Out of stock (thresholds are per-product). Confirmed orders decrement via `orders.js` → `inventory.applyOrder`, which checks every line before committing anything (never oversells). Cancellations restore via `cancelOrder` → `restoreOrder`. Abandoned carts never touch stock. The Python CLI in `inventory/` reads/writes the same JSON shape as the browser store but is standalone (stdlib only) — keep them shape-compatible if you change one. `/admin` is a demo-gated (passphrase `azraa-admin`) placeholder for a future server-authenticated admin view.

### Categories

Live categories: Men, Shoes, Bags, Ladies. Food exists in `data/categories.js` with `active: false` — hidden from nav/shop/search/direct URLs by that flag, not deleted. Check `active` before assuming a category list is exhaustive.

### Payments

Modular provider registry in `services/payments/`, enabled per country (India: Razorpay/PayPal; Nigeria: Paystack/Flutterwave/PayPal; GH/KE/ZA: Flutterwave/PayPal; elsewhere: PayPal). Only publishable keys ever go client-side (`import.meta.env`); with none set, a provider runs in mock mode so checkout is end-to-end testable without real credentials. Each provider file documents the backend call it's standing in for. Final charge amounts must be (re-)validated server-side in the charge currency — the client-side price is not trusted for the actual charge.

The backend that handles this server-side validation (plus Cloudflare Turnstile verification) lives in a **separate repo**, `azraa-store/azraa-backend`, deployed independently on Render — nothing from it belongs in this repo, and this repo should never hold backend secret keys.

### AZRAA assistant

Bottom-right chat widget on every page (`components/chrome/AzraaBot.jsx` + `context/AssistantContext.jsx`), introduces itself as "AZRAA". `services/assistant.js` runs **locally by default** — an intent router over the live catalogue, region-aware pricing/inventory, and FAQ data, no key ever in the browser. If `VITE_ASSISTANT_ENDPOINT` is set, every turn POSTs to that backend instead (model runs server-side) and returns the same reply shape `{content,chips,products,links,handoff}`; the UI doesn't change either way, and it silently falls back to local on a request error. First open shows a language picker (en/hi/bn/sw/fr/ar, Arabic renders RTL), persisted to `localStorage`; non-English intent routing still matches on English keywords, so a chip's `send` value stays English while its visible `label` is translated.

### Hero image

The hero is the full product photograph shown complete and uncropped (`components/home/HomeHero.jsx`) — `width:100%; height:auto`, no `object-fit` crop or zoom. The checked-in source `assets/hero.png` is sub-1080p; `scripts/process-hero.py` (OpenCV) upscales it to `public/textures/hero-range.jpg` (3840×2136, bilateral denoise → two-step Lanczos → gentle unsharp, no added grain) — regenerate via that script rather than hand-editing the JPG if the source photo changes. There is no 3D/WebGL hero anymore (removed; `three`/`@react-three/*`/`postprocessing` are not dependencies) — don't reintroduce a Three.js scene without checking with the user first, since it was deliberately deleted for bundle size.

## Still needs real data

Product photography, final wholesale prices for TBD items, company registration/address/support contacts, legal copy, and live payment credentials are placeholders marked *coming soon*/*to follow* in place — don't treat them as bugs.
