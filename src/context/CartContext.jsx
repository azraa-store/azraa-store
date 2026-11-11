import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById } from '../data/products.js';

const CartContext = createContext(null);
const KEY = 'azraa.cart';
const PROMO_KEY = 'azraa.cart.promo';
const LOYALTY_KEY = 'azraa.cart.loyaltyRedeemed';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function loadPromo() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROMO_KEY) || 'null');
    return raw && typeof raw.code === 'string' && typeof raw.percent === 'number' ? raw : null;
  } catch {
    return null;
  }
}

const keyOf = (productId, mode, variant) =>
  `${productId}|${mode}|${variant?.color || ''}|${variant?.size || ''}`;

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load); // [{ productId, mode, qty, variant:{color,size} }]
  const [open, setOpen] = useState(false);
  const [promo, setPromo] = useState(loadPromo); // { code, percent } | null
  // Not yet deducted from the account's balance — that happens on a
  // confirmed order (services/loyalty.js redeemPoints), same as promo codes
  // aren't marked redeemed until checkout succeeds.
  const [loyaltyRedeemed, setLoyaltyRedeemed] = useState(() => {
    try { return localStorage.getItem(LOYALTY_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* ignore */ }
  }, [lines]);

  useEffect(() => {
    try {
      if (promo) localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
      else localStorage.removeItem(PROMO_KEY);
    } catch {
      /* ignore */
    }
  }, [promo]);

  useEffect(() => {
    try { localStorage.setItem(LOYALTY_KEY, loyaltyRedeemed ? '1' : '0'); } catch { /* ignore */ }
  }, [loyaltyRedeemed]);

  const applyPromo = useCallback((code, percent) => setPromo({ code, percent }), []);
  const clearPromo = useCallback(() => setPromo(null), []);
  const redeemLoyalty = useCallback(() => setLoyaltyRedeemed(true), []);
  const unredeemLoyalty = useCallback(() => setLoyaltyRedeemed(false), []);

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

  const clear = useCallback(() => { setLines([]); setPromo(null); setLoyaltyRedeemed(false); }, []);

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
    () => ({
      items, lines, count, add, updateQty, remove, clear, open, setOpen,
      promo, applyPromo, clearPromo,
      loyaltyRedeemed, redeemLoyalty, unredeemLoyalty,
    }),
    [items, lines, count, add, updateQty, remove, clear, open, promo, applyPromo, clearPromo, loyaltyRedeemed, redeemLoyalty, unredeemLoyalty]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
