import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

// Three provable messages only — no shipping-threshold claim, since no such
// policy exists yet (see the "still needs real data" note in CLAUDE.md).
const MESSAGES = [
  'Worldwide shipping available',
  'Discover the latest collection',
  'Wholesale partnerships available',
];

export default function AnnouncementBar() {
  const reduced = usePrefersReducedMotion();

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
      </div>
    </div>
  );
}
