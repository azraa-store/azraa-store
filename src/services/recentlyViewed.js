// Recently viewed products. Mock, localStorage, same pattern as the rest of
// this mock backend. Per-browser, not per-account — a real implementation
// would likely merge this into the account once signed in.

import { getProductById } from '../data/products.js';
import { isStorefrontReady } from './catalog.js';

const KEY = 'azraa.recentlyViewed';
const MAX = 12;

function readIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeIds(ids) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function recordView(productId) {
  if (!productId) return;
  const ids = readIds().filter((id) => id !== productId);
  ids.unshift(productId);
  writeIds(ids.slice(0, MAX));
}

export function getRecentlyViewed(excludeId, limit = 8) {
  return readIds()
    .filter((id) => id !== excludeId)
    .map(getProductById)
    .filter((p) => p && isStorefrontReady(p))
    .slice(0, limit);
}
