// Promo codes. Mock, same spirit as the rest of this mock backend (pricing,
// payments, inventory): a real backend would validate and redeem these
// server-side at checkout. One-use-per-email is tracked in localStorage,
// which is honest, soft enforcement, not real fraud prevention — same
// caveat that already applies to the rest of this client-only backend.

const REDEEMED_KEY = 'azraa.promo.redeemed';

// The only real, approved offer right now: 10% off a first retail order.
// Wholesale isn't included, it already runs on negotiated pricing.
export const PROMO_CODES = {
  WELCOME10: { percent: 10, modes: ['retail'], label: '10% off your first order' },
};

function readRedeemed() {
  try {
    const raw = JSON.parse(localStorage.getItem(REDEEMED_KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

/**
 * @returns {{ ok:true, code:string, percent:number } | { ok:false, reason:string }}
 */
export function validatePromoCode(code, { orderMode = 'retail', email = '' } = {}) {
  const key = (code || '').trim().toUpperCase();
  const promo = PROMO_CODES[key];
  if (!promo) return { ok: false, reason: 'That code isn’t recognized.' };
  if (!promo.modes.includes(orderMode)) {
    return { ok: false, reason: 'This code applies to retail orders only.' };
  }
  const redeemedBy = readRedeemed()[key] || [];
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail && redeemedBy.includes(normalizedEmail)) {
    return { ok: false, reason: 'This code has already been used on this email.' };
  }
  return { ok: true, code: key, percent: promo.percent };
}

export function markPromoRedeemed(code, email) {
  const key = (code || '').trim().toUpperCase();
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!PROMO_CODES[key] || !normalizedEmail) return;
  const all = readRedeemed();
  all[key] = [...new Set([...(all[key] || []), normalizedEmail])];
  try {
    localStorage.setItem(REDEEMED_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
