import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

const KEY = 'azraa.announce.dismissed';
const ROTATE_MS = 4200;

// Three provable messages only — no shipping-threshold claim, since no such
// policy exists yet (see the "still needs real data" note in CLAUDE.md).
const MESSAGES = [
  'Worldwide shipping available',
  'Discover the latest collection',
  'Wholesale partnerships available',
];

function dismissedAlready() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(dismissedAlready);
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    document.documentElement.toggleAttribute('data-announce-hidden', dismissed);
    try {
      localStorage.setItem(KEY, dismissed ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [dismissed]);

  useEffect(() => {
    if (dismissed || reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [dismissed, reduced]);

  if (dismissed) return null;

  return (
    <div className="announce" role="region" aria-label="Site announcements">
      <div className="announce__inner">
        <span className="announce__msg" key={index} aria-live="polite">
          {MESSAGES[index]}
        </span>
        <button
          type="button"
          className="announce__close"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement bar"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
