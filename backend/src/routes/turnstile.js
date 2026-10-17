import { Router } from 'express';
import { env } from '../env.js';

const router = Router();

// POST /api/turnstile/verify { token } — call this before accepting a
// sign-up/sign-in/enquiry/newsletter submission on the frontend.
router.post('/verify', async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ success: false, error: 'missing token' });
  if (!env.TURNSTILE_SECRET_KEY) return res.status(503).json({ success: false, error: 'turnstile not configured' });

  try {
    const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: req.ip }),
    });
    const data = await resp.json();
    res.json({ success: Boolean(data.success), errorCodes: data['error-codes'] || [] });
  } catch {
    res.status(502).json({ success: false, error: 'verification request failed' });
  }
});

export default router;
