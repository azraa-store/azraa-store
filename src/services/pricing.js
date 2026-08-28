// Pricing.
//
//   India (INR)     -> the exact supplied INR figure
//   United States   -> the USD reference figure  (default currency)
//   anywhere else   -> USD reference converted live to the local currency
//
// Display / estimation only. The backend MUST recompute and validate the final
// amount in the charge currency before creating any payment.

import { getCountry } from '../data/countries.js';
import { convertFromUSD, roundForCurrency } from './fx.js';
import { logisticsForMode, EXPRESS_MULTIPLIER } from '../data/logistics.js';

export function formatMoney(amount, currency, locale) {
  if (amount == null) return '—';
  const zeroDecimal = ['INR', 'NGN', 'KES', 'BDT'];
  try {
    return new Intl.NumberFormat(locale || 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: zeroDecimal.includes(currency) ? 0 : 2,
      minimumFractionDigits: zeroDecimal.includes(currency) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toLocaleString()}`;
  }
}

/** An amount that is a USD reference or an INR source, resolved to a currency. */
export function amountIn({ inr, usd }, currency, rates) {
  if (currency === 'INR' && typeof inr === 'number') return inr;
  if (currency === 'USD') return usd;
  return roundForCurrency(convertFromUSD(usd, currency, rates), currency);
}

/**
 * Resolve a single-unit price for a product in a purchasing mode + currency.
 * @returns {{ inr?:number, usd:number, amount:number, currency:string, formatted:string, locale:string }}
 */
export function resolvePrice(product, mode, currency, rates, locale) {
  const entry = product?.pricing?.[mode];
  if (!entry || typeof entry.usd !== 'number') return { status: 'unavailable' };
  const amount = amountIn(entry, currency, rates);
  return {
    inr: entry.inr,
    usd: entry.usd,
    amount,
    currency,
    locale: locale || 'en-US',
    formatted: formatMoney(amount, currency, locale),
  };
}

/** Price to advertise on cards / listings — the retail price. */
export function displayPrice(product, currency, rates, locale) {
  return { ...resolvePrice(product, 'retail', currency, rates, locale), mode: 'retail' };
}

/**
 * Cart / order totals, computed directly in the customer's display currency.
 * Each line carries its own `mode`. Logistics is charged once per order, at the
 * wholesale rate if any wholesale line is present, else retail. `express` adds a
 * surcharge on top.
 *
 * @param {Array<{product, qty, mode, variant}>} items
 */
export function computeCartTotals(items, countryCode, rates, { express = false } = {}) {
  const country = getCountry(countryCode);
  const currency = country.currency;
  const locale = country.locale;
  const money = (a) => formatMoney(a, currency, locale);

  const lines = items.map((it) => {
    const price = resolvePrice(it.product, it.mode, currency, rates, locale);
    const unit = price.status ? 0 : price.amount;
    const lineAmount = roundForCurrency(unit * it.qty, currency);
    return { ...it, price, unit, lineAmount };
  });

  const subtotal = roundForCurrency(lines.reduce((s, l) => s + l.lineAmount, 0), currency);

  const orderMode = items.some((i) => i.mode === 'wholesale') ? 'wholesale' : 'retail';
  const logi = logisticsForMode(orderMode);
  const baseShip = items.length === 0 ? 0 : amountIn(logi, currency, rates);
  const shipping = roundForCurrency(express ? baseShip * EXPRESS_MULTIPLIER : baseShip, currency);

  const tax = roundForCurrency((subtotal + shipping) * country.taxRate, currency);
  const total = roundForCurrency(subtotal + shipping + tax, currency);

  return {
    currency, locale, money,
    lines,
    orderMode,
    logisticsLabel: logi.label,
    logisticsBase: money(roundForCurrency(baseShip, currency)),
    subtotal, subtotalText: money(subtotal),
    shipping, shippingText: shipping === 0 ? 'Free' : money(shipping),
    express,
    taxLabel: country.taxLabel,
    taxRate: country.taxRate,
    tax, taxText: money(tax),
    total, totalText: money(total),
  };
}
