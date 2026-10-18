"""Derive the auth pages' left-panel leaf-shadow texture.

Not a new photoshoot, this crops the existing boutique wall/plant area
already present in the top-left of public/textures/hero-range.jpg (the
homepage hero), reusing real photographed shadow instead of a drawn/vector
approximation, so it stays consistent with the brand's actual photography.

The crop is multiplied against the light-theme --bg cream here, at build
time, rather than left to a CSS background-blend-mode: multiply at
runtime, so the CSS side only ever needs a plain background-image fade
(no mask-image / blend-mode) to avoid a GPU-compositing flash some
browsers show on masked background-images while they decode.

Output: public/textures/auth-panel-shadow.jpg
"""
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "textures" / "hero-range.jpg"
OUT = ROOT / "public" / "textures" / "auth-panel-shadow.jpg"

# Wall + blurred-foliage strip only, stops short of the product rail/table.
BOX = (0, 0, 620, 2148)
BG = (247, 242, 231)  # --bg in global.css

im = Image.open(SRC).convert("RGB")
crop = im.crop(BOX)
bg_layer = Image.new("RGB", crop.size, BG)
blended = ImageChops.multiply(crop, bg_layer)
blended.save(OUT, "JPEG", quality=85, optimize=True)
print(f"{SRC.name}{BOX} -> {OUT.relative_to(ROOT)} {blended.size} ({OUT.stat().st_size // 1024} KB)")
