import { mockSession, mockConfirm } from './_mock.js';

const CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

/**
 * PayPal — international fallback. Publishable: VITE_PAYPAL_CLIENT_ID.
 * Secret + order capture stay server-side.
 */
export default {
  id: 'paypal',
  label: 'PayPal',
  description: 'PayPal balance or card — international',
  currencies: ['USD', 'INR', 'NGN', 'GHS', 'KES', 'AED', 'ZAR', 'BDT'],
  configured: Boolean(CLIENT_ID),

  supports() {
    return true;
  },

  async createSession({ order, returnUrl }) {
    if (!CLIENT_ID) return mockSession({ providerId: 'paypal', order });
    // LIVE: load the PayPal JS SDK with CLIENT_ID, create the order server-side
    //   (POST /api/payments/paypal/session), then capture on approval.
    return {
      provider: 'paypal',
      mode: 'live',
      clientId: CLIENT_ID,
      needsBackend: true,
      returnUrl,
      amount: order.total,
      currency: order.currency,
    };
  },

  async confirm(session, details) {
    if (session.mode === 'mock') return mockConfirm(session);
    return { status: 'pending_verification', provider: 'paypal', details };
  },
};
