// Customer reviews. Mock, same localStorage pattern as inventory.js /
// backInStock.js. No seeded reviews — every product starts with zero, real
// visitors write real ones, rather than fabricating testimonials.
// One review per signed-in user per product (resubmitting replaces it).

const KEY = 'azraa.reviews';

function readAll() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function getReviews(productId) {
  const list = readAll()[productId] || [];
  return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getSummary(productId) {
  const list = readAll()[productId] || [];
  if (list.length === 0) return { average: 0, count: 0 };
  const average = list.reduce((s, r) => s + r.rating, 0) / list.length;
  return { average, count: list.length };
}

export function myReview(productId, userId) {
  if (!userId) return null;
  return (readAll()[productId] || []).find((r) => r.userId === userId) || null;
}

export function addReview(productId, { userId, name, rating, title, body }) {
  if (!userId) throw new Error('Sign in to write a review.');
  const clampedRating = Math.min(5, Math.max(1, Math.round(rating)));
  const all = readAll();
  const list = all[productId] || [];
  const entry = {
    userId,
    name: name || 'AZRAA customer',
    rating: clampedRating,
    title: (title || '').trim().slice(0, 80),
    body: (body || '').trim().slice(0, 1000),
    createdAt: new Date().toISOString(),
  };
  const without = list.filter((r) => r.userId !== userId);
  all[productId] = [...without, entry];
  writeAll(all);
  return entry;
}
