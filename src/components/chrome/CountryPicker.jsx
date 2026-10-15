import { useEffect, useRef, useState } from 'react';
import { useRegion } from '../../context/RegionContext.jsx';
import { PRIMARY_COUNTRIES, countryList } from '../../data/countries.js';

export default function CountryPicker({ align = 'right' }) {
  const { country, countryCode, setCountry } = useRegion();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const all = countryList();
  const primary = PRIMARY_COUNTRIES.map((c) => all.find((x) => x.code === c)).filter(Boolean);
  const rest = all
    .filter((c) => !PRIMARY_COUNTRIES.includes(c.code))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={`cpick cpick--${align}`} ref={ref}>
      <button
        className="cpick__toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Region: ${country.name}, ${country.currency}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="cpick__flag" aria-hidden="true">{country.flag}</span>
        <span className="cpick__cur">{country.currency}</span>
        <svg className="cpick__chevron" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="cpick__panel" role="listbox" aria-label="Choose your country">
          <p className="cpick__hint">
            Currency, prices, payment options and delivery update with your country.
          </p>
          <ul>
            {primary.map((c) => (
              <Row key={c.code} c={c} active={c.code === countryCode} onPick={() => { setCountry(c.code); setOpen(false); }} />
            ))}
            <li className="cpick__sep" aria-hidden="true" />
            {rest.map((c) => (
              <Row key={c.code} c={c} active={c.code === countryCode} onPick={() => { setCountry(c.code); setOpen(false); }} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Row({ c, active, onPick }) {
  return (
    <li>
      <button className="cpick__row" role="option" aria-selected={active} onClick={onPick}>
        <span className="cpick__flag" aria-hidden="true">{c.flag}</span>
        <span className="cpick__name">{c.name}</span>
        <span className="cpick__meta">{c.currency}</span>
        {active && <span className="cpick__tick" aria-hidden="true">✓</span>}
      </button>
    </li>
  );
}
