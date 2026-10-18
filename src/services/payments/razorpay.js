import { mockSession, mockConfirm } from './_mock.js';

const KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

/**
 * Razorpay, India (INR). Publishable: VITE_RAZORPAY_KEY_ID.
 * Secret (RAZORPAY_KEY_SECRET) and order creation stay server-side.
 */
export default {
  id: 'razorpay',
  label: 'Razorpay',
  description: 'UPI, cards, netbanking & wallets, India',
  currencies: ['INR'],
  configured: Boolean(KEY_ID),

  supports(countryCode) {
    return countryCode === 'IN';
  },

  async createSession({ order, returnUrl }) {
    if (!KEY_ID) return mockSession({ providerId: 'razorpay', order });
    // LIVE: POST /api/payments/razorpay/session { orderId: order.id }
    //   -> server calls razorpay.orders.create(...) with the secret key
    //   -> returns { razorpayOrderId, amount, currency, keyId: KEY_ID }
    // then open Razorpay Checkout with that razorpayOrderId.
    return {
      provider: 'razorpay',
      mode: 'live',
      keyId: KEY_ID,
      needsBackend: true,
      returnUrl,
      amount: order.total,
      currency: order.currency,
    };
  },

  async confirm(session, details) {
    if (session.mode === 'mock') return mockConfirm(session);
    // LIVE: POST /api/payments/razorpay/verify { ...details (razorpay_payment_id,
    //   razorpay_order_id, razorpay_signature) } -> server verifies the HMAC
    //   signature with the secret before marking the order paid.
    return { status: 'pending_verification', provider: 'razorpay', details };
  },
};
