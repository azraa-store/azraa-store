import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { COUNTRIES, DEFAULT_COUNTRY, getCountry } from '../data/countries.js';
import { detectCountry, getStoredCountry, storeCountry } from '../services/region.js';
import { getRates, SNAPSHOT_RATES } from '../services/fx.js';

const RegionContext = createContext(null);
const WELCOMED_KEY = 'azraa.welcomed';

export function RegionProvider({ children }) {
  const stored = typeof window !== 'undefined' ? getStoredCountry() : null;
  const welcomed = (() => {
    try { return localStorage.getItem(WELCOMED_KEY) === '1'; } catch { return false; }
  })();

  const [code, setCode] = useState(stored || DEFAULT_COUNTRY);
  const [showWelcome, setShowWelcome] = useState(!stored && !welcomed);
  // Seed with the snapshot synchronously so prices never render against a null
  // rate table; live rates replace this within a moment.
  const [rates, setRates] = useState(SNAPSHOT_RATES);
  const [ratesInfo, setRatesInfo] = useState({ stale: false, source: 'loading' });

  // Load exchange rates once (cached in localStorage by the service).
  useEffect(() => {
    let alive = true;
    getRates().then((r) => {
      if (!alive) return;
      setRates(r.rates);
      setRatesInfo({ stale: r.stale, source: r.source, fetchedAt: r.fetchedAt });
    });
    return () => { alive = false; };
  }, []);

  const markWelcomed = () => {
    try { localStorage.setItem(WELCOMED_KEY, '1'); } catch { /* ignore */ }
  };

  const setCountry = useCallback((next) => {
    if (!COUNTRIES[next]) return;
    setCode(next);
    storeCountry(next);
    markWelcomed();
    setShowWelcome(false);
  }, []);

  const dismissWelcome = useCallback(() => {
    markWelcomed();
    setShowWelcome(false);
  }, []);

  // Best-effort detection used only to *suggest* inside the welcome modal.
  const [suggested, setSuggested] = useState(null);
  const runDetect = useCallback(async () => {
    const res = await detectCountry();
    if (res.code && COUNTRIES[res.code]) {
      setSuggested(res.code);
      return res.code;
    }
    return null;
  }, []);

  const country = getCountry(code);

  const value = useMemo(
    () => ({
      countryCode: code,
      country,
      currency: country.currency,
      locale: country.locale,
      rates,
      ratesInfo,
      ratesReady: Boolean(rates),
      setCountry,
      showWelcome,
      dismissWelcome,
      runDetect,
      suggested,
    }),
    [code, country, rates, ratesInfo, setCountry, showWelcome, dismissWelcome, runDetect, suggested]
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export const useRegion = () => {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error('useRegion must be used within RegionProvider');
  return ctx;
};
