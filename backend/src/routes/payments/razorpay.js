import { Router } from 'express';
import crypto from 'node:crypto';
import { env } from '../../env.js';
import { markOrderPaid } from '../../supabaseAdmin.js';

const router = Router();

// Matches azraa-store's src/services/payments/razorpay.js createSession() LIVE contract.
router.post('/session', async (req, res) => {
  const { orderId, amount, currency = 'INR' } = req.body || {};
  if (!orderId || !amount) return res.status(400).json({ error: 'orderId and amount are required' });
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) return res.status(503).json({ error: 'razorpay not configured' });

  try {
    const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');
    const resp = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { authorization: `Basic ${auth}`, 'content-type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(amount * 100), currency, receipt: String(orderId) }),
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: data?.error?.description || 'razorpay order creation failed' });
    res.json({ razorpayOrderId: data.id, amount: data.amount, currency: data.currency, keyId: env.RAZORPAY_KEY_ID });
  } catch {
    res.status(502).json({ error: 'razorpay request failed' });
  }
});

// Matches confirm() LIVE contract: verifies the HMAC signature server-side.
router.post('/verify', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body || {};
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'missing razorpay verification fields' });
  }
  if (!env.RAZORPAY_KEY_SECRET) return res.status(503).json({ error: 'razorpay not configured' });

  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) return res.status(400).json({ status: 'failed', error: 'signature mismatch' });

  await markOrderPaid({ orderId, provider: 'razorpay', reference: razorpay_payment_id });
  res.json({ status: 'paid' });
});

export default router;
