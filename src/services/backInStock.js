// Back-in-stock alerts. Mock, same localStorage pattern as inventory.js.
//
// There's no real email-sending backend in this codebase (the newsletter
// forms are the same documented mock), so "notify" here means: when a
// subscribed variant's availability() flips to 'in' — checked on app load
// and whenever a product page is visited — show an in-app toast. This is
// a stand-in for a real email notification, not one.

import { variantKey } from './inventory.js';

const KEY = 'azraa.backinstock';

function readStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

const entryKey = (productId, color, size) => `${productId}|${variantKey(color, size)}`;

export function subscribe(productId, color, size, email) {
  const store = readStore();
  const k = entryKey(productId, color, size);
  const emails = new Set(store[k]?.emails || []);
  emails.add(email.trim().toLowerCase());
  store[k] = { productId, color: color || null, size: size || null, emails: [...emails], notified: false };
  writeStore(store);
}

export function isSubscribed(productId, color, size, email) {
  const store = readStore();
  const entry = store[entryKey(productId, color, size)];
  if (!entry) return false;
  return entry.emails.includes(email.trim().toLowerCase());
}

/** All not-yet-notified subscriptions, for the restock sweep. */
export function pendingSubscriptions() {
  return Object.values(readStore()).filter((e) => !e.notified);
}

export function markNotified(productId, color, size) {
  const store = readStore();
  const k = entryKey(productId, color, size);
  if (store[k]) {
    store[k].notified = true;
    writeStore(store);
  }
}
