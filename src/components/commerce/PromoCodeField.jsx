import { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { validatePromoCode } from '../../services/promotions.js';

/** Shared promo-code entry, used in both the cart drawer and the full cart page. */
export default function PromoCodeField({ orderMode }) {
  const { promo, applyPromo, clearPromo } = useCart();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  if (promo) {
    return (
      <div className="promo-field promo-field--applied">
        <span>Code <strong>{promo.code}</strong> applied · {promo.percent}% off</span>
        <button type="button" onClick={clearPromo}>Remove</button>
      </div>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    const result = validatePromoCode(code, { orderMode });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    applyPromo(result.code, result.percent);
    setError(null);
    setCode('');
  };

  return (
    <form className="promo-field" onSubmit={submit}>
      <div className="promo-field__row">
        <input
          type="text"
          placeholder="Promo code"
          aria-label="Promo code"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(null); }}
          className="input promo-field__input"
        />
        <button type="submit" className="promo-field__apply" disabled={!code.trim()}>Apply</button>
      </div>
      {error && <p className="promo-field__error">{error}</p>}
    </form>
  );
}
