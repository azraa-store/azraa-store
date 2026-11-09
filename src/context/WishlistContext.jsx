import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById } from '../data/products.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext(null);
const KEY = 'azraa.wishlist';
const NUDGE_SHOWN_KEY = 'azraa.wishlist.nudge-shown';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function nudgeShown() {
  try {
    return localStorage.getItem(NUDGE_SHOWN_KEY) === '1';
  } catch {
    return false;
  }
}

export function WishlistProvider({ children }) {
  const { isAuthed } = useAuth();
  const [ids, setIds] = useState(load); // [productId]
  const [nudge, setNudge] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* ignore */ }
  }, [ids]);

  const has = useCallback((productId) => ids.includes(productId), [ids]);

  const dismissNudge = useCallback(() => {
    setNudge(false);
    try { localStorage.setItem(NUDGE_SHOWN_KEY, '1'); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback((productId) => {
    setIds((prev) => {
      const adding = !prev.includes(productId);
      if (adding && !isAuthed && !nudgeShown()) setNudge(true);
      return adding ? [...prev, productId] : prev.filter((id) => id !== productId);
    });
  }, [isAuthed]);

  const remove = useCallback((productId) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const items = useMemo(() => ids.map((id) => getProductById(id)).filter(Boolean), [ids]);
  const count = items.length;

  const value = useMemo(
    () => ({ ids, items, count, has, toggle, remove, clear, nudge, dismissNudge }),
    [ids, items, count, has, toggle, remove, clear, nudge, dismissNudge]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
