import { useEffect, useRef, useState } from 'react';
import { usePromoGate } from '../../context/PromoGateContext.jsx';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { PRODUCTS } from '../../data/products.js';
import { isStorefrontReady } from '../../services/catalog.js';
import ProductImage from '../ui/ProductImage.jsx';
import { PROMO_CODES } from '../../services/promotions.js';

const SHOW_AFTER_MS = 6000; // 5-8s window from the spec
const CODE = 'WELCOME10';

function editorialProduct() {
  const ready = PRODUCTS.filter(isStorefrontReady);
  return (ready.find((p) => p.featured) || ready[0]) ?? null;
}

export default function WelcomeOfferPopup() {
  const { armed, markInterrupted } = usePromoGate();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const trapRef = useFocusTrap(visible);
  const product = useRef(editorialProduct()).current;

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => {
      setVisible(true);
      markInterrupted();
    }, SHOW_AFTER_MS);
    return () => clearTimeout(t);
  }, [armed, markInterrupted]);

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

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable, the code is shown as plain text either way */
    }
  };

  return (
    <div className="promo-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-offer-title">
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
          <h2 id="welcome-offer-title" className="promo-modal__title">Welcome to AZRAA</h2>

          {unlocked ? (
            <>
              <p className="promo-modal__lede">
                {PROMO_CODES[CODE].percent}% off your first retail order. Enter this
                code at checkout.
              </p>
              <button type="button" className="promo-modal__code" onClick={copyCode}>
                <span>{CODE}</span>
                <em>{copied ? 'Copied' : 'Copy'}</em>
              </button>
              <p className="promo-modal__fine">Retail orders only, no minimum spend, one use per email.</p>
            </>
          ) : (
            <form onSubmit={unlock}>
              <p className="promo-modal__lede">
                {PROMO_CODES[CODE].percent}% off your first retail order. Tell us
                where to send it.
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
              <button type="submit" className="promo-modal__cta">Unlock My Offer</button>
              <p className="promo-modal__fine">Retail orders only, no minimum spend, one use per email.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
