import 'dotenv/config';

function readOptional(name) {
  return process.env[name] || '';
}

export const env = {
  PORT: process.env.PORT || 10000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  SUPABASE_URL: readOptional('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: readOptional('SUPABASE_SERVICE_ROLE_KEY'),

  TURNSTILE_SECRET_KEY: readOptional('TURNSTILE_SECRET_KEY'),

  RAZORPAY_KEY_ID: readOptional('RAZORPAY_KEY_ID'),
  RAZORPAY_KEY_SECRET: readOptional('RAZORPAY_KEY_SECRET'),

  PAYSTACK_SECRET_KEY: readOptional('PAYSTACK_SECRET_KEY'),

  FLUTTERWAVE_SECRET_KEY: readOptional('FLUTTERWAVE_SECRET_KEY'),

  PAYPAL_CLIENT_ID: readOptional('PAYPAL_CLIENT_ID'),
  PAYPAL_CLIENT_SECRET: readOptional('PAYPAL_CLIENT_SECRET'),
  PAYPAL_ENV: process.env.PAYPAL_ENV || 'sandbox',
};
