import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import Button from '../components/ui/Button.jsx';
import ProductImage from '../components/ui/ProductImage.jsx';
import ProductCard from '../components/commerce/ProductCard.jsx';
import Price from '../components/ui/Price.jsx';
import { getProductBySlug } from '../services/catalog.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useRegion } from '../context/RegionContext.jsx';
import { resolvePrice } from '../services/pricing.js';
import { LOGISTICS } from '../data/logistics.js';
import { availability, availabilityLabel } from '../services/inventory.js';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { currency, locale, rates } = useRegion();

  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [mode, setMode] = useState('retail');
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState('details');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setProduct(null); setNotFound(false); setAdded(false); setMode('retail'); setQty(1);
    getProductBySlug(slug).then((p) => {
      if (cancelled) return;
      if (!p) return setNotFound(true);
      setProduct(p);
      setColor(p.colors?.[0]?.name || null);
      setSize(p.sizes?.[0]?.label || null);
    });
    return () => { cancelled = true; };
  }, [slug]);

  const price = useMemo(
    () => (product ? resolvePrice(product, mode, currency, rates, locale) : null),
    [product, mode, currency, rates, locale]
  );
  const avail = useMemo(
    () => (product ? availability(product, color, size) : 'unknown'),
    [product, color, size]
  );

  if (notFound) {
    return (
      <div className="u-wrap page-narrow">
        <Seo title="Product not found" />
        <h1 className="page-title">Not found</h1>
        <p className="muted">We couldn’t find that product.</p>
        <div className="row-gap"><Button to="/shop" variant="outline">Back to shop</Button></div>
      </div>
    );
  }
  if (!product) return <div className="u-wrap page-narrow"><p className="muted">Loading…</p></div>;

  const hasSizes = product.sizes?.length > 0;
  const hasColors = product.colors?.length > 0;
  const soldOut = avail === 'out';
  const needsSize = hasSizes && !size;
  const moq = mode === 'wholesale' ? product.wholesale?.moq || 1 : 1;
  const effectiveQty = Math.max(qty, moq);
  const variant = hasSizes || hasColors ? { size, color } : null;

  const switchMode = (m) => {
    setMode(m);
    setQty(m === 'wholesale' ? Math.max(product.wholesale?.moq || 1, 1) : 1);
  };

  const addToCart = () => {
    if (soldOut || needsSize) return;
    add(product.id, { qty: effectiveQty, mode, variant });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };
  const buyNow = () => {
    if (soldOut || needsSize) return;
    add(product.id, { qty: effectiveQty, mode, variant });
    navigate('/checkout');
  };

  const logi = LOGISTICS[mode];

  return (
    <article className="pdp">
      <Seo title={product.name} description={product.summary} />
      <div className="u-wrap pdp__inner">
        <div className="pdp__media">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            <Link to="/shop">Shop</Link><span>/</span>
            <Link to={`/shop/${product.category}`}>{product.category}</Link>
          </nav>
          <div className={`pdp__frame ${product.hero ? 'pdp__frame--hero' : ''}`}>
            <ProductImage product={product} color={color} priority ratio="4 / 5" />
          </div>
          {product.images?.primary == null && (
            <p className="pdp__frame-note">
              Product photography is being finalised.
            </p>
          )}
        </div>

        <div className="pdp__info">
          <span className="label">{product.subcategory}</span>
          <div className="pdp__title-row">
            <h1 className="pdp__name">{product.name}</h1>
            <button
              type="button"
              className={`pdp__wish ${has(product.id) ? 'is-on' : ''}`}
              aria-label={has(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={has(product.id)}
              onClick={() => toggle(product.id)}
            >
              <svg viewBox="0 0 24 24" width="19" height="19" fill={has(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <path d="M12 20.3 4.6 13c-2-2-2-5.3 0-7.3 2-2 5.2-2 7.1 0l.3.3.3-.3c2-2 5.2-2 7.1 0 2 2 2 5.3 0 7.3L12 20.3Z" />
              </svg>
              {has(product.id) ? 'Saved' : 'Save'}
            </button>
          </div>

          <div className="pdp__price">
            <Price product={product} mode={mode} />
            <span className="pdp__unit">per {product.unit} · {mode}</span>
          </div>

          {avail !== 'unknown' && (
            <p className={`pdp__stock pdp__stock--${avail}`}>{availabilityLabel(avail)}</p>
          )}

          <p className="pdp__summary">{product.summary}</p>

          {/* Retail / Wholesale, both are a direct purchase */}
          <div className="pdp__opt">
            <span className="pdp__opt-label">Buy as · <strong>{mode === 'wholesale' ? 'Wholesale' : 'Retail'}</strong></span>
            <div className="mode-switch">
              <button className={mode === 'retail' ? 'is-on' : ''} onClick={() => switchMode('retail')}>
                Retail<em><Price product={product} mode="retail" /> / {product.unit}</em>
              </button>
              <button className={mode === 'wholesale' ? 'is-on' : ''} onClick={() => switchMode('wholesale')}>
                Wholesale<em><Price product={product} mode="wholesale" /> / {product.unit}</em>
              </button>
            </div>
            {mode === 'wholesale' && (
              <p className="pdp__moq">
                {product.wholesale?.unitHint || `Minimum ${moq} ${product.unit}s`}. Enter any
                quantity from {moq}, you pay the wholesale unit price and wholesale delivery.
              </p>
            )}
          </div>

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

          <div className="pdp__buy">
            <div className="qty">
              <button onClick={() => setQty(Math.max(moq, effectiveQty - 1))} aria-label="Decrease quantity">−</button>
              <input
                type="number" min={moq} value={effectiveQty}
                onChange={(e) => setQty(Math.max(moq, parseInt(e.target.value || String(moq), 10)))}
                aria-label="Quantity"
              />
              <button onClick={() => setQty(effectiveQty + 1)} aria-label="Increase quantity">+</button>
            </div>
            <Button onClick={addToCart} disabled={soldOut || needsSize} block>
              {soldOut ? 'Out of stock' : needsSize ? 'Select a size' : added ? 'Added ✓' : 'Add to bag'}
            </Button>
          </div>
          <Button onClick={buyNow} variant="outline" block disabled={soldOut || needsSize}>Buy now</Button>

          <div className="pdp__linesum">
            <span>{effectiveQty} × <Price product={product} mode={mode} /></span>
            <span>+ {logi.label} <Price usd={logi.usd} inr={logi.inr} /></span>
          </div>

          <div className="pdp__crossmode">
            {mode === 'retail' ? (
              <>Ordering in volume? <button className="link" onClick={() => switchMode('wholesale')}>
                Switch to wholesale</button>, <Price product={product} mode="wholesale" /> / {product.unit}
                {' '}from {product.wholesale?.moq} {product.unit}s.
              </>
            ) : (
              <>Just need a few? <button className="link" onClick={() => switchMode('retail')}>
                Switch to retail</button>, <Price product={product} mode="retail" /> / {product.unit}.
              </>
            )}
          </div>

          <p className="pdp__ship">
            {mode === 'wholesale' ? 'Wholesale' : 'Retail'} delivery{' '}
            (<Price usd={logi.usd} inr={logi.inr} />) to your region · see{' '}
            <Link to="/legal/shipping">delivery &amp; lead times</Link>.
            {mode === 'retail' && ' Returns within 14 days.'}
          </p>

          <div className="pdp__accordion">
            {[
              ['details', 'Details', product.details],
              ['fit', product.category === 'bags' || product.category === 'ladies' ? 'Dimensions & carry' : 'Fit & sizing', product.fit ? [product.fit] : ['One size.']],
              ['care', 'Care', product.care || []],
              ['ship', 'Shipping & returns', [
                `${mode === 'wholesale' ? 'Wholesale' : 'Retail'} delivery with tracked courier; lead times shown at checkout.`,
                mode === 'retail' ? 'Retail returns accepted within 14 days, unworn, tags on.' : 'Wholesale orders are covered by your account terms.',
                'Trade accounts (custom pricing, payment terms, standing orders) can be opened from the wholesale page.',
              ]],
            ].map(([key, label, lines]) => (
              <div className={`acc ${openSection === key ? 'is-open' : ''}`} key={key}>
                <button className="acc__head" onClick={() => setOpenSection(openSection === key ? '' : key)}>
                  <span>{label}</span><span aria-hidden="true">{openSection === key ? '–' : '+'}</span>
                </button>
                {openSection === key && (
                  <ul className="acc__body">{(lines || []).map((l, i) => <li key={i}>{l}</li>)}</ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {product.related?.length > 0 && (
        <section className="pdp__related u-wrap">
          <h2 className="hsec__title">You might also like</h2>
          <div className="grid grid--3">
            {product.related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </article>
  );
}
