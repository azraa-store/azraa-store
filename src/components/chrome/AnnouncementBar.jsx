import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

const KEY = 'azraa.announce.dismissed';

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
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    document.documentElement.toggleAttribute('data-announce-hidden', dismissed);
    try {
      localStorage.setItem(KEY, dismissed ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [dismissed]);

  if (dismissed) return null;

  // A ticker strip, like a filling-station LED sign: the message list is
  // rendered twice back to back and scrolled left exactly one strip-width,
  // which loops seamlessly (CSS only, no measuring needed).
  const strip = (
    <span className="announce__strip">
      {MESSAGES.map((m, i) => (
        <span className="announce__item" key={i}>{m}</span>
      ))}
    </span>
  );

  return (
    <div className="announce" role="region" aria-label="Site announcements">
      <div className="announce__inner">
        {reduced ? (
          <span className="announce__msg">{MESSAGES.join(' · ')}</span>
        ) : (
          <div className="announce__track" aria-hidden="true">
            {strip}
            {strip}
          </div>
        )}
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
