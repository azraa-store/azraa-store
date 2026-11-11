// Loyalty / rewards points. Mock, localStorage, keyed by signed-in user id
// (same spirit as inventory.js/backInStock.js — a real backend would track
// this server-side, tied to the authenticated account).
//
// Rule, confirmed with the user: 1 point per $1 of retail subtotal (USD
// reference price, so it's currency-agnostic), flat balance, no tiers.
// 100 points redeem for a flat $5 off at checkout. Retail orders only —
// wholesale already runs on negotiated pricing, same reasoning as the
// Welcome Offer promo code.

const KEY = 'azraa.loyalty';

export const POINTS_PER_USD = 1;
export const REDEEM_COST = 100;
export const REDEEM_VALUE = { usd: 5, inr: 450 };

function readAll() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function getBalance(userId) {
  if (!userId) return 0;
  return readAll()[userId]?.balance || 0;
}

/** Call once an order is confirmed. usdSubtotal is the retail-only portion. */
export function earnPoints(userId, usdSubtotal) {
  if (!userId || !(usdSubtotal > 0)) return 0;
  const earned = Math.floor(usdSubtotal * POINTS_PER_USD);
  if (earned <= 0) return 0;
  const all = readAll();
  const balance = (all[userId]?.balance || 0) + earned;
  all[userId] = { balance };
  writeAll(all);
  return earned;
}

/** Call once an order that redeemed points is confirmed. */
export function redeemPoints(userId) {
  const balance = getBalance(userId);
  if (balance < REDEEM_COST) return false;
  const all = readAll();
  all[userId] = { balance: balance - REDEEM_COST };
  writeAll(all);
  return true;
}
