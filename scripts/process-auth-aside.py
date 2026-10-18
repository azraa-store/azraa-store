"""Prepare the auth pages' aside photo from assets/auth-aside.png.

Shown full-bleed on the right half of /sign-in, /sign-up and /reset
(AuthLayout.jsx), cropped with object-fit: cover — so unlike the hero this
never needs to render uncropped. Source is already a reasonable resolution
(no 4K upscale needed); this just strips it down to a compressed web JPG.

Output: public/textures/auth-aside.jpg
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "auth-aside.png"
OUT = ROOT / "public" / "textures" / "auth-aside.jpg"

im = Image.open(SRC).convert("RGB")
OUT.parent.mkdir(parents=True, exist_ok=True)
im.save(OUT, "JPEG", quality=88, optimize=True)
print(f"{SRC.name} {im.size} -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
