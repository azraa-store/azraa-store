// Live currency conversion. Rates are fetched from a keyless exchange-rate API,
// cached in localStorage with a TTL, and fall back to a dated snapshot if the
// network is unavailable (flagged `stale` so the UI can note it).
//
// The base is always USD. Product prices are stored in USD; this converts to the
// customer's display currency. The backend must revalidate the final charged
// amount before payment.

const CACHE_KEY = 'azraa.fx';
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const ENDPOINT = 'https://open.er-api.com/v6/latest/USD';

// Dated fallback snapshot (approximate, USD base). Used until live rates load,
// and if the API fails. Exported so the app never renders a null rate table.
export const SNAPSHOT = {
  date: '2026-01-01',
  rates: {
    USD: 1, INR: 90, NGN: 1600, GHS: 15.4, KES: 129, ZAR: 18.6,
    BDT: 118, AED: 3.67, GBP: 0.785, EUR: 0.92,
  },
};
export const SNAPSHOT_RATES = SNAPSHOT.rates;

let memo = null; // in-flight/last result within the session

function readCache() {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (raw && Date.now() - raw.fetchedAt < TTL_MS && raw.rates?.USD === 1) return raw;
  } catch {
    /* ignore */
  }
  return null;
}

function writeCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

/**
 * @returns {Promise<{ rates: Record<string,number>, fetchedAt: number, stale: boolean, source: string }>}
 */
export async function getRates() {
  if (memo) return memo;

  const cached = readCache();
  if (cached) {
    memo = Promise.resolve({ ...cached, stale: false, source: 'cache' });
    return memo;
  }

  memo = (async () => {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(ENDPOINT, { signal: controller.signal });
      clearTimeout(t);
      const data = await res.json();
      if (data && data.result === 'success' && data.rates?.USD === 1) {
        const payload = { rates: data.rates, fetchedAt: Date.now() };
        writeCache(payload);
        return { ...payload, stale: false, source: 'live' };
      }
      throw new Error('bad payload');
    } catch {
      return {
        rates: SNAPSHOT.rates,
        fetchedAt: Date.now(),
        stale: true,
        source: `snapshot:${SNAPSHOT.date}`,
      };
    }
  })();

  return memo;
}

/** Convert a USD amount into `currency` using a rates map from getRates(). */
export function convertFromUSD(usd, currency, rates) {
  if (typeof usd !== 'number') return null;
  const rate = rates?.[currency];
  if (!rate) return usd; // unknown currency -> show USD figure
  return usd * rate;
}

/** Sensible display rounding per currency. */
export function roundForCurrency(amount, currency) {
  const zeroDecimal = ['INR', 'NGN', 'KES', 'BDT'];
  if (zeroDecimal.includes(currency)) return Math.round(amount);
  return Math.round(amount * 100) / 100;
}
