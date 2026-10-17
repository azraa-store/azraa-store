import { Router } from 'express';
import { env } from '../../env.js';
import { markOrderPaid } from '../../supabaseAdmin.js';

const router = Router();
const BASE_URL = env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const resp = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: { authorization: `Basic ${auth}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error_description || 'paypal auth failed');
  return data.access_token;
}

// Matches paypal.js createSession() LIVE contract: create the order server-side.
router.post('/session', async (req, res) => {
  const { orderId, amount, currency = 'USD' } = req.body || {};
  if (!orderId || !amount) return res.status(400).json({ error: 'orderId and amount are required' });
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) return res.status(503).json({ error: 'paypal not configured' });

  try {
    const token = await getAccessToken();
    const resp = await fetch(`${BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ reference_id: String(orderId), amount: { currency_code: currency, value: String(amount) } }],
      }),
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: data?.message || 'paypal order creation failed' });
    res.json({ paypalOrderId: data.id });
  } catch {
    res.status(502).json({ error: 'paypal request failed' });
  }
});

router.post('/capture', async (req, res) => {
  const { paypalOrderId, orderId } = req.body || {};
  if (!paypalOrderId) return res.status(400).json({ error: 'paypalOrderId is required' });
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) return res.status(503).json({ error: 'paypal not configured' });

  try {
    const token = await getAccessToken();
    const resp = await fetch(`${BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    });
    const data = await resp.json();
    const paid = resp.ok && data.status === 'COMPLETED';
    if (paid) await markOrderPaid({ orderId, provider: 'paypal', reference: paypalOrderId });
    res.json({ status: paid ? 'paid' : 'failed' });
  } catch {
    res.status(502).json({ error: 'paypal capture request failed' });
  }
});

export default router;
