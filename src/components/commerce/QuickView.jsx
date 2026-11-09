import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuickView } from '../../context/QuickViewContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { availability, availabilityLabel } from '../../services/inventory.js';
import ProductImage from '../ui/ProductImage.jsx';
import Price from '../ui/Price.jsx';
import Button from '../ui/Button.jsx';

export default function QuickView() {
  const { product, open, hide } = useQuickView();
  const { add } = useCart();
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);
  const trapRef = useFocusTrap(open);

  useEffect(() => {
    if (!product) return;
    setColor(product.colors?.[0]?.name || null);
    setSize(product.sizes?.[0]?.label || null);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && hide();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, hide]);

  if (!open || !product) return null;

  const hasColors = product.colors?.length > 0;
  const hasSizes = product.sizes?.length > 0;
  const avail = availability(product, color, size);
  const soldOut = avail === 'out';
  const needsSize = hasSizes && !size;

  const addToBag = () => {
    if (soldOut || needsSize) return;
    const variant = hasSizes || hasColors ? { size, color } : null;
    add(product.id, { qty: 1, mode: 'retail', variant });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="promo-modal quickview" role="dialog" aria-modal="true" aria-labelledby="quickview-title">
      <div className="promo-modal__scrim" onClick={hide} aria-hidden="true" />
      <div className="promo-modal__panel quickview__panel" ref={trapRef} tabIndex={-1}>
        <button type="button" className="promo-modal__close" onClick={hide} aria-label="Close">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="promo-modal__media">
          <ProductImage product={product} color={color} ratio="4 / 5" priority />
        </div>

        <div className="promo-modal__body quickview__body">
          <span className="label">{product.subcategory}</span>
          <h2 id="quickview-title" className="quickview__name">{product.name}</h2>
          <Price product={product} mode="retail" className="quickview__price" />
          {avail !== 'unknown' && <p className={`pdp__stock pdp__stock--${avail}`}>{availabilityLabel(avail)}</p>}
          <p className="quickview__summary">{product.summary}</p>

          {hasColors && (
            <div className="pdp__opt">
              <span className="pdp__opt-label">Colour · <strong>{color}</strong></span>
              <div className="swatches">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    className={`swatch ${color === c.name ? 'is-on' : ''}`}
                    style={{ '--sw': c.hex }}
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                    onClick={() => setColor(c.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {hasSizes && (
            <div className="pdp__opt">
              <span className="pdp__opt-label">Size{size && <> · <strong>{size}</strong></>}</span>
              <div className="sizes">
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    className={`size ${size === s.label ? 'is-on' : ''}`}
                    disabled={availability(product, color, s.label) === 'out'}
                    aria-pressed={size === s.label}
                    onClick={() => setSize(s.label)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button onClick={addToBag} disabled={soldOut || needsSize} block>
            {soldOut ? 'Out of stock' : needsSize ? 'Select a size' : added ? 'Added ✓' : 'Add to bag'}
          </Button>
          <Link to={`/product/${product.slug}`} onClick={hide} className="quickview__full">
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
}
