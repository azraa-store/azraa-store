import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById } from '../data/products.js';

const WishlistContext = createContext(null);
const KEY = 'azraa.wishlist';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(load); // [productId]

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* ignore */ }
  }, [ids]);

  const has = useCallback((productId) => ids.includes(productId), [ids]);

  const toggle = useCallback((productId) => {
    setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }, []);

  const remove = useCallback((productId) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const items = useMemo(() => ids.map((id) => getProductById(id)).filter(Boolean), [ids]);
  const count = items.length;

  const value = useMemo(
    () => ({ ids, items, count, has, toggle, remove, clear }),
    [ids, items, count, has, toggle, remove, clear]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
