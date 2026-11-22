# AZRAA Lifestyle Photography — Generation Kit

Five AI-generated lifestyle images to address the review's point 3
("more lifestyle and model photography... help customers appreciate fit,
styling and overall appeal"). The site already has code wired up to show
these the moment the files exist — until then, each spot shows a quiet
"Lifestyle photography — coming soon" placeholder instead of a broken
image or a generic stock photo, so nothing looks unfinished in the
meantime (`src/components/ui/EditorialImage.jsx`).

## Grounded in the real catalogue, not generic fashion imagery

Each prompt below only describes garments/products AZRAA actually sells,
pulled directly from `src/data/categories.js`:

- **Men** — tees, singlets, hoodies & sweatshirts, joggers & sweatpants,
  polos, shirts & denim. Casual, everyday cotton basics — not suits, not
  formalwear.
- **Shoes** — leather shoes and sandals only.
- **Bags** — leather and canvas crossbody/sling bags only (no backpacks,
  totes, etc. — AZRAA doesn't carry those shapes yet).
- **Ladies** — leather bags and accessories only. This category is **not**
  women's clothing on AZRAA today (check `categories.js`: `subcategories:
  ['Bags']`) — the prompt below reflects that honestly rather than
  showing a woman in a dress or outfit AZRAA doesn't actually sell.

## Where each file goes

Exact paths the code already expects — drop a generated image at each path
(any reasonable image size; the code sets the aspect ratio via CSS, not
the file itself) and it renders automatically, no further code changes
needed:

| Image | Target path | Used on | Aspect ratio |
|---|---|---|---|
| About page banner | `public/lifestyle/about-banner.jpg` | `/about` | 21:9 (wide) |
| Men category banner | `public/lifestyle/category-men.jpg` | `/shop/men` | 21:7 (very wide) |
| Shoes category banner | `public/lifestyle/category-shoes.jpg` | `/shop/shoes` | 21:7 (very wide) |
| Bags category banner | `public/lifestyle/category-bags.jpg` | `/shop/bags` | 21:7 (very wide) |
| Ladies category banner | `public/lifestyle/category-ladies.jpg` | `/shop/ladies` | 21:7 (very wide) |

(`public/lifestyle/` doesn't exist yet in the repo — create it when you
drop the first file in.)

## A note on realism, given why this review came up

You raised that AZRAA currently "looks a lot like an AI website" and
pointed to aiit.network as the standard to match. The prompts below are
written to avoid the most common tells of AI-generated fashion imagery —
plastic-looking skin, over-symmetrical faces, warped hands, glossy
over-lit studio sheen — by asking for natural imperfection, candid
framing, and real-world settings rather than a posed white-backdrop
studio shot. Generate 3–4 variations per prompt and pick the one with the
fewest of those tells (check hands and ears closely, they're the most
common giveaway) rather than the first result.

## Prompts

### 1. About page banner (`about-banner.jpg`)

```
A candid, photorealistic lifestyle photograph: a small, diverse group of
three friends (mixed genders and ethnicities) in their twenties, walking
together outdoors in a sunlit urban street with warm afternoon light,
laughing mid-conversation. They're wearing casual, well-fitted everyday
basics — plain crew-neck t-shirts, a hoodie, straight-leg joggers, in a
muted palette of black, charcoal, olive and off-white. Natural candid
body language, mid-stride, not posed and facing camera. Shot on what
looks like a 35mm lens, shallow depth of field, soft natural light,
genuine skin texture and natural hand positions, no visible logos or
text on the clothing. Wide 21:9 cinematic aspect ratio. The mood is warm,
confident, everyday — not a glossy studio ad.
```

### 2. Men category banner (`category-men.jpg`)

```
A candid, photorealistic lifestyle photograph of a young man in his
twenties, outdoors in natural daylight, wearing a plain black crew-neck
t-shirt and relaxed-fit joggers in a neutral tone, mid-motion (adjusting
his sleeve or walking), natural unposed body language. Genuine skin
texture, natural hand and finger detail, no visible logos or graphics on
the clothing, no text anywhere in the frame. Soft natural light, shallow
depth of field, a real outdoor or urban setting (not a white studio
backdrop). Very wide 21:7 banner aspect ratio, subject positioned to one
side with open negative space on the other for text overlay. Warm,
everyday, confident mood.
```

### 3. Shoes category banner (`category-shoes.jpg`)

```
A candid, photorealistic lifestyle photograph focused on a person's feet
and lower legs, walking on an outdoor stone or pavement surface in warm
natural light, wearing well-made leather shoes (or leather sandals) in a
rich brown or black tone, casual trousers rolled slightly at the ankle.
Natural mid-stride motion, genuine texture on the leather (visible grain,
natural light creasing, not glossy/plastic), real shadow and daylight.
No visible brand logos. Very wide 21:7 banner aspect ratio, shoes
positioned to one side with open negative space on the other for text
overlay.
```

### 4. Bags category banner (`category-bags.jpg`)

```
A candid, photorealistic lifestyle photograph of a young adult walking
outdoors in natural daylight, carrying a leather or canvas cross-body
sling bag across their body, caught mid-stride, natural unposed body
language, genuine hand and finger detail resting on the bag strap. Warm
natural light, soft shadow, real urban or outdoor setting, no visible
logos or text. Very wide 21:7 banner aspect ratio, subject positioned to
one side with open negative space on the other for text overlay.
```

### 5. Ladies category banner (`category-ladies.jpg`)

```
A candid, photorealistic lifestyle photograph of a young woman in her
twenties or thirties, outdoors in warm natural daylight, carrying a
leather handbag or shoulder bag, caught mid-stride or adjusting the bag
on her shoulder, natural unposed body language, genuine hand and finger
detail, natural skin texture. Smart-casual everyday clothing (not
AZRAA-specific — AZRAA's "Ladies" category is leather bags and
accessories only, so the clothing in this shot is incidental, not the
product). Warm natural light, soft shadow, real outdoor or urban
setting, no visible logos or text anywhere. Very wide 21:7 banner aspect
ratio, subject positioned to one side with open negative space on the
other for text overlay.
```

## After generating

1. Create `public/lifestyle/` in the repo if it doesn't exist.
2. Save each generated image at the exact filename in the table above.
3. `npm run build` (or just look at the dev server) — no code changes
   needed, the placeholder disappears and the real photo shows the
   moment the file exists at that path.
