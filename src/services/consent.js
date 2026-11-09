// Cookie/tracking consent. There is no analytics or tracking anywhere in
// this codebase today (confirmed: no GA/Segment/pixel, nothing reads these
// categories yet), so this is forward-looking infrastructure for whenever
// that's added, not a response to anything currently running.

const KEY = 'azraa.consent';

const DEFAULT_PREFS = { essential: true, analytics: false, marketing: false };

export function getConsent() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    return raw && typeof raw === 'object' ? { ...DEFAULT_PREFS, ...raw } : null;
  } catch {
    return null;
  }
}

export function setConsent(prefs) {
  const next = { ...DEFAULT_PREFS, ...prefs, essential: true, decidedAt: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export const acceptAll = () => setConsent({ analytics: true, marketing: true });
export const rejectNonEssential = () => setConsent({ analytics: false, marketing: false });

/** Whether a given category is allowed. Essential is always true. */
export function hasConsent(category) {
  if (category === 'essential') return true;
  return Boolean(getConsent()?.[category]);
}
