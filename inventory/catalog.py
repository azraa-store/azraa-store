"""Catalogue mirror for the inventory tool.

Kept in sync with src/data/products.js (product id, colours, sizes). If the
storefront catalogue changes, update this dict and run `python manage.py seed`.
"""

# id -> { "name":..., "category":..., "low": <low-stock threshold>,
#         "colors": [...], "sizes": [...]  ("sizes": [None] means one size }
CATALOG = {
    "azr-tee-round": {
        "name": "Round Neck T-Shirt", "category": "men", "low": 12,
        "colors": ["White", "Black", "Grey", "Green", "Blue"],
        "sizes": ["S", "M", "L", "XL", "XXL"],
    },
    "azr-tee-collar": {
        "name": "Collar Neck T-Shirt", "category": "men", "low": 12,
        "colors": ["White", "Black", "Grey"],
        "sizes": ["S", "M", "L", "XL", "XXL"],
    },
    "azr-singlet-gym": {
        "name": "Gym Singlet", "category": "men", "low": 12,
        "colors": ["White", "Black", "Grey", "Red"],
        "sizes": ["S", "M", "L", "XL"],
    },
    "azr-singlet-standard": {
        "name": "Standard Singlet", "category": "men", "low": 12,
        "colors": ["White", "Black"],
        "sizes": ["S", "M", "L", "XL"],
    },
    "azr-shoe-leather": {
        "name": "Leather Shoes", "category": "shoes", "low": 6,
        "colors": ["Black", "Grey"],
        "sizes": ["UK6", "UK7", "UK8", "UK9", "UK10", "UK11"],
    },
    "azr-shoe-canvas": {
        "name": "Leather Canvas", "category": "shoes", "low": 6,
        "colors": ["White", "Black", "Grey"],
        "sizes": ["UK6", "UK7", "UK8", "UK9", "UK10", "UK11"],
    },
    "azr-sandal-standard": {
        "name": "Sandals", "category": "shoes", "low": 8,
        "colors": ["Black", "Grey"],
        "sizes": ["EU39", "EU40", "EU41", "EU42", "EU43", "EU44"],
    },
    "azr-sandal-leather": {
        "name": "Leather Sandals", "category": "shoes", "low": 8,
        "colors": ["Black"],
        "sizes": ["EU39", "EU40", "EU41", "EU42", "EU43", "EU44"],
    },
    "azr-bag-sling": {
        "name": "Sling Bags", "category": "bags", "low": 10,
        "colors": ["Black", "Grey"],
        "sizes": [None],
    },
    "azr-bag-ladies-leather": {
        "name": "Leather Bags", "category": "ladies", "low": 6,
        "colors": ["Black", "Red"],
        "sizes": [None],
    },
}


def variant_key(color, size):
    return f"{color or '-'}|{size or '-'}"


def all_variants(product_id):
    p = CATALOG[product_id]
    for c in p["colors"] or [None]:
        for s in p["sizes"] or [None]:
            yield (c, s, variant_key(c, s))


def _norm(s):
    return "".join(ch for ch in s.lower() if ch.isalnum())


def resolve(product_id):
    """Accept an id, slug, name, or an unambiguous fragment (case/punctuation-insensitive)."""
    if product_id in CATALOG:
        return product_id
    q = _norm(product_id)
    for pid, p in CATALOG.items():
        if _norm(pid) == q or _norm(p["name"]) == q:
            return pid
    matches = [pid for pid, p in CATALOG.items()
               if q in _norm(pid) or q in _norm(p["name"])]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        names = ", ".join(f"{pid} ({CATALOG[pid]['name']})" for pid in matches)
        raise SystemExit(f"Ambiguous product '{product_id}': {names}")
    raise SystemExit(f"Unknown product '{product_id}'")
