"""Prepare catalogue photography from assets/products/*.png.

Each file is <slug>-front.png or <slug>-back.png (see front-views in the
original delivery — renamed/organised, not reprocessed, by this pipeline's
prior pass). All source frames are opaque 1086x1448 (one outlier flattened
the same way), so these convert straight to quality JPEGs — no transparency
to preserve, and no upscale needed (they're already print-web resolution).

EXCLUDED: eight of the delivered designs reproduce real third-party IP —
an exact corporate logo, a licensed franchise wordmark with an explicit (tm),
a movie poster with the actual actors' likenesses, a real band's tour merch,
a real retailer's neck tag, and two that closely mimic a specific artist's/
brand's signature motif. Those stay in assets/products/ only and are never
copied into public/ — see the EXCLUDED set below. Do not remove products
from it without reconfirming the image is actually clear of third-party IP.

Output: public/products/<slug>-front.jpg / -back.jpg

Run: python scripts/process-products.py
"""
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "products"
OUT = ROOT / "public" / "products"
OUT.mkdir(parents=True, exist_ok=True)

MAX_W = 1200
QUALITY = 84

EXCLUDED = {
    "american-gangster-layered-sleeve-tee",  # movie poster, real actors' likenesses
    "black-graphic-hoodie",                  # real band (Shakaponk) tour merch
    "black-hoodie",                          # same Shakaponk tour merch, different colourway
    "green-slytherin-varsity-sweatshirt",    # Harry Potter / Warner Bros (tm)
    "marbled-x-face-graphic-hoodie",         # mimics a specific artist's signature motif
    "mineral-wash-off-record-t-shirt",       # explicit "REVOLUTION (tm)" wordmark on the back
    "minimalist-ivory-hoodie",               # mimics a specific luxury brand's motif
    "red-autozone-polo",                     # AutoZone corporate logo
    "speckled-cream-polo",                   # real retailer (Peacocks) neck tag
    "the-pumpkin-king-black-colour",         # licensed character art + title
}

written = skipped = 0
for f in sorted(SRC.glob("*.png")):
    slug = f.stem.rsplit("-", 1)[0]  # strip -front/-back
    if slug in EXCLUDED:
        skipped += 1
        continue
    img = Image.open(f).convert("RGB")
    if img.width > MAX_W:
        h = round(img.height * MAX_W / img.width)
        img = img.resize((MAX_W, h), Image.LANCZOS)
    out_path = OUT / f"{f.stem}.jpg"
    img.save(out_path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    written += 1

print(f"wrote {written} files to {OUT.relative_to(ROOT)}, skipped {skipped} excluded source files")
