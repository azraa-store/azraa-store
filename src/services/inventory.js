// Inventory, customer-safe read model + order hooks.
//
// Customers never see quantities, only In Stock / Low Stock / Out of Stock.
// The administrator (Python tool in /inventory, or a future admin dashboard)
// sees and edits real numbers. This browser mock persists to localStorage and
// shares the same JSON shape as the Python store so they are interchangeable.
//
// Stock is tracked at Product -> Colour -> Size. `applyOrder` checks every line
// has enough before committing, so a single call cannot oversell; a real backend
// must do this inside a DB transaction with row locks.

import { PRODUCTS } from '../data/products.js';

const KEY = 'azraa.inventory';
const HKEY = 'azraa.inventory.history';
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const variantKey = (color, size) => `${color || '-'}|${size || '-'}`;

// Deterministic seed so demo stock is stable but varied.
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 100;
}

function seed() {
  const store = {};
  for (const p of PRODUCTS) {
    store[p.id] = {};
    const colors = p.colors?.length ? p.colors.map((c) => c.name) : [null];
    const sizes = p.sizes?.length ? p.sizes.map((s) => s.label) : [null];
    for (const c of colors) {
      for (const s of sizes) {
        const seedVal = hash(`${p.id}|${c}|${s}`);
        // a wholesale supplier holds real depth; ~7% out, ~14% low, rest healthy
        let qty = 90 + (seedVal % 160);
        if (seedVal < 7) qty = 0;
        else if (seedVal < 21) qty = Math.max(1, (p.inventory?.lowStockThreshold || 10) - (seedVal % 5));
        store[p.id][variantKey(c, s)] = qty;
      }
    }
  }
  return store;
}

function readStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && typeof raw === 'object') return raw;
  } catch { /* ignore */ }
  const fresh = seed();
  writeStore(fresh);
  return fresh;
}
function writeStore(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
function readHistory() {
  try { return JSON.parse(localStorage.getItem(HKEY) || '[]'); } catch { return []; }
}
function log(entries) {
  try {
    localStorage.setItem(HKEY, JSON.stringify([...entries, ...readHistory()].slice(0, 500)));
  } catch { /* ignore */ }
}

/* ---------------- customer-facing ---------------- */

export function getVariantQty(productId, color, size) {
  const store = readStore();
  return store[productId]?.[variantKey(color, size)] ?? null;
}

/** 'in' | 'low' | 'out' | 'unknown' */
export function availability(product, color, size) {
  if (!product) return 'unknown';
  const threshold = product.inventory?.lowStockThreshold ?? 10;

  const keys = [];
  if (color == null && size == null) {
    // product-level: aggregate all variants
    const store = readStore();
    const all = store[product.id] ? Object.values(store[product.id]) : [];
    if (!all.length) return 'unknown';
    const total = all.reduce((a, b) => a + b, 0);
    if (total <= 0) return 'out';
    if (all.every((q) => q <= threshold)) return 'low';
    return 'in';
  }
  keys.push(variantKey(color, size));
  const qty = keys.map((k) => readStore()[product.id]?.[k] ?? 0).reduce((a, b) => a + b, 0);
  if (qty <= 0) return 'out';
  if (qty <= threshold) return 'low';
  return 'in';
}

export const availabilityLabel = (state) =>
  ({ in: 'In stock', low: 'Low stock', out: 'Out of stock', unknown: 'Availability on request' }[state] || '');

/* ---------------- order hooks ---------------- */

/**
 * Decrement stock for a confirmed/paid order. Returns { ok, shortages }.
 * Commits only if every line has enough.
 * @param {Array<{productId,color?,size?,qty}>} lines
 */
export async function applyOrder(lines, ref) {
  await delay(0);
  const store = readStore();
  const shortages = [];
  for (const l of lines) {
    const vk = variantKey(l.color, l.size);
    const have = store[l.productId]?.[vk] ?? 0;
    if (have < l.qty) shortages.push({ ...l, have });
  }
  if (shortages.length) return { ok: false, shortages };

  const entries = [];
  for (const l of lines) {
    const vk = variantKey(l.color, l.size);
    const before = store[l.productId][vk];
    store[l.productId][vk] = before - l.qty;
    entries.push({
      ts: new Date().toISOString(), productId: l.productId, variantKey: vk,
      delta: -l.qty, reason: 'order', ref, before, after: store[l.productId][vk],
    });
  }
  writeStore(store);
  log(entries);
  return { ok: true };
}

/** Restore stock for a validly-cancelled order. */
export async function restoreOrder(lines, ref) {
  await delay(0);
  const store = readStore();
  const entries = [];
  for (const l of lines) {
    const vk = variantKey(l.color, l.size);
    if (!store[l.productId]) store[l.productId] = {};
    const before = store[l.productId][vk] ?? 0;
    store[l.productId][vk] = before + l.qty;
    entries.push({
      ts: new Date().toISOString(), productId: l.productId, variantKey: vk,
      delta: l.qty, reason: 'cancellation', ref, before, after: store[l.productId][vk],
    });
  }
  writeStore(store);
  log(entries);
  return { ok: true };
}

/* ---------------- admin ---------------- */

export function adminSnapshot() {
  const store = readStore();
  return PRODUCTS.map((p) => ({
    id: p.id, name: p.name, category: p.category,
    threshold: p.inventory?.lowStockThreshold ?? 10,
    variants: Object.entries(store[p.id] || {}).map(([vk, qty]) => {
      const [color, size] = vk.split('|');
      const threshold = p.inventory?.lowStockThreshold ?? 10;
      return {
        color: color === '-' ? null : color,
        size: size === '-' ? null : size,
        qty,
        state: qty <= 0 ? 'out' : qty <= threshold ? 'low' : 'in',
      };
    }),
  }));
}

export function setStock(productId, color, size, qty, reason = 'admin-set') {
  const store = readStore();
  if (!store[productId]) store[productId] = {};
  const vk = variantKey(color, size);
  const before = store[productId][vk] ?? 0;
  store[productId][vk] = Math.max(0, Math.round(qty));
  writeStore(store);
  log([{ ts: new Date().toISOString(), productId, variantKey: vk, delta: store[productId][vk] - before, reason, before, after: store[productId][vk] }]);
}

export const getHistory = (limit = 100) => readHistory().slice(0, limit);
export const resetInventory = () => { writeStore(seed()); localStorage.removeItem(HKEY); };
