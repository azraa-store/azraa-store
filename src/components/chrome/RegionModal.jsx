import { useState } from 'react';
import { useRegion } from '../../context/RegionContext.jsx';
import { COUNTRIES, countriesByContinent } from '../../data/countries.js';
import HeroWordmark from '../home/HeroWordmark.jsx';

/** First-visit welcome. Never blocks, visitors can skip and use USD. */
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
        <span className="rmodal__mark"><HeroWordmark /><span className="u-visually-hidden">AZRAA</span></span>
        <h2 id="rmodal-title" className="rmodal__title">Set your country</h2>
        <p className="rmodal__lede">
          Prices and payment options switch to match it automatically.
          Change this any time from the header.
        </p>

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
              {countriesByContinent().map(({ continent, countries }) => (
                <optgroup key={continent} label={continent}>
                  {countries.map((c) => <option key={c.code} value={c.code}>{c.name}, {c.currency}</option>)}
                </optgroup>
              ))}
            </select>
          </label>
        )}

        <div className="rmodal__actions">
          <button className="rmodal__detect" onClick={detect} disabled={detecting}>
            {detecting ? 'Detecting…' : 'Detect my country'}
          </button>
          {!showAll && <button className="rmodal__more" onClick={() => setShowAll(true)}>Choose my country</button>}
          <button className="rmodal__skip" onClick={dismissWelcome}>Continue in USD</button>
        </div>
      </div>
    </div>
  );
}
