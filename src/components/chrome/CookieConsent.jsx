import { useState } from 'react';
import { getConsent, acceptAll, rejectNonEssential, setConsent } from '../../services/consent.js';

export default function CookieConsent() {
  const [decided, setDecided] = useState(() => Boolean(getConsent()));
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (decided) return null;

  const savePrefs = () => {
    setConsent({ analytics, marketing });
    setDecided(true);
  };

  return (
    <div className="cookie-bar" role="region" aria-label="Cookie preferences">
      <div className="cookie-bar__inner">
        {prefsOpen ? (
          <>
            <div className="cookie-bar__prefs">
              <label className="cookie-bar__toggle">
                <input type="checkbox" checked disabled />
                Essential — always on, the site can't function without these
              </label>
              <label className="cookie-bar__toggle">
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                Analytics — none run on this site yet
              </label>
              <label className="cookie-bar__toggle">
                <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                Marketing — none run on this site yet
              </label>
            </div>
            <div className="cookie-bar__actions">
              <button type="button" className="cookie-bar__btn cookie-bar__btn--primary" onClick={savePrefs}>
                Save preferences
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="cookie-bar__text">
              We use essential cookies to run this site. We'd also like to use
              optional cookies for analytics and marketing — you can change
              this anytime.
            </p>
            <div className="cookie-bar__actions">
              <button type="button" className="cookie-bar__btn" onClick={() => setPrefsOpen(true)}>
                Preferences
              </button>
              <button type="button" className="cookie-bar__btn" onClick={() => { rejectNonEssential(); setDecided(true); }}>
                Reject non-essential
              </button>
              <button type="button" className="cookie-bar__btn cookie-bar__btn--primary" onClick={() => { acceptAll(); setDecided(true); }}>
                Accept all
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
