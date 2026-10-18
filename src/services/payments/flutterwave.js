import { mockSession, mockConfirm } from './_mock.js';

const PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '';

/**
 * Flutterwave, Nigeria + pan-African (NGN, GHS, KES, ZAR, USD).
 * Publishable: VITE_FLUTTERWAVE_PUBLIC_KEY. Secret key + verify stay server-side.
 */
export default {
  id: 'flutterwave',
  label: 'Flutterwave',
  description: 'Cards, mobile money & bank transfer, Africa',
  currencies: ['NGN', 'GHS', 'KES', 'ZAR', 'USD'],
  configured: Boolean(PUBLIC_KEY),

  supports(countryCode) {
    return ['NG', 'GH', 'KE', 'ZA'].includes(countryCode);
  },

  async createSession({ order, returnUrl }) {
    if (!PUBLIC_KEY) return mockSession({ providerId: 'flutterwave', order });
    return {
      provider: 'flutterwave',
      mode: 'live',
      publicKey: PUBLIC_KEY,
      needsBackend: true,
      returnUrl,
      amount: order.total,
      currency: order.currency,
    };
  },

  async confirm(session, details) {
    if (session.mode === 'mock') return mockConfirm(session);
    // LIVE: server verifies GET https://api.flutterwave.com/v3/transactions/:id/verify
    return { status: 'pending_verification', provider: 'flutterwave', details };
  },
};
