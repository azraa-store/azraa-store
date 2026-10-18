// Verifies a Turnstile token against azraa-backend's /api/turnstile/verify
// before accepting a sign-up/sign-in/enquiry/newsletter submission. Passes
// through as verified when the backend isn't configured, so forms work
// unchanged without it in local/dev (same mock-mode philosophy as the
// payment providers). Callers should only invoke this when
// isTurnstileConfigured (src/components/ui/Turnstile.jsx) is true, since an
// empty token is always rejected server-side.

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function verifyTurnstile(token) {
  if (!API_BASE) return true;
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/api/turnstile/verify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}
