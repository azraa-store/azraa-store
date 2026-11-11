import { useEffect, useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';

export default function SizeGuideModal({ chart, onClose }) {
  const [unit, setUnit] = useState('cm');
  const trapRef = useFocusTrap(true);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="sizeguide" role="dialog" aria-modal="true" aria-labelledby="sizeguide-title">
      <div className="sizeguide__scrim" onClick={onClose} aria-hidden="true" />
      <div className="sizeguide__panel" ref={trapRef} tabIndex={-1}>
        <button type="button" className="sizeguide__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <h2 id="sizeguide-title" className="sizeguide__title">{chart.title} size guide</h2>

        {chart.kind === 'measurements' && (
          <div className="sizeguide__unit">
            <button className={unit === 'cm' ? 'is-on' : ''} onClick={() => setUnit('cm')}>cm</button>
            <button className={unit === 'in' ? 'is-on' : ''} onClick={() => setUnit('in')}>in</button>
          </div>
        )}

        <table className="sizeguide__table">
          <thead>
            <tr>
              <th>Size</th>
              {chart.columns.map((c) => <th key={c}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => (
              <tr key={row.size}>
                <td>{row.size}</td>
                {chart.kind === 'measurements'
                  ? row[unit].map((v, i) => <td key={i}>{v}</td>)
                  : row.values.map((v, i) => <td key={i}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="sizeguide__fine">
          A general guide — individual fit may vary slightly by style. See each product's
          "Fit &amp; sizing" note for specifics.
        </p>
      </div>
    </div>
  );
}
