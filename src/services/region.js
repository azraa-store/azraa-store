// Country detection. Order of preference:
//   1. explicit user choice (persisted)          -> handled by RegionContext
//   2. IP geolocation (best-effort, short timeout)
//   3. browser locale region
//   4. default country
//
// The user can always override in the header / checkout, detection never locks.

import { COUNTRIES, DEFAULT_COUNTRY } from '../data/countries.js';

const STORAGE_KEY = 'azraa.country';

export function getStoredCountry() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && COUNTRIES[v] ? v : null;
  } catch {
    return null;
  }
}

export function storeCountry(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignore */
  }
}

function localeCountry() {
  try {
    const langs = navigator.languages || [navigator.language || ''];
    for (const l of langs) {
      const m = /[-_]([A-Z]{2})$/i.exec(l);
      if (m) {
        const cc = m[1].toUpperCase();
        if (COUNTRIES[cc]) return cc;
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

// Keyless, CORS-open IP->country endpoints, tried in order. In production,
// prefer resolving country at the edge/CDN and passing it in, this avoids
// CORS, ad-blockers and latency entirely.
const IP_ENDPOINTS = [
  { url: 'https://api.country.is/', pick: (d) => d.country },
  { url: 'https://ipwho.is/?fields=country_code', pick: (d) => d.country_code },
];

async function ipCountry(signal) {
  for (const ep of IP_ENDPOINTS) {
    try {
      const res = await fetch(ep.url, { signal });
      if (!res.ok) continue;
      const data = await res.json();
      const cc = String(ep.pick(data) || '').toUpperCase();
      if (!cc) continue;
      return COUNTRIES[cc] ? cc : { supported: false, cc };
    } catch {
      /* try next */
    }
  }
  return null;
}

/**
 * @returns {Promise<{ code: string, method: 'ip'|'locale'|'default', detectedRaw?: string }>}
 */
export async function detectCountry() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  try {
    const ip = await ipCountry(controller.signal);
    clearTimeout(timer);
    if (typeof ip === 'string') return { code: ip, method: 'ip' };
    if (ip && ip.supported === false) {
      // detected a real country we don't price yet -> International, but remember it
      const loc = localeCountry();
      if (loc) return { code: loc, method: 'locale', detectedRaw: ip.cc };
      return { code: 'ROW', method: 'ip', detectedRaw: ip.cc };
    }
  } catch {
    clearTimeout(timer);
  }

  const loc = localeCountry();
  if (loc) return { code: loc, method: 'locale' };
  return { code: DEFAULT_COUNTRY, method: 'default' };
}

/**
 * Precise, permission-gated location. Only runs if the visitor explicitly asks.
 * Never called automatically. Reverse-geocodes via a keyless CORS-open service.
 * @returns {Promise<{ code:string, method:'geo'|'geo-unsupported'|'geo-denied'|'geo-fallback', raw?:string }>}
 */
export function geolocateCountry() {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve({ code: 'ROW', method: 'geo-unsupported' });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}`
          );
          const data = await res.json();
          const cc = String(data.countryCode || '').toUpperCase();
          if (COUNTRIES[cc]) return resolve({ code: cc, method: 'geo' });
          return resolve({ code: 'ROW', method: 'geo-fallback', raw: cc });
        } catch {
          resolve({ code: 'ROW', method: 'geo-fallback' });
        }
      },
      () => resolve({ code: 'ROW', method: 'geo-denied' }),
      { timeout: 8000, maximumAge: 600000 }
    );
  });
}
