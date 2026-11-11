// Real order persistence via Supabase (supabase/schema.sql's `orders`
// table), used when VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are set.
// Mirrors ./mock.js's exact function signatures and return shape so
// src/services/orders.js can dispatch between the two transparently.
//
// Inventory itself is still the localStorage mock (services/inventory.js)
// either way — only the order *record* becomes real/cross-device here.

import { supabase } from '../../lib/supabaseClient.js';
import { applyOrder, restoreOrder } from '../inventory.js';
import { cached, invalidate } from '../../lib/cache.js';

const LIST_KEY = 'orders.list';
const LIST_TTL_MS = 30_000; // just long enough to cover switching between account tabs

const invLines = (order) =>
  order.items.map((it) => ({
    productId: it.productId,
    color: it.variant?.color || null,
    size: it.variant?.size || null,
    qty: it.qty,
  }));

function mapRow(row) {
  return {
    id: row.id,
    number: row.number,
    status: row.status,
    orderType: row.order_type,
    currency: row.currency,
    customer: row.customer,
    shippingAddress: row.shipping_address,
    shippingMethod: row.shipping_method,
    items: row.items,
    amounts: row.amounts,
    promo: row.promo,
    display: row.display,
    inventoryApplied: row.inventory_applied,
    createdAt: row.created_at,
    cancelledAt: row.cancelled_at,
  };
}

export async function createOrder(order) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Sign in to place an order.');

  // Confirmed + paid -> commit inventory first. Reject if stock moved
  // underneath us, same check the mock backend makes.
  const res = await applyOrder(invLines(order), order.customer?.email || user.id);
  if (!res.ok) {
    const names = res.shortages.map((s) => s.productId).join(', ');
    throw new Error(`Some items sold out while you were checking out (${names}). Please review your bag.`);
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      order_type: order.orderType || 'retail',
      currency: order.currency,
      customer: order.customer,
      shipping_address: order.shippingAddress,
      shipping_method: order.shippingMethod,
      items: order.items,
      amounts: order.amounts,
      promo: order.promo,
      display: order.display,
      inventory_applied: true,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  invalidate(LIST_KEY);
  return mapRow(data);
}

export async function cancelOrder(id) {
  const { data: existing, error: fetchError } = await supabase.from('orders').select('*').eq('id', id).single();
  if (fetchError || !existing) throw new Error('Order not found.');
  if (existing.status === 'cancelled') return mapRow(existing);

  if (existing.inventory_applied) await restoreOrder(invLines(mapRow(existing)), existing.number);

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  invalidate(LIST_KEY);
  return mapRow(data);
}

// RLS already scopes every query to the signed-in user, so `email` is
// accepted for signature compatibility with the mock backend but unused.
// Cached briefly (see lib/cache.js) since AccountPage re-fetches on every
// tab switch between Overview/Orders.
export async function listOrders() {
  return cached(LIST_KEY, LIST_TTL_MS, async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(mapRow);
  });
}

export async function getOrder(id) {
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return mapRow(data);
}
