import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

export const supabaseAdmin =
  env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    : null;

// The `orders` table doesn't exist in Supabase yet (schema is a separate step).
// Until it does, this logs instead of writing so payment verification can still
// be tested end to end without failing.
export async function markOrderPaid({ orderId, provider, reference }) {
  if (!supabaseAdmin) {
    console.warn('[supabase] not configured — skipping order update', { orderId, provider, reference });
    return { written: false };
  }
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: 'paid', payment_provider: provider, payment_ref: reference, paid_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw error;
  return { written: true };
}
