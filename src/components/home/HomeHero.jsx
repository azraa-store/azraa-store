import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import ProductImage from '../ui/ProductImage.jsx';
import { PRODUCTS } from '../../data/products.js';
import { isStorefrontReady } from '../../services/catalog.js';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

/**
 * The hero is the full editorial product photograph (assets/hero.png, prepped to
 * a clean 4K by scripts/process-hero.py). It is shown complete and uncropped,
 * every garment, bag and shoe in frame, with the AZRAA copy set over the open
 * marble counter on the left.
 */
function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 12h16" /><path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function HeroCopy() {
  return (
    <div className="home-hero__copy">
      <p className="home-hero__eyebrow">Est. supply, worldwide</p>
      <h1 className="home-hero__word">AZRAA</h1>
      <p className="home-hero__tag">Wholesale. Retail.<br />Shipping worldwide.</p>
      <div className="home-hero__cta">
        <Button to="/shop" size="lg">Shop Retail <Arrow /></Button>
        <Button to="/wholesale" size="lg" variant="outline">Explore Wholesale <Arrow /></Button>
      </div>
    </div>
  );
}

const ROTATE_MS = 4200;

/**
 * A small cycling showcase of real, in-stock product photography that fades
 * in after the main photograph has settled. Deliberately a corner card, not
 * a takeover: the full uncropped range photo stays the hero, this only adds
 * a second, lighter point of movement once the page has loaded.
 */
function HeroLookbook() {
  const reduced = usePrefersReducedMotion();
  const items = useMemo(() => {
    const ready = PRODUCTS.filter(isStorefrontReady);
    const featured = ready.filter((p) => p.featured);
    return (featured.length >= 3 ? featured : ready).slice(0, 6);
  }, []);
  const [index, setIndex] = useState(0);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 650);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduced, items.length]);

  if (items.length === 0) return null;
  const product = items[index];

  return (
    <div className={`home-hero__lookbook ${settled ? 'is-in' : ''}`}>
      <span className="home-hero__lookbook-label">New in</span>
      <Link to={`/product/${product.slug}`} className="home-hero__lookbook-card">
        <ProductImage
          key={product.id}
          product={product}
          ratio="4 / 5"
          className="home-hero__lookbook-img"
          sizes="180px"
        />
        <span className="home-hero__lookbook-name">{product.name}</span>
      </Link>
      {items.length > 1 && (
        <div className="home-hero__lookbook-dots" aria-hidden="true">
          {items.map((p, i) => (
            <span key={p.id} className={`home-hero__lookbook-dot ${i === index ? 'is-active' : ''}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="home-hero home-hero--still">
      <div className="home-hero__still">
        <img
          src="/textures/hero-range.jpg"
          alt="The AZRAA range, crew tees, shirts, bags and footwear displayed on a sunlit boutique rail"
          sizes="100vw"
          fetchpriority="high"
        />
        <div className="home-hero__wash" aria-hidden="true" />
        <div className="home-hero__vignette" aria-hidden="true" />
      </div>
      <div className="home-hero__stage home-hero__stage--static">
        <HeroCopy />
      </div>
      <HeroLookbook />
    </section>
  );
}
