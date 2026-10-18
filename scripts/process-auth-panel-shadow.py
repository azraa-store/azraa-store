"""Derive the auth pages' left-panel leaf-shadow texture.

Not a new photoshoot — this crops the existing boutique wall/plant area
already present in the top-left of public/textures/hero-range.jpg (the
homepage hero), reusing real photographed shadow instead of a drawn/vector
approximation, so it stays consistent with the brand's actual photography.

Output: public/textures/auth-panel-shadow.jpg
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "textures" / "hero-range.jpg"
OUT = ROOT / "public" / "textures" / "auth-panel-shadow.jpg"

# Wall + blurred-foliage strip only — stops short of the product rail/table.
BOX = (0, 0, 620, 2148)

im = Image.open(SRC).convert("RGB")
crop = im.crop(BOX)
crop.save(OUT, "JPEG", quality=85, optimize=True)
print(f"{SRC.name}{BOX} -> {OUT.relative_to(ROOT)} {crop.size} ({OUT.stat().st_size // 1024} KB)")
