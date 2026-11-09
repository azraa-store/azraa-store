import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRegion } from './RegionContext.jsx';

// Shared "one promotional interruption per session" gate for the Welcome
// Offer and Exit-Intent popups, so the two can never both interrupt the
// same visit. Same localStorage-flag shape as RegionContext's WELCOMED_KEY.
const PromoGateContext = createContext(null);
const KEY = 'azraa.promo.interrupted';

function interruptedAlready() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function PromoGateProvider({ children }) {
  const { showWelcome } = useRegion();
  const [interrupted, setInterrupted] = useState(interruptedAlready);

  const markInterrupted = useCallback(() => {
    setInterrupted(true);
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  // Don't compete with the region welcome modal, and only one promo
  // interruption is allowed to ever claim this slot per session/device.
  const armed = !showWelcome && !interrupted;

  const value = useMemo(() => ({ armed, interrupted, markInterrupted }), [armed, interrupted, markInterrupted]);

  return <PromoGateContext.Provider value={value}>{children}</PromoGateContext.Provider>;
}

export const usePromoGate = () => {
  const ctx = useContext(PromoGateContext);
  if (!ctx) throw new Error('usePromoGate must be used within PromoGateProvider');
  return ctx;
};
