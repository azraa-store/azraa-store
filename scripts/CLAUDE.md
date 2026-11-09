Asset pipeline scripts (OpenCV, run manually when source assets change):

```bash
python scripts/process-logo.py   # assets/company-logo.png -> public brand/* + favicons
python scripts/process-hero.py   # assets/hero.png -> public/textures/hero-range.jpg (4K upscale)
```
