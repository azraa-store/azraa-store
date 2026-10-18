import { useEffect, useMemo, useRef, useState } from 'react';
import { PHONE_COUNTRIES } from '../../data/phoneCountries.js';

/**
 * Flag + dial-code picker for the sign-up phone field. A custom button+panel
 * dropdown rather than a native <select> — flag emoji don't render inside
 * native <option> elements on Windows Chrome/Edge (falls back to the plain
 * ISO code), but render fine in ordinary text, which is what this uses.
 * Mirrors components/chrome/CountryPicker.jsx's structure; adds a search box
 * since this list is ~250 countries, not 9.
 */
export default function PhoneCountrySelect({ value, onChange, id }) {
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

  const current = PHONE_COUNTRIES.find((c) => c.code === value) || PHONE_COUNTRIES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHONE_COUNTRIES;
    return PHONE_COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q) || c.code.toLowerCase() === q
    );
  }, [query]);

  return (
    <div className="cpick phonecc" ref={ref}>
      <button
        type="button"
        id={id}
        className="cpick__toggle phonecc__toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Phone country: ${current.name}, ${current.dialCode}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="cpick__flag" aria-hidden="true">{current.flag}</span>
        <span className="cpick__cur">{current.dialCode}</span>
        <svg className="cpick__chevron" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="cpick__panel phonecc__panel" role="listbox" aria-label="Choose your country">
          <input
            ref={searchRef}
            type="text"
            className="input phonecc__search"
            placeholder="Search country or code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul>
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  className="cpick__row"
                  role="option"
                  aria-selected={c.code === value}
                  onClick={() => { onChange(c.code); setOpen(false); setQuery(''); }}
                >
                  <span className="cpick__flag" aria-hidden="true">{c.flag}</span>
                  <span className="cpick__name">{c.name}</span>
                  <span className="cpick__meta">{c.dialCode}</span>
                  {c.code === value && <span className="cpick__tick" aria-hidden="true">{'✓'}</span>}
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="phonecc__empty">No matches.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
