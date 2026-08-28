import { useState } from 'react';
import { useRegion } from '../../context/RegionContext.jsx';
import { COUNTRIES, countryList } from '../../data/countries.js';

/** First-visit welcome. Never blocks — visitors can skip and use USD. */
export default function RegionModal() {
  const { showWelcome, setCountry, dismissWelcome, runDetect } = useRegion();
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  if (!showWelcome) return null;

  const detect = async () => {
    setDetecting(true);
    const code = await runDetect();
    setDetecting(false);
    setDetected(code || 'ROW');
  };

  return (
    <div className="rmodal" role="dialog" aria-modal="true" aria-labelledby="rmodal-title">
      <div className="rmodal__scrim" onClick={dismissWelcome} />
      <div className="rmodal__panel">
        <span className="rmodal__mark">AZRAA</span>
        <h2 id="rmodal-title" className="rmodal__title">Choose your region</h2>
        <p className="rmodal__lede">
          We’ll show prices, delivery and payment options for where you shop.
          Prices are shown in USD by default — you can change this any time.
        </p>

        <div className="rmodal__grid">
          <button className="rmodal__region" onClick={() => setCountry('IN')}>
            <span className="rmodal__flag">🇮🇳</span>
            <span>India</span><small>₹ INR</small>
          </button>
          <button className="rmodal__region" onClick={() => setCountry('NG')}>
            <span className="rmodal__flag">🇳🇬</span>
            <span>Nigeria</span><small>₦ NGN</small>
          </button>
          <button className="rmodal__region" onClick={() => setCountry('US')}>
            <span className="rmodal__flag">🌍</span>
            <span>Other</span><small>$ USD</small>
          </button>
        </div>

        {detected && (
          <p className="rmodal__detected">
            Looks like you’re in <strong>{COUNTRIES[detected]?.name || 'another country'}</strong>.{' '}
            {COUNTRIES[detected] && detected !== 'ROW' ? (
              <button className="link" onClick={() => setCountry(detected)}>Use {COUNTRIES[detected].name}</button>
            ) : (
              <button className="link" onClick={() => setCountry('US')}>Shop in USD</button>
            )}
          </p>
        )}

        {showAll && (
          <label className="rmodal__all">
            <span>Or pick a country</span>
            <select className="input input--select" defaultValue="" onChange={(e) => e.target.value && setCountry(e.target.value)}>
              <option value="" disabled>Select…</option>
              {countryList().map((c) => <option key={c.code} value={c.code}>{c.name} — {c.currency}</option>)}
            </select>
          </label>
        )}

        <div className="rmodal__actions">
          <button className="rmodal__detect" onClick={detect} disabled={detecting}>
            {detecting ? 'Detecting…' : 'Detect my region'}
          </button>
          {!showAll && <button className="rmodal__more" onClick={() => setShowAll(true)}>All countries</button>}
          <button className="rmodal__skip" onClick={dismissWelcome}>Skip</button>
        </div>
      </div>
    </div>
  );
}
