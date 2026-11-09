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
// Covers the currencies of the countries most likely to actually be picked;
// this is a fallback-only approximation (used only if the live API is also
// unreachable), not a pricing source — see the module note above. A currency
// missing here still displays correctly whenever the live rates load, which
// is the normal path; it only shows as a raw USD figure in the rare case
// both the live fetch and this snapshot miss it.
export const SNAPSHOT = {
  date: '2026-01-01',
  rates: {
    USD: 1, INR: 90, NGN: 1600, GHS: 15.4, KES: 129, ZAR: 18.6,
    BDT: 118, AED: 3.67, GBP: 0.785, EUR: 0.92,
    CNY: 7.3, JPY: 152, CAD: 1.38, AUD: 1.52, SGD: 1.34, CHF: 0.88,
    SEK: 10.6, NOK: 10.9, DKK: 6.9, PLN: 4.0, TRY: 35, BRL: 5.9,
    MXN: 20.3, ARS: 1050, THB: 34.5, VND: 25400, PHP: 58, IDR: 16200,
    MYR: 4.5, PKR: 279, EGP: 49, MAD: 10, TZS: 2500, UGX: 3750,
    ZMW: 27, RUB: 95, UAH: 41.5, ILS: 3.7, SAR: 3.75, QAR: 3.64,
    KWD: 0.31, BHD: 0.377, OMR: 0.385, JOD: 0.709, LKR: 300, NPR: 134,
    KRW: 1390, NZD: 1.67, XOF: 605, XAF: 605, XCD: 2.7, CZK: 23.3, HUF: 390,
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
