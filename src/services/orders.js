// Mock order store (localStorage). Confirmed orders decrement inventory; valid
// cancellations restore it. Abandoned carts never touch stock.

import { applyOrder, restoreOrder } from './inventory.js';

const KEY = 'azraa.orders';
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function writeAll(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

const invLines = (order) =>
  order.items.map((it) => ({
    productId: it.productId,
    color: it.variant?.color || null,
    size: it.variant?.size || null,
    qty: it.qty,
  }));

export async function createOrder(order) {
  await delay(400);
  const list = readAll();
  const record = {
    id: `AZ-${Date.now().toString(36).toUpperCase()}`,
    number: `AZ${String(10000 + list.length + 1)}`,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    ...order,
  };

  // Confirmed + paid -> commit inventory. Reject if stock moved underneath us.
  const res = await applyOrder(invLines(record), record.number);
  if (!res.ok) {
    const names = res.shortages.map((s) => s.productId).join(', ');
    throw new Error(`Some items sold out while you were checking out (${names}). Please review your bag.`);
  }
  record.inventoryApplied = true;

  writeAll([record, ...list]);
  return record;
}

export async function cancelOrder(id) {
  await delay(300);
  const list = readAll();
  const order = list.find((o) => o.id === id);
  if (!order) throw new Error('Order not found.');
  if (order.status === 'cancelled') return order;

  // Restore stock only for an order that had actually decremented it.
  if (order.inventoryApplied) await restoreOrder(invLines(order), order.number);

  order.status = 'cancelled';
  order.cancelledAt = new Date().toISOString();
  writeAll(list);
  return order;
}

export async function listOrders({ email } = {}) {
  await delay(150);
  const list = readAll();
  return email
    ? list.filter((o) => o.customer?.email?.toLowerCase() === email.toLowerCase())
    : list;
}

export async function getOrder(id) {
  await delay(120);
  return readAll().find((o) => o.id === id) || null;
}
