import { useEffect, useState } from 'react';
import { useRegion } from '../../context/RegionContext.jsx';

/** Quiet, self-dismissing note if we had to fall back to a dated FX snapshot. */
export default function FxNote() {
  const { ratesInfo, currency } = useRegion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (ratesInfo?.stale && currency !== 'USD') {
      setShow(true);
      const t = setTimeout(() => setShow(false), 9000);
      return () => clearTimeout(t);
    }
  }, [ratesInfo, currency]);

  if (!show) return null;
  return (
    <div className="fxnote" role="status">
      Live exchange rates are unavailable — {currency} prices use a recent snapshot.
      Your card is charged the exact local amount at checkout.
      <button onClick={() => setShow(false)} aria-label="Dismiss">×</button>
    </div>
  );
}
