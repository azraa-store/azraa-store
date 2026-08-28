import { Link, useNavigate } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import Button from '../components/ui/Button.jsx';
import ProductImage from '../components/ui/ProductImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useRegion } from '../context/RegionContext.jsx';
import { computeCartTotals } from '../services/pricing.js';

export default function CartPage() {
  const { items, updateQty, remove } = useCart();
  const { countryCode, country, rates } = useRegion();
  const navigate = useNavigate();
  const totals = computeCartTotals(items, countryCode, rates);

  return (
    <div className="u-wrap page">
      <Seo title="Your bag" />
      <h1 className="page-title">Your bag</h1>

      {items.length === 0 ? (
        <div className="cartpage__empty">
          <p>Your bag is empty.</p>
          <div className="row-gap">
            <Button to="/shop">Shop products</Button>
            <Button to="/wholesale" variant="outline">Wholesale enquiry</Button>
          </div>
        </div>
      ) : (
        <div className="cartpage">
          <div className="cartpage__lines">
            {totals.lines.map((line) => {
              const { product, variant, qty, mode, price } = line;
              return (
                <div className="cline" key={product.id + mode + JSON.stringify(variant)}>
                  <Link to={`/product/${product.slug}`} className="cline__media">
                    <ProductImage product={product} color={variant?.color} ratio="1 / 1" />
                  </Link>
                  <div className="cline__main">
                    <Link to={`/product/${product.slug}`} className="cline__name">{product.name}</Link>
                    <p className="cline__meta">
                      {[variant?.color, variant?.size].filter(Boolean).join(' · ') || product.subcategory}
                      {' · '}<em className={`mode-pill mode-pill--${mode}`}>{mode}</em>
                    </p>
                    <p className="cline__unit">
                      {price.status ? 'Price on request' : `${price.formatted} / ${product.unit}`}
                    </p>
                    <button className="cline__remove" onClick={() => remove(product.id, mode, variant)}>Remove</button>
                  </div>
                  <div className="cline__right">
                    <div className="qty qty--sm">
                      <button onClick={() => updateQty(product.id, mode, variant, qty - 1)} aria-label="Decrease">−</button>
                      <span>{qty}</span>
                      <button onClick={() => updateQty(product.id, mode, variant, qty + 1)} aria-label="Increase">+</button>
                    </div>
                    <span className="cline__total">{price.status ? '—' : totals.money(line.lineAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="cartpage__summary">
            <h2 className="summary__title">Summary</h2>
            <dl className="summary__rows">
              <div><dt>Subtotal</dt><dd>{totals.subtotalText}</dd></div>
              <div>
                <dt>{totals.logisticsLabel} to {country.name}</dt>
                <dd>{totals.shippingText}</dd>
              </div>
              <div><dt>{totals.taxLabel} ({Math.round(totals.taxRate * 100)}%)</dt><dd>{totals.taxText}</dd></div>
              <div className="summary__total"><dt>Total</dt><dd>{totals.totalText}</dd></div>
            </dl>
            <p className="summary__note">
              Prices in {totals.currency}. {totals.currency === 'INR'
                ? 'Shown at our listed rupee prices.'
                : 'Converted from our USD reference at current rates.'}{' '}
              The exact charge is confirmed at payment.
            </p>
            <Button block onClick={() => navigate('/checkout')}>Proceed to checkout</Button>
            <Link to="/shop" className="summary__continue">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
