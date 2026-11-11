// A soft, client-only submit cooldown for forms with no real backend to
// rate-limit (contact, wholesale enquiry, newsletter). This is a UX
// deterrent against accidental double-submits and casual spam-refreshing,
// not real abuse prevention — a determined bot clears localStorage in one
// line. Real rate limiting needs a server; see CLAUDE.md for where that
// stands.

const KEY = 'azraa.submitThrottle';

function readAll() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

/** Seconds remaining before `formId` can submit again, 0 if clear to submit. */
export function cooldownRemaining(formId) {
  const last = readAll()[formId];
  if (!last) return 0;
  const elapsed = Date.now() - last;
  const windowMs = 60_000;
  return elapsed >= windowMs ? 0 : Math.ceil((windowMs - elapsed) / 1000);
}

export function markSubmitted(formId) {
  const all = readAll();
  all[formId] = Date.now();
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
