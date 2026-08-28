// Logistics / shipping charge by purchasing mode. One place, configurable.
// Supplied in INR (Retail ₹40, Wholesale ₹30); the USD figure is derived at the
// same reference rate as product prices and is what other currencies convert
// from. India is charged the exact INR figure.

import { toUSD } from './products.js';

export const LOGISTICS = {
  retail: { inr: 40, usd: toUSD(40), label: 'Retail delivery' },
  wholesale: { inr: 30, usd: toUSD(30), label: 'Wholesale delivery' },
};

// Express adds this multiple of the base logistics charge.
export const EXPRESS_MULTIPLIER = 1.6;

export const logisticsForMode = (mode) => LOGISTICS[mode] || LOGISTICS.retail;
