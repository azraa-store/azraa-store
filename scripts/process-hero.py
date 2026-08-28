"""Prepare the hero backdrop from assets/hero.png.

assets/hero.png is a clean editorial product composition — a garment rail of
crew tees and collared shirts, a folded tee, bags, shoes and sneakers on a warm
concrete wall + floor. No text, no header.

The delivered file is only 1681x935 (well under 4K), so on a retina hero it looks
soft. Here we upscale it to a genuine 4K width with Lanczos resampling, restore
crispness with a gentle unsharp mask (no ringing), and keep it perfectly clean —
no synthetic grain. The result serves both the light/dark still hero <img> and
the displaced-photo plane in the 3D scene.

Output: public/textures/hero-range.jpg   (3840x2138, quality 94, 4:4:4)

Run: python scripts/process-hero.py
"""
import cv2
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "hero.png"
OUT = ROOT / "public" / "textures" / "hero-range.jpg"
OLD = ROOT / "public" / "textures" / "hero-range.png"

TARGET_W = 3840  # 4K UHD width

img = cv2.imread(str(SRC), cv2.IMREAD_COLOR)
h, w = img.shape[:2]
is4k = w >= 3840 and h >= 2160
print(f"source {w}x{h}  —  {'already 4K' if is4k else 'below 4K, upscaling'}")

# 1. kill any latent sensor noise before it gets magnified — edge-preserving,
#    very light so real texture (weave, grain of leather) survives.
img = cv2.bilateralFilter(img, d=5, sigmaColor=18, sigmaSpace=5)

# 2. upscale to 4K. Two steps (cubic -> lanczos) resample more cleanly than one
#    big jump and avoid the stair-stepping a single lanczos pass can leave.
scale = TARGET_W / w
mid_w = int(round(w * (1 + (scale - 1) * 0.55)))
mid_h = int(round(h * mid_w / w))
img = cv2.resize(img, (mid_w, mid_h), interpolation=cv2.INTER_CUBIC)
tw, th = TARGET_W, int(round(h * TARGET_W / w))
img = cv2.resize(img, (tw, th), interpolation=cv2.INTER_LANCZOS4)

# 3. gentle unsharp mask — enough to counter the upscale softening, low enough
#    that edges never halo and flat concrete never buzzes.
blur = cv2.GaussianBlur(img, (0, 0), sigmaX=2.4)
img = cv2.addWeighted(img.astype(np.float32), 1.32, blur.astype(np.float32), -0.32, 0)

# 4. a whisper of contrast so it sits with the rest of the site (theme grading
#    still happens in CSS via --hero-img-filter). No colour shift, no grain.
img = 127.5 + (img - 127.5) * 1.025
img = np.clip(img, 0, 255).astype(np.uint8)

cv2.imwrite(
    str(OUT),
    img,
    [
        cv2.IMWRITE_JPEG_QUALITY, 94,
        cv2.IMWRITE_JPEG_SAMPLING_FACTOR, cv2.IMWRITE_JPEG_SAMPLING_FACTOR_444,
        cv2.IMWRITE_JPEG_OPTIMIZE, 1,
    ],
)
if OLD.exists():
    OLD.unlink()

kb = OUT.stat().st_size / 1024
print(f"wrote {OUT.name}  {tw}x{th}  ({tw / th:.2f}:1)  {kb:.0f} KB")
