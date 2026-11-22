import { Link } from 'react-router-dom';

/**
 * Compact trust signals at the point of purchase decision — shipping,
 * returns, payment and support were already documented in accordions/
 * footer links, but not visible where a buyer actually decides to pay.
 */
export default function TrustBadges({ mode = 'retail', className = '' }) {
  return (
    <ul className={`trust-badges ${className}`}>
      <li>
        <ShieldIcon />
        <span>Secure checkout, encrypted payment</span>
      </li>
      <li>
        <GlobeIcon />
        <span>Tracked delivery, worldwide</span>
      </li>
      <li>
        <ReturnIcon />
        <span>
          {mode === 'wholesale'
            ? 'Wholesale orders covered by your account terms'
            : 'Returns accepted within 14 days'}
        </span>
      </li>
      <li>
        <SupportIcon />
        <span><Link to="/contact">Real support</Link>, WhatsApp or email</span>
      </li>
    </ul>
  );
}

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 3.5 5 6v6c0 4.2 3 7.4 7 8.5 4-1.1 7-4.3 7-8.5V6l-7-2.5Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.3 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.3-3.8-8.5S9.5 5.8 12 3.5Z" />
  </svg>
);
const ReturnIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 10a8 8 0 1 1 1.8 6.4" />
    <path d="M4 5v5h5" />
  </svg>
);
const SupportIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 12a8 8 0 1 1 3 6.2L4 19l.9-2.9A7.96 7.96 0 0 1 4 12Z" />
  </svg>
);
