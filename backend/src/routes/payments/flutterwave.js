import { Router } from 'express';
import { env } from '../../env.js';
import { markOrderPaid } from '../../supabaseAdmin.js';

const router = Router();

// Matches flutterwave.js createSession() LIVE contract.
router.post('/session', async (req, res) => {
  const { orderId, amount, currency = 'NGN', email, redirectUrl } = req.body || {};
  if (!orderId || !amount || !email) return res.status(400).json({ error: 'orderId, amount and email are required' });
  if (!env.FLUTTERWAVE_SECRET_KEY) return res.status(503).json({ error: 'flutterwave not configured' });

  const txRef = `azr-${orderId}-${Date.now()}`;
  try {
    const resp = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.FLUTTERWAVE_SECRET_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ tx_ref: txRef, amount, currency, redirect_url: redirectUrl, customer: { email } }),
    });
    const data = await resp.json();
    if (!resp.ok || data.status !== 'success') return res.status(resp.status || 502).json({ error: data?.message || 'flutterwave init failed' });
    res.json({ txRef, paymentLink: data.data.link });
  } catch {
    res.status(502).json({ error: 'flutterwave request failed' });
  }
});

// Matches confirm() LIVE contract: GET transactions/:id/verify.
router.get('/verify/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const { orderId } = req.query;
  if (!env.FLUTTERWAVE_SECRET_KEY) return res.status(503).json({ error: 'flutterwave not configured' });

  try {
    const resp = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
      headers: { authorization: `Bearer ${env.FLUTTERWAVE_SECRET_KEY}` },
    });
    const data = await resp.json();
    const paid = data?.status === 'success' && data?.data?.status === 'successful';
    if (paid) await markOrderPaid({ orderId, provider: 'flutterwave', reference: transactionId });
    res.json({ status: paid ? 'paid' : 'failed' });
  } catch {
    res.status(502).json({ error: 'flutterwave verify request failed' });
  }
});

export default router;
