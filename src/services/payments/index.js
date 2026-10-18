// Modular payment provider registry.
//
// Each provider is enabled per-country (see src/data/countries.js `paymentMethods`).
// Only *publishable* keys are read on the client (VITE_* env). Secret keys and the
// actual charge call live on the backend: in production every `createSession`
// below becomes a call to `/api/payments/<provider>/session`, and the server talks
// to the provider. When no publishable key is configured the provider runs in
// `mock` mode so the full checkout flow is testable end to end.

import razorpay from './razorpay.js';
import paystack from './paystack.js';
import paypal from './paypal.js';
import { getCountry } from '../../data/countries.js';

const REGISTRY = { razorpay, paystack, paypal };

/** Providers available for a country, in the country's configured display order. */
export function providersForCountry(countryCode) {
  const country = getCountry(countryCode);
  return (country.paymentMethods || [])
    .map((id) => REGISTRY[id])
    .filter(Boolean);
}

export function getProvider(id) {
  return REGISTRY[id] || null;
}

export function allProviders() {
  return Object.values(REGISTRY);
}
