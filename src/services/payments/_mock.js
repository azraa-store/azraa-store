// Shared helper for provider stubs running without real credentials.
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function mockSession({ providerId, order }) {
  await delay(400);
  return {
    provider: providerId,
    mode: 'mock',
    reference: `${providerId.toUpperCase()}_${Math.random().toString(36).slice(2, 12)}`,
    amount: order.total,
    currency: order.currency,
    // In live mode this would carry the provider's client secret / checkout URL.
  };
}

export async function mockConfirm(session) {
  await delay(900);
  return {
    status: 'paid',
    mode: 'mock',
    provider: session.provider,
    transactionId: `txn_${Math.random().toString(36).slice(2, 14)}`,
    paidAt: new Date().toISOString(),
  };
}
