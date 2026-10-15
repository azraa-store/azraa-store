# AZRAA — visual direction & interaction architecture

## The reference

A charcoal, boxed, high-shouldered tee photographed as a **flat-lay on raw
concrete**, from a high angle, raked by a single soft key from the left. Matte
cotton jersey, ribbed crew collar, dropped short sleeves, a faint tonal neck
label. Palette: charcoal blacks, warm concrete greys.

That flat-lay-on-concrete language is the spine of the whole experience.

## Concept — "The garment, laid bare."

The tee rests on a concrete floor. The camera is a **single continuous take**: it
starts high overhead — distant, exposed — then descends into the cloth for a
raking macro skim, arcs across the shoulder line, lifts and pulls back for the
brand, and finally settles into a quiet elevated 3/4 where the product
information resolves. No cuts.

### Why flat-lay 3D, not an orbited mannequin

- It is faithful to the reference, which *is* a flat-lay.
- It reads as fashion editorial, not product configurator.
- A luminance-displaced plane carrying the actual photograph preserves every
  characteristic literally — silhouette, collar, seams, folds, colour. A
  runtime normal map gives the folds real relief and self-shadow at grazing
  angles.

The trade: you cannot truly orbit to a profile of the collar. Scene 04 is a low
raking arc across the shoulders instead of a side elevation — deliberate.

## The six beats

| # | Beat | Camera | Copy | Intent |
|---|------|--------|------|--------|
| 01 | Intro | High overhead, distant, near-still | `AZRAA`, hairline sub | Exposure, scale, quiet |
| 02 | Approach | Lower, closer; tee holds the frame | "One piece, held to the light" | Nothing added |
| 03 | Material | Down at fabric level, grazing macro, shallow focus | "320 grams to the metre" | The cloth |
| 04 | Form | Rise and arc across the shoulder line | "Square shoulder, tubular body" | The cut |
| 05 | Identity | Lift and pull back, centered | "AZRAA — the house" | The maker |
| 06 | Product | Calm elevated 3/4; tee left, interface right | name / price / size / cart | Buy the piece |

## Motion rules

- One normalized `progress` (0→1) from Lenis smooth-scroll drives everything.
- Camera keyframes are **eased per-segment** then **critically damped** per
  frame — fast flicks still feel like a slow dolly.
- A whisper of idle drift + pointer parallax so held shots never freeze.
- GSAP only reveals DOM typography (the intro letter rise); it never touches the
  camera.
- The garment's whole-body yaw shifts by only ~0.1–0.15 rad across the entire
  scroll. No spinning, no bouncing.
- Light intensity and colour temperature, fog range, focus distance, bloom,
  vignette and grain all interpolate along the same timeline, so the environment
  "evolves" rather than switching.

## Visual system

- **Ground** `#0b0b0c`. **Ink** bone `#e9e5dd`. Concrete warm grey. No accent
  colour — monochrome with warm/cool light doing the temperature work.
- **Type**: Cormorant Garamond (light, editorial display, lining numerals) +
  Inter (wide-tracked grotesque caps for labels). Generous negative space.
- **Grade**: ACES tone mapping, restrained bloom, shallow DOF that tracks the
  look target, film grain, heavy vignette.
- **No**: cards, gradients, glassmorphism, neon, SaaS layout, rotating-product
  clichés, UI clutter.

## Responsive & fallback

- **Desktop** — full cinematic 3D.
- **Tablet / narrow / weak** — `lite` tier: lower DPR, lighter geometry, no DOF;
  camera framing already portrait-friendly (the tee is shot from above, so it
  fills a tall frame without changes).
- **Reduced motion / no WebGL / save-data / low-power** — a still editorial page
  built from the photograph, same narrative, same commerce, nothing moving on
  its own.

---

## Update — two art directions (light default, dark cinematic)

The single dark cinematic direction above is now **the dark theme**. It is
unchanged: the R3F film, the scroll-driven camera, the atmosphere, the grade.

**Light is the default.** It is not the dark site with a white background — it
is a deliberate second direction:

- warm-white ground (`#faf8f3`), near-black warm ink, restrained neutral
  surfaces and hairline borders;
- the same Cormorant + Inter type, the same spacing, the same editorial
  restraint;
- the hero is a still, high-key treatment of the reference photograph with a
  whisper of parallax — no 3D, so the heavy bundle never loads;
- the official logo shows in its original red/black.

The toggle (header, right cluster) is the invitation to the cinematic version.
Both themes carry the full commerce system — the interface gets progressively
calmer and more functional from hero → discovery → product → checkout, in either
direction.

---

## Update — hero expanded to the full range

The hero was a single tee (dark: a luminance-displaced flat-lay; light: that
photo, high-key). It is now the **whole collection** — the `hero-range` reference
(crew tees, shirts, bags, derby shoes, sneakers on warm concrete),
`scripts/process-hero.py` prepped. _(Later: see the 4K + both-themes update below.)_

Nothing else about the hero changed — same wordmark, tagline, CTAs, nav, wash,
particles, fog, grade, scroll hand-off:

- **Dark (3D):** the displaced photographic plane is re-oriented from a floor
  flat-lay to a **standing lit product wall** (`three/Garment.jsx`), and
  `lib/timeline.js` re-frames the same slow damped move as a gallery glide —
  establish the collection, drift to the tees, graze the cloth, sweep right
  across the shirts and footwear, pull back. Lighting rakes from upper-left;
  dust now fills the volume between camera and wall.
- **Light (still):** same warm-white wash + parallax, now over the range, with a
  soft centre bloom so the wordmark holds over the busier composition.

### Hero layout — text left, collection right

`update.png` set the target: the AZRAA block (eyebrow · wordmark · tagline ·
SHOP RETAIL / SHOP WHOLESALE) sits **left**, lined up with the header logo and
page content; the product composition fills the **right**. A left-hand scrim
(`--hero-scrim`) fades the products behind the copy so it always reads; a solid
`--hero-concrete` backfill means the image never shows a hard edge.

Both themes follow it: the light still-hero anchors the image at
`object-position: 58% 55%`; the dark 3D re-aims the camera (`lib/timeline.js`) so
the product wall settles right-of-centre in every resting beat. On phones the
block recentres and the scrim goes vertical.

### Update — final assets (logo + hero photograph)

The client delivered the finished pieces: `assets/company-logo.png` (the official
lockup — a red painterly figure in a hat, black tuxedo and halo, over the angular
AZRAA wordmark) and `assets/hero.png` (the real editorial product photograph).

- **Logo** replaces the earlier monogram everywhere via `process-logo.py`
  (`logo-color.png` light, `logo-mono.png` dark, plus the PNG favicon set). The
  mark carries its own wordmark, so the separate serif "AZRAA" beside it is gone;
  it renders at 52 px in the header, 92 px in the footer.
- **Hero photograph** is used **as delivered — not cropped**. `--hero-concrete`
  is matched to its wall (`#d4cdc1`) and the left scrim firmed so the copy holds.
  The plane (`three/Garment.jsx`) grows to `PLANE_H 9.0` for the 1.8:1 frame.
- **Navigation** text is Inter — the same face as the body — at regular weight
  and full `--ink` (not bold), with the resting opacity removed. The nav is
  centred in the bar: logo hard left, the search / account / country / theme /
  bag controls hard right (`.hdr__left` and `.hdr__right` each `flex: 1`).

### Update — 4K hero + the film runs in both themes

- **The delivered photo was sub-1080p** (1681×935). `process-hero.py` now
  upscales it to a genuine **4K** `hero-range.jpg` (3840×2136) with a bilateral
  denoise → two-step Lanczos → gentle unsharp, and **no synthetic grain** — clean
  on both grounds. `Garment.jsx` caps the GPU texture (2560 px full / 1600 lite).
- **The cinematic scroll film now runs in the light theme too**, not just dark.
  `HomeHero` drops the `isDark &&` gate; `isDark` threads
  `Experience → Scene → Lighting / Atmosphere / Ground / Garment / PostFX`. Dark
  is the moody low-key cut; light is a bright high-key studio — higher exposure
  (1.18), flooded warm ambient, thinner + warm-white fog, pale ground, a
  concrete-coloured edge dissolve, almost no vignette, zero grain. Reduced-motion
  and low-capability devices still get the still `<img>` hero.

### Update — hero is the full photograph, no animation

Client call: show the delivered photo **complete and uncropped**, nothing else
about the site changed.

- **The 3D scroll film is retired from the homepage.** `HomeHero.jsx` is now just
  the image + the AZRAA copy. The whole `src/three/` tree, `lib/timeline.js`,
  `hooks/useDeviceCapability.js` and the `@react-three/*` + `three` +
  `postprocessing` dependencies are deleted — the homepage JS drops from ~1.5 MB
  to ~0.46 MB. `gsap` + `lenis` stay (smooth scroll).
- **The image is laid in at its own aspect ratio** — `width: 100%; height: auto`,
  no `object-fit: cover`, no `transform: scale`, no parallax. Every garment, bag
  and shoe is in frame at all widths. On phones (`≤640`) the photo is full-width
  at the top and the copy stacks beneath it on `--bg`.
- **Blend layers eased right back** so the photograph reads at full quality:
  `--hero-scrim` is a shorter, lighter left gradient (clears by 56%, not 66%);
  `--hero-wash` is a whisper; dark `--hero-img-filter` lifted `0.5 → 0.58`.
- Uses the same clean 4K `hero-range.jpg` from the previous update.

### Update — bigger nav text, phone-responsive pass

- **Header nav** was `0.68rem` — bumped to `0.82rem` (tracking `0.12em`), the
  duplicate override rule removed, and the collapse-to-burger breakpoint moved
  `1240 → 1300px` so the larger text never crowds the bar.
- **Phones** (`site.css`, small `extras.css` addition):
  - product grids (`.grid--3/.grid--4`) hold **two columns** down to 340px
    (were single-column below 560); category cards (`.cats--4`) go two-up at
    ≤620px. Cards compact on ≤560 — name/price stack, the "Retail & wholesale"
    tag hides, plate flags shrink.
  - `--header-h` `4.75 → 4.25rem` on ≤600, with the logo (36px), icons and
    country pill tightened; section and page-hero top paddings pulled in on ≤560
    so there's far less dead space between the hero and the first section.
  - `html`/`body` set to `overflow-x: clip` (not `hidden`, so `position: sticky`
    still works) — kills a hairline horizontal scroll from the off-canvas cart
    drawer at ~320px. Verified: no horizontal scroll on any route, 320–1024px.
- Removed the stale PDP note that linked to the deleted "home film".

### Update — WhatsApp contact

`src/config/site.js` holds the public contact channels — `WHATSAPP` (`display`
"+91 90035 41640", `e164` "919003541640") and `whatsappLink()` for a
prefilled `wa.me` link. Surfaced three ways:

- **Floating button** (`components/chrome/WhatsAppFab.jsx`, in `RootLayout`) —
  fixed bottom-right on every page: a green `#25d366` "WhatsApp" pill on
  desktop, an icon-only circle on phones (`≤640px`). `.wa-fab` in `extras.css`.
- **Contact page** — a "WhatsApp" block at the top of the contact info list.
- **Footer** — a "WhatsApp · +91 90035 41640" link in the brand column.

The label is just "WhatsApp" (not "WhatsApp us") everywhere.

To change the number, edit `src/config/site.js` only.

### Update — AZRAA Bot (customer-service assistant)

A chat assistant in the bottom-right corner of every page, stacked below the
WhatsApp button (which steps aside while the chat is open via
`:root[data-bot-open]`).

**Pieces**
- `config/site.js` — unchanged number config, reused for the WhatsApp handoff.
- `data/faqs.js` — curated Q&A (wholesale, trade accounts, shipping, delivery
  cost, returns, payment, currency, sizing, stock, orders, accounts, company,
  categories, human handoff), kept in sync with the legal docs + logistics.
- `services/assistant.js` — the engine. `askAssistant({messages, context})` is
  the only call the UI makes. **Local mode (default):** an intent router over the
  live catalogue, region-aware pricing (`services/pricing.js`), inventory
  (`services/inventory.js`) and the FAQ set — product search, price/MOQ lookups,
  a per-product MOQ summary, stock, sizing, shipping/returns/payment, navigation.
  Returns a shaped reply — `{ content, chips, products, links, handoff }`.
  **Model mode:** if `VITE_ASSISTANT_ENDPOINT` is set, each turn is POSTed there
  and answered by a model server-side (e.g. `claude-opus-5`), returning the same
  shape. The model key + system prompt never touch the browser. If the endpoint
  errors, it silently falls back to the local engine.
- `context/AssistantContext.jsx` — open state, the message thread (persisted to
  `localStorage` `azraa.bot.thread`, trimmed to 40 turns), an unread badge, and
  the per-turn `context` object (country, currency, rates, cart count, path).
- `components/chrome/AzraaBot.jsx` — the UI: a circular `--ink` launcher with a
  one-time breathing ring, and a panel (a 24×38rem card bottom-right on desktop,
  a full-screen sheet ≤640px). Bot messages render text, mini product cards
  (Link to the PDP), navigation links (solid pill + `→`) and quick-reply chips
  (dashed pill = "ask this"). Theme-aware via tokens; `Esc` closes; reduced
  motion respected; body scroll locked only for the mobile sheet.
- `.env.example` documents `VITE_ASSISTANT_ENDPOINT` and the backend contract.

Wired in `App.jsx` (`AssistantProvider` inside `CartProvider`) and rendered from
`RootLayout.jsx`.

### Update — languages + name

- **The assistant introduces itself as “AZRAA”**, not “AZRAA Bot” (header, greeting
  and disclaimer). The component file stays `AzraaBot.jsx`.
- **First open shows a language gate** — English, हिन्दी, বাংলা, Kiswahili,
  Français, العربية. The choice is stored (`localStorage` `azraa.bot.lang`) and
  can be changed from a globe button in the header. Arabic sets the panel `dir`
  to `rtl` (a small `.bot-panel[dir='rtl']` block flips the tails, the card arrow
  and the link arrow).
- `i18n/assistant.js` — `LANGUAGES`, a key-major string table, `t(lang, key,
  vars)`, `routeLabel(lang, to)`, `langDir(code)`. **Non-English is a first pass —
  have a native speaker review it, especially the policy answers.**
- `data/faqs.js` — `answer` is now `{ en, hi, bn, sw, fr, ar }`; English is
  authoritative.
- The engine routes on **English keywords only**, so chip `send` values stay
  English (tapping a translated chip still routes) while every string a customer
  reads goes through `t()`. Non-English greetings lead with a WhatsApp handoff,
  since free-text matching in those languages mostly falls through to the
  localised fallback.
