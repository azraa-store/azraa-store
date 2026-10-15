"""Derive UI-ready logo assets from the official Azraa mark.

Input:  assets/company-logo.png  (red + black emblem + AZRAA wordmark on white)
Output: public/brand/logo-color.png   original colours, white -> transparent (light UI)
        public/brand/logo-mono.png    warm off-white rendering (dark UI)
        public/brand/logo-original.png trimmed original on white (documents)

Run:    python scripts/process-logo.py
"""
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "company-logo.png"
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)

INK = (240, 237, 230)  # dark-UI ink

img = Image.open(SRC).convert("RGBA")
px = img.load()
w, h = img.size

# 1. bounding box of non-near-white pixels
minx, miny, maxx, maxy = w, h, 0, 0
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a > 8 and min(r, g, b) < 236:
            minx = min(minx, x); miny = min(miny, y)
            maxx = max(maxx, x); maxy = max(maxy, y)
pad = 10
box = (max(0, minx - pad), max(0, miny - pad), min(w, maxx + pad), min(h, maxy + pad))

trimmed = img.crop(box)
trimmed.save(OUT / "logo-original.png")

tw, th = trimmed.size
tp = trimmed.load()

# the wordmark ("AZRAA") sits below the figure/tuxedo emblem — row profiling
# shows the ink coverage trough (figure tapering out) then ramping back up
# (the much wider letterforms starting) right around this row.
WORDMARK_Y = 494

# 2. colour version: keep RGB (emblem keeps its red), knock white out to
#    transparent (min-channel alpha). The wordmark itself is forced to solid
#    black so the lettering reads as one consistent colour instead of
#    alternating black/red letter-to-letter.
color = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
cp = color.load()
for y in range(th):
    for x in range(tw):
        r, g, b, a = tp[x, y]
        ink = 255 - min(r, g, b)                # 0 white .. 255 solid
        alpha = int(a / 255 * min(255, int(ink * 1.3)))
        if y >= WORDMARK_Y:
            cp[x, y] = (0, 0, 0, alpha)
        else:
            cp[x, y] = (r, g, b, alpha)
color.save(OUT / "logo-color.png")

# 3. dark-theme rendering: the black ink (tuxedo + wordmark) flips to a warm
#    off-white so it reads against a near-black page, but the figure's red
#    stays red — it should never go fully white/monochrome on a dark bg.
mono = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
mp = mono.load()
for y in range(th):
    for x in range(tw):
        r, g, b, a = tp[x, y]
        ink = 255 - min(r, g, b)
        if ink < 10:
            mp[x, y] = (0, 0, 0, 0)
            continue
        boosted = min(255, int(24 + ink * 1.9))
        alpha = int(a / 255 * boosted)
        is_red = y < WORDMARK_Y and (r - g > 30) and (r - b > 30)
        if is_red:
            rr = min(255, int(r * 1.1 + 20))
            gg = int(g * 0.9)
            bb = int(b * 0.9)
            mp[x, y] = (rr, gg, bb, alpha)
        else:
            mp[x, y] = (INK[0], INK[1], INK[2], alpha)
mono.save(OUT / "logo-mono.png")

# 4. favicons — the mark centred on the warm site background, square
BG = (250, 248, 243, 255)
side = max(tw, th)
sq = Image.new("RGBA", (side, side), BG)
sq.alpha_composite(color, ((side - tw) // 2, (side - th) // 2))
PUB = ROOT / "public"
for name, size in (("favicon-32.png", 32), ("favicon-180.png", 180), ("favicon-512.png", 512)):
    sq.resize((size, size), Image.LANCZOS).convert("RGB").save(PUB / name)

for f in ("logo-color.png", "logo-mono.png", "logo-original.png"):
    im = Image.open(OUT / f)
    print("wrote", f, im.size, f"({im.size[0] / im.size[1]:.2f}:1)")
print("wrote favicon-32/180/512.png")
