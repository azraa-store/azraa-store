import { useEffect, useRef, useState } from 'react';
import { usePromoGate } from '../../context/PromoGateContext.jsx';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { PRODUCTS } from '../../data/products.js';
import { isStorefrontReady } from '../../services/catalog.js';
import ProductImage from '../ui/ProductImage.jsx';
import { PROMO_CODES } from '../../services/promotions.js';

const ARM_AFTER_MS = 3000; // don't fire in the first few seconds of a visit
const CODE = 'WELCOME10';

function editorialProduct() {
  const ready = PRODUCTS.filter(isStorefrontReady);
  return (ready.find((p) => p.featured) || ready[0]) ?? null;
}

/**
 * Desktop-only — a touch device has no reliable "leaving the page" cursor
 * signal, and the spec is explicit this should display only when
 * appropriate. Shares PromoGateContext with the Welcome Offer popup so the
 * two can never both interrupt the same session; in practice that means
 * this only has a chance to fire if the visitor leaves before the Welcome
 * Offer's own 5-8s timer does.
 */
export default function ExitIntentPopup() {
  const { armed, markInterrupted } = usePromoGate();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const trapRef = useFocusTrap(visible);
  const product = useRef(editorialProduct()).current;
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  useEffect(() => {
    if (!armed || isTouch) return;
    let ready = false;
    const armTimer = setTimeout(() => { ready = true; }, ARM_AFTER_MS);

    const onLeave = (e) => {
      if (!ready || e.clientY > 0) return;
      setVisible(true);
      markInterrupted();
    };
    document.addEventListener('mouseleave', onLeave);
    return () => {
      clearTimeout(armTimer);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [armed, isTouch, markInterrupted]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => e.key === 'Escape' && setVisible(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible || !product) return null;

  const unlock = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) return;
    setUnlocked(true);
  };

  return (
    <div className="promo-modal" role="dialog" aria-modal="true" aria-labelledby="exit-intent-title">
      <div className="promo-modal__scrim" onClick={() => setVisible(false)} aria-hidden="true" />
      <div className="promo-modal__panel" ref={trapRef} tabIndex={-1}>
        <button type="button" className="promo-modal__close" onClick={() => setVisible(false)} aria-label="Close">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="promo-modal__media">
          <ProductImage product={product} ratio="4 / 5" />
        </div>

        <div className="promo-modal__body">
          <span className="promo-modal__mark">AZRAA</span>
          <h2 id="exit-intent-title" className="promo-modal__title">Before you go</h2>

          {unlocked ? (
            <>
              <p className="promo-modal__lede">
                {PROMO_CODES[CODE].percent}% off your first retail order. Enter this
                code at checkout.
              </p>
              <div className="promo-modal__code"><span>{CODE}</span></div>
              <p className="promo-modal__fine">Retail orders only, no minimum spend, one use per email.</p>
            </>
          ) : (
            <form onSubmit={unlock}>
              <p className="promo-modal__lede">
                Here's {PROMO_CODES[CODE].percent}% off your first retail order,
                if you'd like it.
              </p>
              <input
                type="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="promo-modal__input"
              />
              <button type="submit" className="promo-modal__cta">Get my code</button>
              <p className="promo-modal__fine">Retail orders only, no minimum spend, one use per email.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
