import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById } from '../data/products.js';

const CartContext = createContext(null);
const KEY = 'azraa.cart';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

const keyOf = (productId, mode, variant) =>
  `${productId}|${mode}|${variant?.color || ''}|${variant?.size || ''}`;

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load); // [{ productId, mode, qty, variant:{color,size} }]
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* ignore */ }
  }, [lines]);

  const add = useCallback((productId, { qty = 1, variant = null, mode = 'retail' } = {}) => {
    setLines((prev) => {
      const k = keyOf(productId, mode, variant);
      const hit = prev.find((l) => keyOf(l.productId, l.mode, l.variant) === k);
      if (hit) return prev.map((l) => (keyOf(l.productId, l.mode, l.variant) === k ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { productId, mode, qty, variant }];
    });
    setOpen(true);
  }, []);

  const updateQty = useCallback((productId, mode, variant, qty) => {
    setLines((prev) => {
      const k = keyOf(productId, mode, variant);
      if (qty <= 0) return prev.filter((l) => keyOf(l.productId, l.mode, l.variant) !== k);
      return prev.map((l) => (keyOf(l.productId, l.mode, l.variant) === k ? { ...l, qty } : l));
    });
  }, []);

  const remove = useCallback((productId, mode, variant) => {
    const k = keyOf(productId, mode, variant);
    setLines((prev) => prev.filter((l) => keyOf(l.productId, l.mode, l.variant) !== k));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const product = getProductById(l.productId);
          return product ? { product, qty: l.qty, variant: l.variant || null, mode: l.mode || 'retail' } : null;
        })
        .filter(Boolean),
    [lines]
  );

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, lines, count, add, updateQty, remove, clear, open, setOpen }),
    [items, lines, count, add, updateQty, remove, clear, open]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
