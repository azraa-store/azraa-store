# AZRAA

A polished editorial brand site **and** a professional international wholesale +
retail store — clothing, footwear and accessories, supplied across Asia and
Africa.

- **Light is the default art direction.** A warm-white editorial storefront.
- **The hero is the full product photograph** — shown complete and uncropped,
  graded per theme (bright by day, low-key by night).
- One toggle switches between light and dark; the choice persists.

Stack: React 18 · React Router 6 · GSAP + Lenis · Vite. All backend is mock
services + `localStorage`, each shaped to swap for a real API.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview
```

Payment keys (publishable only) → `.env.local`, see `.env.example`.

---

## Themes

`ThemeContext` writes `data-theme="light|dark"` on `<html>` (a pre-paint script in
`index.html` avoids a flash). Every colour is a token in `global.css`:

| token | light | dark |
|---|---|---|
| `--bg` | `#faf8f3` warm white | `#0b0b0c` |
| `--ink` (primary text) | `#0d0c0a` dark black | `#f3f0e9` |
| `--ink-dim` (body) | `#23211c` near-black | 78% bone |
| `--ink-faint` (labels) | `#4a473f` clear grey (~7.5:1) | 56% bone |
| plus | `--hover-wash`, `--scrim`, `--header-solid`, `--shadow-lg`, `--hero-*` … | |

**The hero** is the full editorial product photograph — the garment rail of tees
and shirts, the folded tee, both bags, the briefcase, all the footwear — shown
**complete and uncropped** (`components/home/HomeHero.jsx`): the image is laid in
at its own aspect ratio (`width: 100%; height: auto`, no `object-fit` crop, no
zoom), with the AZRAA copy set over the open concrete on the left behind a light
left-hand scrim. At phone widths the photo sits full-width up top and the copy
stacks beneath it. `--hero-img-filter` grades it per theme (bright light / low-key
dark); `--hero-scrim` + `--hero-wash` are the blend layers.

The source `assets/hero.png` is only 1681 px wide, so `scripts/process-hero.py`
(OpenCV) upscales it to a clean **4K** `public/textures/hero-range.jpg`
(3840×2136) — bilateral denoise → two-step Lanczos → gentle unsharp, **no** added
grain — so it stays crisp on retina.

**The logo** — the official Azraa lockup (red painterly figure + black tuxedo +
halo over the angular AZRAA wordmark). Light theme shows it in its original
colours (`/brand/logo-color.png`); dark theme uses a warm off-white rendering
(`/brand/logo-mono.png`). Both — plus the `favicon-*.png` set — are derived from
`assets/company-logo.png` by `scripts/process-logo.py`. The mark carries its own
wordmark, so no separate text is drawn beside it.

Typography, spacing and the editorial system are unchanged from the original.
Header nav links are Inter (the body face), regular weight, full `--ink`, and the
nav is centred in the bar with the logo left and the search / account / country /
theme / bag controls right.

**The AZRAA assistant** — customer service, bottom-right on every page
(`components/chrome/AzraaBot.jsx` + `context/AssistantContext.jsx`; it introduces
itself as “AZRAA”). It answers about products, pricing (region-aware), stock,
wholesale/MOQ, delivery, returns, payment and site navigation, and hands off to
WhatsApp for a person. First open asks the visitor to pick a language —
**English, हिन्दी, বাংলা, Kiswahili, Français, العربية** (Arabic renders RTL) —
stored in `localStorage` and changeable from the header globe. Strings live in
`i18n/assistant.js` (non-English is a first pass — native review recommended);
the FAQ answers in `data/faqs.js` are keyed by language. Routing stays English
keyword matching, so chip `send` values are English while chip labels are
translated.

The engine (`services/assistant.js`) runs **locally** off the site's own
catalogue / pricing / inventory / FAQ data by default — no key in the browser.
Set `VITE_ASSISTANT_ENDPOINT` and every turn is POSTed to that backend instead,
which runs the conversation against a model (e.g. `claude-opus-5`) server-side
and returns the same shaped reply; the UI is unchanged either way. The WhatsApp
number is in `config/site.js`.

---

## Pricing — every product, retail + wholesale

Every product carries **both a retail and a wholesale price**, each as
`{ inr, usd }` in `data/products.js`. The INR figures are the supplied source of
truth; the USD figure is the canonical cross-rate reference, derived once at
`CONFIG_INR_PER_USD` (currently **90**).

| price | ₹ | $ (rate 90) |
|---|---|---|
| Round Neck Tee — retail | 180 | **2.00** |
| Round Neck Tee — wholesale | 130 | **1.44** |
| Retail delivery (logistics) | 40 | **0.44** |
| Wholesale delivery (logistics) | 30 | **0.33** |

Resolution (`services/pricing.js`):

- **India (INR)** → the exact rupee figure, no round-trip.
- **United States** → the USD figure (the **default** currency).
- **Anywhere else** → the USD figure converted live to the local currency
  (`services/fx.js`: keyless `open.er-api.com`, cached 12 h, dated snapshot
  fallback flagged by `FxNote`). One conversion each way, so errors never
  compound.

**Logistics** (`data/logistics.js`) is charged once per order by mode and shown
explicitly at every step (“Retail delivery” / “Wholesale delivery”). Express adds
`EXPRESS_MULTIPLIER` (1.6×) of the base.

---

## Retail & Wholesale — one product, both a direct purchase

Every product supports both. The product page has a **Retail / Wholesale switch**
that changes the unit price, the minimum quantity, the logistics rate, the cart
line and the order type. **Wholesale is not an enquiry** — the customer enters
any quantity at or above the MOQ (12 for apparel, 6–8 for shoes/bags) and checks
out directly at the wholesale price. `/wholesale/enquiry` remains only for
opening a **trade account** (custom pricing, payment terms, standing orders).
The cart can mix modes; the order is typed wholesale if any line is.

---

## Country detection

`RegionModal` greets a first-time visitor with India / Nigeria / Other and an
optional **“Detect my region”** (IP, keyless) — it never forces the browser
location prompt, and `services/region.js` also exposes a permission-gated
`geolocateCountry()` for an explicit “allow precise location”. Detection only
suggests; the `CountryPicker` in the header, footer and checkout always wins and
persists.

---

## Inventory

Tracked at **product → colour → size → quantity**. Customers only ever see
**In stock / Low stock / Out of stock** (`services/inventory.js`, thresholds per
product). Availability is derived from quantity; Out of Stock disables Add to
Bag; restocking returns the product automatically.

- **Confirmed orders** decrement stock (`orders.js` → `inventory.applyOrder`,
  which refuses to oversell — a single commit checks every line first).
- **Valid cancellations** restore it (`cancelOrder` → `restoreOrder`), from the
  account Orders page.
- **Abandoned carts never touch stock.**

### Python inventory tool — `inventory/`

Standalone CLI, stdlib only, kept separate from the frontend. Same JSON shape as
the browser store.

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

Full reference in `inventory/README.md`.

### Admin view — `/admin`

A demo-gated (`azraa-admin`) architecture placeholder: read/edit the inventory
store, see stock states and the movement history. Production replaces the
passphrase with server auth.

---

## Categories

Live: **Men · Shoes · Bags · Ladies**. **Food is architecturally present but
`active: false`** (`data/categories.js`) — hidden from nav, shop, search and
direct URLs, ready to re-enable.

---

## Payments

Modular registry (`services/payments/`), enabled per country:

| Country | Currency | Providers |
|--------|----------|-----------|
| India | ₹ INR | Razorpay, PayPal |
| Nigeria | ₦ NGN | Paystack, Flutterwave, PayPal |
| GH / KE / ZA | local | Flutterwave, PayPal |
| Elsewhere | USD | PayPal |

Only publishable keys on the client (`import.meta.env`); with none set a provider
runs in `mock` mode so checkout is testable end to end. Each file documents the
backend calls that replace the mock. Final amounts are (must be) validated
server-side in the charge currency before payment.

---

## Structure

```
src/
  config/       site.js — public contact channels (WhatsApp number + wa.me link)
  i18n/         assistant.js — assistant languages + string table (6 languages)
  data/         countries · categories · products · colors · logistics · faqs (per-language answers)
  services/     catalog · auth · orders · wholesale · pricing · fx · region
                inventory · assistant · payments/{index,razorpay,paystack,flutterwave,paypal}
  context/      ThemeContext · RegionContext · AuthContext · CartContext · AssistantContext
  components/
    chrome/     Header · MobileMenu · SearchOverlay · CountryPicker · ThemeToggle
                RegionModal · CartDrawer · Footer · FxNote · WhatsAppFab · AzraaBot · Logo
    home/       HomeHero (full uncropped photo + copy) · HomeSections
    commerce/   ProductCard
    ui/         Button · Price · ProductImage · Field · Reveal · Seo
  pages/        Home · Shop · Product · Cart · Checkout · OrderConfirmation
                Wholesale · WholesaleEnquiry · About · Contact · Legal · NotFound
                auth/{SignIn,SignUp,Reset} · account/AccountPage · admin/AdminPage
  styles/       global.css (tokens) · site.css · extras.css
inventory/      Python CLI + JSON store
scripts/        process-logo.py · process-hero.py
```

## Still needs real data

Product photography, final wholesale prices for the TBD items, company
registration / addresses / support contacts, legal copy, and live payment
credentials. All are marked *coming soon* / *to follow* in place.
