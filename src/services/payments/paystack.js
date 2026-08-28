import { mockSession, mockConfirm } from './_mock.js';

const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

/**
 * Paystack — Nigeria (NGN). Publishable: VITE_PAYSTACK_PUBLIC_KEY.
 * Secret (PAYSTACK_SECRET_KEY) + transaction init/verify stay server-side.
 */
export default {
  id: 'paystack',
  label: 'Paystack',
  description: 'Cards, bank transfer & USSD — Nigeria',
  currencies: ['NGN', 'GHS', 'ZAR', 'KES'],
  configured: Boolean(PUBLIC_KEY),

  supports(countryCode) {
    return ['NG', 'GH', 'ZA', 'KE'].includes(countryCode);
  },

  async createSession({ order, returnUrl }) {
    if (!PUBLIC_KEY) return mockSession({ providerId: 'paystack', order });
    // LIVE: POST /api/payments/paystack/session -> server calls
    //   transaction.initialize with the secret key -> { access_code, reference }
    //   then open Paystack inline/popup with access_code.
    return {
      provider: 'paystack',
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
    // LIVE: server verifies GET https://api.paystack.co/transaction/verify/:ref
    return { status: 'pending_verification', provider: 'paystack', details };
  },
};
