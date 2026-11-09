import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useWishlist } from '../../context/WishlistContext.jsx';

const AUTO_DISMISS_MS = 6000;

/** One-time guest nudge, not a gate — saving still works without an account. */
export default function WishlistNudge() {
  const { nudge, dismissNudge } = useWishlist();

  useEffect(() => {
    if (!nudge) return;
    const t = setTimeout(dismissNudge, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [nudge, dismissNudge]);

  if (!nudge) return null;

  return (
    <div className="wish-nudge" role="status">
      <span>Saved. <Link to="/sign-in" onClick={dismissNudge}>Sign in</Link> to keep your wishlist across devices.</span>
      <button type="button" onClick={dismissNudge} aria-label="Dismiss">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}
