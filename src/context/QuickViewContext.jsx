import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const QuickViewContext = createContext(null);

export function QuickViewProvider({ children }) {
  const [product, setProduct] = useState(null);

  const show = useCallback((p) => setProduct(p), []);
  const hide = useCallback(() => setProduct(null), []);

  const value = useMemo(() => ({ product, open: Boolean(product), show, hide }), [product, show, hide]);

  return <QuickViewContext.Provider value={value}>{children}</QuickViewContext.Provider>;
}

export const useQuickView = () => {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error('useQuickView must be used within QuickViewProvider');
  return ctx;
};
