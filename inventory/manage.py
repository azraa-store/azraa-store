#!/usr/bin/env python3
"""AZRAA inventory management CLI.

    python manage.py seed [--qty 40]           # initialise every variant
    python manage.py view [product]            # show stock + In/Low/Out state
    python manage.py set   <product> <color> <size> <qty>
    python manage.py add   <product> <color> <size> <qty>
    python manage.py remove <product> <color> <size> <qty>
    python manage.py adjust <product> <color> <size> <delta>   # +/- signed
    python manage.py order  <product> <color> <size> <qty> [--ref AZ1001]   # decrement (a sale)
    python manage.py restore <product> <color> <size> <qty> [--ref AZ1001]  # increment (a cancellation)
    python manage.py unavailable <product>     # hide from sale regardless of stock
    python manage.py available   <product>     # clear the override
    python manage.py history [--limit 30]
    python manage.py export                    # print JSON matching the browser store

Use "-" for one-size products, e.g.  python manage.py set sling-bags Black - 25
Product may be an id, exact name, or an unambiguous fragment.
"""
import argparse
import json
import os
import sys

try:  # make the console UTF-8 friendly on Windows
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

from catalog import CATALOG, all_variants, resolve, variant_key
from store import (apply_delta, load_flags, load_stock, load_history,
                   set_flag, set_qty)

_COLOR = sys.stdout.isatty() and os.environ.get("NO_COLOR") is None
RESET = "\033[0m" if _COLOR else ""
DIM = "\033[2m" if _COLOR else ""
GREEN = "\033[32m" if _COLOR else ""
YELLOW = "\033[33m" if _COLOR else ""
RED = "\033[31m" if _COLOR else ""
ARROW = "->"


def state_for(qty, low):
    if qty <= 0:
        return "OUT", RED
    if qty <= low:
        return "LOW", YELLOW
    return "IN", GREEN


def norm(v):
    return None if v in ("-", "", None) else v


def cmd_seed(args):
    stock = load_stock()
    n = 0
    for pid, meta in CATALOG.items():
        stock.setdefault(pid, {})
        for _c, _s, vk in all_variants(pid):
            if vk not in stock[pid]:
                stock[pid][vk] = args.qty
                n += 1
    from store import _write, STOCK  # noqa
    _write(STOCK, stock)
    print(f"Seeded {n} new variant(s) at qty {args.qty}. "
          f"Existing quantities were left untouched.")


def cmd_view(args):
    stock = load_stock()
    flags = load_flags()
    pids = [resolve(args.product)] if args.product else list(CATALOG)
    for pid in pids:
        meta = CATALOG[pid]
        low = meta["low"]
        hidden = flags.get(pid, {}).get("unavailable")
        title = f"{meta['name']}  {DIM}({pid} | {meta['category']} | low<={low}){RESET}"
        if hidden:
            title += f"  {RED}[UNAVAILABLE]{RESET}"
        print("\n" + title)
        total = 0
        for c, s, vk in all_variants(pid):
            qty = int(stock.get(pid, {}).get(vk, 0))
            total += qty
            st, col = state_for(qty, low)
            print(f"  {(c or '-'):8} {(s or '-'):6} {qty:5d}   {col}{st}{RESET}")
        agg, aggcol = state_for(total, low * len(list(all_variants(pid))))
        print(f"  {DIM}total {total} -- product shows {aggcol}{agg}{RESET}")


def _variant_cmd(args, delta_sign, reason):
    pid = resolve(args.product)
    vk = variant_key(norm(args.color), norm(args.size))
    before, after = apply_delta(pid, vk, delta_sign * args.qty, reason, getattr(args, "ref", None))
    _report(pid, vk, before, after)


def cmd_set(args):
    pid = resolve(args.product)
    vk = variant_key(norm(args.color), norm(args.size))
    before, after = set_qty(pid, vk, args.qty, "admin-set")
    _report(pid, vk, before, after)


def cmd_adjust(args):
    pid = resolve(args.product)
    vk = variant_key(norm(args.color), norm(args.size))
    before, after = apply_delta(pid, vk, args.delta, "admin-adjust")
    _report(pid, vk, before, after)


def cmd_unavailable(args):
    set_flag(resolve(args.product), "unavailable", True)
    print(f"{resolve(args.product)} marked UNAVAILABLE (hidden from sale).")


def cmd_available(args):
    set_flag(resolve(args.product), "unavailable", False)
    print(f"{resolve(args.product)} restored to normal availability rules.")


def cmd_history(args):
    for h in load_history()[: args.limit]:
        d = h["delta"]
        arrow = f"{h['before']}{ARROW}{h['after']}"
        sign = f"+{d}" if d > 0 else str(d)
        ref = f" ({h['ref']})" if h.get("ref") else ""
        print(f"{h['ts'][:19]}  {h['productId']:22} {h['variantKey']:14} {sign:>5}  {arrow:9} {h['reason']}{ref}")


def cmd_export(args):
    print(json.dumps(load_stock(), indent=2))


def _report(pid, vk, before, after):
    meta = CATALOG[pid]
    st, col = state_for(after, meta["low"])
    print(f"{meta['name']} [{vk}]  {before} {ARROW} {after}   {col}{st}{RESET}")


def main():
    p = argparse.ArgumentParser(prog="manage.py", description="AZRAA inventory management")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("seed"); s.add_argument("--qty", type=int, default=40); s.set_defaults(fn=cmd_seed)
    s = sub.add_parser("view"); s.add_argument("product", nargs="?"); s.set_defaults(fn=cmd_view)
    s = sub.add_parser("export"); s.set_defaults(fn=cmd_export)

    for name, sign, reason in [("add", 1, "admin-add"), ("remove", -1, "admin-remove")]:
        s = sub.add_parser(name)
        s.add_argument("product"); s.add_argument("color"); s.add_argument("size"); s.add_argument("qty", type=int)
        s.set_defaults(fn=lambda a, sign=sign, reason=reason: _variant_cmd(a, sign, reason))

    for name, reason in [("order", "order"), ("restore", "cancellation")]:
        s = sub.add_parser(name)
        s.add_argument("product"); s.add_argument("color"); s.add_argument("size"); s.add_argument("qty", type=int)
        s.add_argument("--ref")
        sign = -1 if name == "order" else 1
        s.set_defaults(fn=lambda a, sign=sign, reason=reason: _variant_cmd(a, sign, reason))

    s = sub.add_parser("set")
    s.add_argument("product"); s.add_argument("color"); s.add_argument("size"); s.add_argument("qty", type=int)
    s.set_defaults(fn=cmd_set)

    s = sub.add_parser("adjust")
    s.add_argument("product"); s.add_argument("color"); s.add_argument("size"); s.add_argument("delta", type=int)
    s.set_defaults(fn=cmd_adjust)

    s = sub.add_parser("unavailable"); s.add_argument("product"); s.set_defaults(fn=cmd_unavailable)
    s = sub.add_parser("available"); s.add_argument("product"); s.set_defaults(fn=cmd_available)
    s = sub.add_parser("history"); s.add_argument("--limit", type=int, default=30); s.set_defaults(fn=cmd_history)

    args = p.parse_args()
    args.fn(args)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(1)
