import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import paymentsRouter from './routes/payments/index.js';
import turnstileRouter from './routes/turnstile.js';

const app = express();
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get('/healthz', (req, res) => res.json({ ok: true }));

app.use('/api/payments', paymentsRouter);
app.use('/api/turnstile', turnstileRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal error' });
});

app.listen(env.PORT, () => {
  console.log(`azraa-backend listening on :${env.PORT}`);
});
