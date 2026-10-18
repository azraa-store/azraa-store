import { useEffect, useRef } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
export const isTurnstileConfigured = Boolean(SITE_KEY);

let scriptPromise = null;
function loadScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Renders a Cloudflare Turnstile widget and reports the verification token
 * up via onVerify (empty string on expiry/error, so the caller can disable
 * submit again). Renders nothing at all if VITE_TURNSTILE_SITE_KEY isn't
 * set, so forms using this work unchanged in local/dev without it, the same
 * mock-mode philosophy the payment providers already use when unconfigured.
 */
export default function Turnstile({ onVerify }) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    loadScript().then(() => {
      if (cancelled || !containerRef.current) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
        callback: (token) => onVerify(token),
        'expired-callback': () => onVerify(''),
        'error-callback': () => onVerify(''),
      });
    });
    return () => {
      cancelled = true;
      if (widgetId.current != null && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className="turnstile-widget" />;
}
