import { useEffect, useMemo, useRef, useState } from 'react';
import { useRegion } from '../../context/RegionContext.jsx';
import { PRIMARY_COUNTRIES, countriesByContinent, countryList } from '../../data/countries.js';

export default function CountryPicker({ align = 'right' }) {
  const { country, countryCode, setCountry } = useRegion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    searchRef.current?.focus();
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => { if (!open) setQuery(''); }, [open]);

  const groups = countriesByContinent();
  const primary = PRIMARY_COUNTRIES
    .map((code) => groups.flatMap((g) => g.countries).find((c) => c.code === code))
    .filter(Boolean);

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return null;
    return countryList()
      .filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q || c.currency.toLowerCase() === q)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [q]);

  const pick = (code) => { setCountry(code); setOpen(false); };

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
        <svg className={`cpick__chevron ${open ? 'is-open' : ''}`} viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="cpick__panel" role="listbox" aria-label="Choose your country">
          <p className="cpick__hint">
            Currency, prices, payment options and delivery update with your country.
          </p>
          <input
            ref={searchRef}
            type="text"
            className="input cpick__search"
            placeholder="Search country or currency"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="cpick__list">
            {matches ? (
              matches.length === 0 ? (
                <li className="cpick__empty">No matches.</li>
              ) : (
                matches.map((c) => (
                  <Row key={c.code} c={c} active={c.code === countryCode} onPick={() => pick(c.code)} />
                ))
              )
            ) : (
              <>
                {primary.map((c) => (
                  <Row key={c.code} c={c} active={c.code === countryCode} onPick={() => pick(c.code)} />
                ))}
                <li className="cpick__sep" aria-hidden="true" />
                {groups.map(({ continent, countries }) => {
                  const rest = countries.filter((c) => !PRIMARY_COUNTRIES.includes(c.code));
                  if (rest.length === 0) return null;
                  return (
                    <li key={continent} className="cpick__group">
                      <span className="cpick__group-label">{continent}</span>
                      <ul>
                        {rest.map((c) => (
                          <Row key={c.code} c={c} active={c.code === countryCode} onPick={() => pick(c.code)} />
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </>
            )}
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
