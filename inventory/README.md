# AZRAA — inventory management

A standalone Python CLI for stock. No dependencies (Python 3.8+ stdlib only).
Kept **separate from the frontend**; it reads/writes JSON files that mirror the
shape the web app uses.

```
inventory/
  manage.py     the CLI
  catalog.py    product / colour / size definitions (mirror of src/data/products.js)
  store.py      JSON store + history log + file lock
  stock.json    quantities            { productId: { "Colour|Size": qty } }   (created on first run)
  history.json  every movement, newest first
  flags.json    admin availability overrides
```

## Quick start

```bash
cd inventory
python manage.py seed              # initialise every variant at qty 40
python manage.py view              # full stock table with In / Low / Out
python manage.py view "Round Neck" # one product
```

## Everyday operations

```bash
# set an exact quantity
python manage.py set "Round Neck T-Shirt" White M 120

# add / remove stock
python manage.py add  round-neck-t-shirt Black L 50
python manage.py remove sandals Black EU42 3

# signed adjustment
python manage.py adjust gym-singlet Red S -4

# one-size products: use "-" for colour and/or size
python manage.py set sling-bags Black - 25

# a confirmed sale (decrement) / a valid cancellation (restore)
python manage.py order   round-neck-t-shirt White M 5 --ref AZ10001
python manage.py restore round-neck-t-shirt White M 5 --ref AZ10001

# hide a product from sale regardless of stock, then restore it
python manage.py unavailable leather-bags
python manage.py available   leather-bags

# audit trail
python manage.py history --limit 50
python manage.py export > snapshot.json
```

## How availability is derived

Per variant, against the product's low-stock threshold (`catalog.py` → `low`):

| quantity | state |
|---|---|
| `0` | **Out of Stock** |
| `1 … low` | **Low Stock** |
| `> low` | **In Stock** |

`order` refuses to take a variant negative, so a single run cannot oversell.
The store takes an exclusive lock for every mutation, so two concurrent runs are
safe. A production deployment replaces this with a database transaction.

## Connecting to the web app

The web app currently keeps its own copy in the browser (`localStorage`
`azraa.inventory`) so the storefront is demoable offline. To make this CLI the
source of truth, point both at one backend: expose `stock.json` / the same
operations behind an API and have `src/services/inventory.js` call it instead of
`localStorage`. The JSON shape is already identical, so `manage.py export` can be
served as-is.
