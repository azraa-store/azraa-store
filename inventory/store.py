"""JSON-backed inventory store with a history log and a simple file lock.

Shapes match the browser mock (localStorage 'azraa.inventory'):
    stock.json    { "<productId>": { "<color>|<size>": qty, ... }, ... }
    history.json  [ { ts, productId, variantKey, delta, reason, ref, before, after }, ... ]
    flags.json    { "<productId>": {"unavailable": true} }   # admin hard-override

A real deployment would use a database with row-level locking. Here we take an
exclusive lock on a lockfile for the duration of each mutation so concurrent
`manage.py` runs cannot corrupt the files or oversell.
"""
import json
import os
import time
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

DIR = Path(__file__).resolve().parent
STOCK = DIR / "stock.json"
HISTORY = DIR / "history.json"
FLAGS = DIR / "flags.json"
LOCK = DIR / ".lock"


def _read(path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return default


def _write(path, data):
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, indent=2), encoding="utf-8")
    os.replace(tmp, path)  # atomic on same filesystem


@contextmanager
def lock(timeout=10.0):
    start = time.time()
    while True:
        try:
            fd = os.open(LOCK, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            os.close(fd)
            break
        except FileExistsError:
            if time.time() - start > timeout:
                raise SystemExit("Could not acquire inventory lock (another run in progress?)")
            time.sleep(0.05)
    try:
        yield
    finally:
        try:
            os.unlink(LOCK)
        except FileNotFoundError:
            pass


def load_stock():
    return _read(STOCK, {})


def load_history():
    return _read(HISTORY, [])


def load_flags():
    return _read(FLAGS, {})


def _now():
    return datetime.now(timezone.utc).isoformat()


def record(entries):
    hist = load_history()
    hist = entries + hist
    _write(HISTORY, hist[:2000])


def apply_delta(product_id, variant_key, delta, reason, ref=None, allow_negative=False):
    """Mutate one variant's quantity. Returns (before, after)."""
    with lock():
        stock = load_stock()
        stock.setdefault(product_id, {})
        before = int(stock[product_id].get(variant_key, 0))
        after = before + delta
        if after < 0 and not allow_negative:
            raise SystemExit(
                f"Refusing to go negative: {product_id} {variant_key} has {before}, delta {delta}"
            )
        stock[product_id][variant_key] = max(0, after) if not allow_negative else after
        _write(STOCK, stock)
        record([{
            "ts": _now(), "productId": product_id, "variantKey": variant_key,
            "delta": delta, "reason": reason, "ref": ref,
            "before": before, "after": stock[product_id][variant_key],
        }])
        return before, stock[product_id][variant_key]


def set_qty(product_id, variant_key, qty, reason, ref=None):
    with lock():
        stock = load_stock()
        stock.setdefault(product_id, {})
        before = int(stock[product_id].get(variant_key, 0))
        stock[product_id][variant_key] = max(0, int(qty))
        _write(STOCK, stock)
        record([{
            "ts": _now(), "productId": product_id, "variantKey": variant_key,
            "delta": stock[product_id][variant_key] - before, "reason": reason, "ref": ref,
            "before": before, "after": stock[product_id][variant_key],
        }])
        return before, stock[product_id][variant_key]


def set_flag(product_id, key, value):
    with lock():
        flags = load_flags()
        flags.setdefault(product_id, {})
        if value:
            flags[product_id][key] = True
        else:
            flags[product_id].pop(key, None)
            if not flags[product_id]:
                flags.pop(product_id, None)
        _write(FLAGS, flags)
