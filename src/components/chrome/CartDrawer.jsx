import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useRegion } from '../../context/RegionContext.jsx';
import { computeCartTotals } from '../../services/pricing.js';
import ProductImage from '../ui/ProductImage.jsx';
import Button from '../ui/Button.jsx';

export default function CartDrawer() {
  const { items, open, setOpen, updateQty, remove } = useCart();
  const { countryCode, rates } = useRegion();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, setOpen]);

  const totals = computeCartTotals(items, countryCode, rates);

  return (
    <>
      <div className={`drawer-scrim ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className={`drawer ${open ? 'is-open' : ''}`} aria-label="Shopping bag" aria-hidden={!open}>
        <div className="drawer__head">
          <span className="drawer__title">Your bag {items.length > 0 && `· ${totals.lines.reduce((n, l) => n + l.qty, 0)}`}</span>
          <button className="drawer__close" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>Close</button>
        </div>

        <div className="drawer__body">
          {items.length === 0 ? (
            <div className="drawer__empty">
              <p>Your bag is empty.</p>
              <Button variant="outline" size="sm" onClick={() => { setOpen(false); navigate('/shop'); }}>Browse products</Button>
            </div>
          ) : (
            totals.lines.map((line) => {
              const { product, variant, qty, mode, price, lineAmount } = line;
              return (
                <div className="drawer__item" key={product.id + mode + JSON.stringify(variant)}>
                  <ProductImage product={product} color={variant?.color} className="drawer__thumb" ratio="1 / 1" />
                  <div className="drawer__meta">
                    <Link to={`/product/${product.slug}`} className="drawer__name" onClick={() => setOpen(false)}>{product.name}</Link>
                    <span className="drawer__variant">
                      {[variant?.color, variant?.size].filter(Boolean).join(' · ')}
                      {[variant?.color, variant?.size].filter(Boolean).length ? ' · ' : ''}
                      <em className={`mode-pill mode-pill--${mode}`}>{mode}</em>
                    </span>
                    <div className="drawer__qty">
                      <button onClick={() => updateQty(product.id, mode, variant, qty - 1)} aria-label="Decrease quantity">−</button>
                      <span>{qty}</span>
                      <button onClick={() => updateQty(product.id, mode, variant, qty + 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <div className="drawer__line">
                    <span>{price.status ? 'Soon' : totals.money(line.lineAmount)}</span>
                    <button className="drawer__remove" onClick={() => remove(product.id, mode, variant)}>Remove</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer__foot">
            <div className="drawer__row">
              <span>Subtotal</span><span>{totals.subtotalText}</span>
            </div>
            <div className="drawer__row drawer__row--muted">
              <span>{totals.logisticsLabel} (est.)</span>
              <span>{totals.shippingText}</span>
            </div>
            <Button block onClick={() => { setOpen(false); navigate('/checkout'); }}>
              Checkout · {totals.totalText}
            </Button>
            <button className="drawer__continue" onClick={() => { setOpen(false); navigate('/cart'); }}>View full bag</button>
          </div>
        )}
      </aside>
    </>
  );
}
