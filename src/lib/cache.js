// A tiny in-memory TTL cache for read-heavy, write-rare network calls
// (currently just the orders list). Not persisted across reloads on
// purpose — it only needs to survive the back-and-forth between account
// tabs within one visit, not become a second source of truth.

const store = new Map();

/** Returns the cached value for `key` if still fresh, else runs `fn`, caches, and returns it. */
export async function cached(key, ttlMs, fn) {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value;
  const value = await fn();
  store.set(key, { value, at: Date.now() });
  return value;
}

/** Call after any write so the next read isn't served stale data. */
export function invalidate(key) {
  store.delete(key);
}
