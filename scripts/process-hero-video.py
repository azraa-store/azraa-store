"""Prepare the hero intro clip from assets/hero-intro.mp4.

assets/hero-intro.mp4 plays once on page load, muted and autoplaying, then
the hero holds on the usual still photo (public/textures/hero-range.jpg) once
it ends. Three things happen to the source here:

1. The generator's sparkle watermark (static, bottom-right corner of the
   1280x720 frame) is painted over with `delogo`, sampling the surrounding
   travertine wall.
2. It's upscaled 1.5x with Lanczos + a mild unsharp pass — the hero section
   is almost always rendered far wider than the source's native 1280px, so
   the browser was upscaling (and softening) it on every page load; this
   gets a cleaner result than relying on the browser to do that stretch.
3. Re-encoded at a lower CRF (better quality, bigger file) than a first
   pass, with the unneeded audio track dropped (autoplay video must be
   muted anyway).

A poster frame (the clip's first frame) is also extracted so the hero has
something to paint before the video itself has loaded.

Output: public/textures/hero-intro.mp4          (video, no audio, faststart)
        public/textures/hero-intro-poster.jpg    (first frame)

Requires ffmpeg on PATH. Run: python scripts/process-hero-video.py
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "hero-intro.mp4"
OUT_DIR = ROOT / "public" / "textures"
OUT_VIDEO = OUT_DIR / "hero-intro.mp4"
OUT_POSTER = OUT_DIR / "hero-intro-poster.jpg"

OUT_DIR.mkdir(parents=True, exist_ok=True)

# watermark box, in source (1280x720) pixel coordinates
WATERMARK = dict(x=1110, y=560, w=90, h=85)

FILTERS = (
    f"delogo=x={WATERMARK['x']}:y={WATERMARK['y']}:w={WATERMARK['w']}:h={WATERMARK['h']}:show=0,"
    "scale=1600:-2:flags=lanczos,"
    "unsharp=5:5:0.5:5:5:0.25"
)

subprocess.run(
    [
        "ffmpeg", "-y", "-i", str(SRC),
        "-an",                         # no audio — the clip autoplays muted
        "-c:v", "libx264", "-crf", "23", "-preset", "slower",
        "-vf", FILTERS,
        "-movflags", "+faststart",
        str(OUT_VIDEO),
    ],
    check=True,
)

subprocess.run(
    [
        "ffmpeg", "-y", "-i", str(SRC),
        "-vf", FILTERS,
        "-vframes", "1", "-q:v", "3",
        str(OUT_POSTER),
    ],
    check=True,
)

for f in (OUT_VIDEO, OUT_POSTER):
    kb = f.stat().st_size / 1024
    print(f"wrote {f.relative_to(ROOT)}  ({kb:.0f} KB)")
