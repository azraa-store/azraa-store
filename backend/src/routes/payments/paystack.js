import { Router } from 'express';
import { env } from '../../env.js';
import { markOrderPaid } from '../../supabaseAdmin.js';

const router = Router();

// Matches paystack.js createSession() LIVE contract.
router.post('/session', async (req, res) => {
  const { orderId, email, amount, currency = 'NGN' } = req.body || {};
  if (!orderId || !email || !amount) return res.status(400).json({ error: 'orderId, email and amount are required' });
  if (!env.PAYSTACK_SECRET_KEY) return res.status(503).json({ error: 'paystack not configured' });

  try {
    const resp = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ email, amount: Math.round(amount * 100), currency, metadata: { orderId } }),
    });
    const data = await resp.json();
    if (!resp.ok || !data.status) return res.status(resp.status || 502).json({ error: data?.message || 'paystack init failed' });
    res.json({ accessCode: data.data.access_code, reference: data.data.reference });
  } catch {
    res.status(502).json({ error: 'paystack request failed' });
  }
});

// Matches confirm() LIVE contract: GET transaction/verify/:reference.
router.get('/verify/:reference', async (req, res) => {
  const { reference } = req.params;
  const { orderId } = req.query;
  if (!env.PAYSTACK_SECRET_KEY) return res.status(503).json({ error: 'paystack not configured' });

  try {
    const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
    });
    const data = await resp.json();
    const paid = data?.data?.status === 'success';
    if (paid) await markOrderPaid({ orderId, provider: 'paystack', reference });
    res.json({ status: paid ? 'paid' : 'failed' });
  } catch {
    res.status(502).json({ error: 'paystack verify request failed' });
  }
});

export default router;
