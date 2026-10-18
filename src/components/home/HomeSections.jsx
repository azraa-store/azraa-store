import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import ProductCard from '../commerce/ProductCard.jsx';
import ProductImage from '../ui/ProductImage.jsx';
import CountryPicker from '../chrome/CountryPicker.jsx';
import { activeCategories } from '../../data/categories.js';
import { getFeatured, isStorefrontReady } from '../../services/catalog.js';
import { useRegion } from '../../context/RegionContext.jsx';
import { PRODUCTS } from '../../data/products.js';

// Prefer a product with real front/back photography within the category;
// fall back to the category's placeholder plate rather than borrowing a
// photo from a different category, which would misrepresent what it sells.
const sampleFor = (slug) =>
  PRODUCTS.find((p) => p.category === slug && isStorefrontReady(p)) ||
  PRODUCTS.find((p) => p.category === slug);

/* ─────────── Shop by category ─────────── */
export function CategoriesSection() {
  const cats = activeCategories();
  return (
    <section className="hsec hsec--cats">
      <div className="u-wrap">
        <Reveal className="hsec__head">
          <span className="label">Shop by category</span>
          <h2 className="hsec__title">Four lines, one standard</h2>
        </Reveal>
        <div className={`cats cats--${cats.length}`}>
          {cats.map((c, i) => {
            const sample = sampleFor(c.slug);
            return (
              <Reveal as={Link} to={`/shop/${c.slug}`} key={c.slug} className="cat" delay={i * 70}>
                <div className="cat__media">{sample && <ProductImage product={sample} ratio="4 / 5" />}</div>
                <div className="cat__body">
                  <h3 className="cat__name">{c.name}</h3>
                  <p className="cat__tag">{c.tagline}</p>
                  <span className="cat__link">Explore {c.name.toLowerCase()} →</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Featured ─────────── */
export function FeaturedSection() {
  const [items, setItems] = useState([]);
  useEffect(() => { getFeatured(4).then(setItems); }, []);
  return (
    <section className="hsec hsec--featured">
      <div className="u-wrap">
        <Reveal className="hsec__head hsec__head--row">
          <div>
            <span className="label">Selected</span>
            <h2 className="hsec__title">Featured products</h2>
          </div>
          <Button to="/shop" variant="link">All products →</Button>
        </Reveal>
        <div className="grid grid--4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}><ProductCard product={p} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Wholesale ─────────── */
export function WholesaleSection() {
  return (
    <section className="hsec hsec--wholesale">
      <div className="u-wrap wholesale-band">
        <Reveal className="wholesale-band__text">
          <span className="label">The core of the business</span>
          <h2 className="hsec__title">Wholesale is how AZRAA works</h2>
          <p className="hsec__lede">
            We supply retailers, distributors, resellers and bulk buyers across
            Asia and Africa. Every product is available to order in volume,
            lower unit price, wholesale logistics, and terms set to your account.
          </p>
          <ul className="wholesale-band__points">
            <li>Retail and wholesale on every product</li>
            <li>Wholesale logistics from a lower base rate</li>
            <li>Customer-specific pricing on approved accounts</li>
            <li>Export documentation and consolidated freight</li>
          </ul>
          <div className="wholesale-band__cta">
            <Button to="/wholesale/enquiry" size="lg">Start a wholesale enquiry</Button>
            <Button to="/wholesale" size="lg" variant="ghost">How wholesale works</Button>
          </div>
        </Reveal>
        <Reveal className="wholesale-band__figure" delay={120}>
          <ProductImage product={sampleFor('bags') || PRODUCTS[0]} ratio="4 / 5" />
          <span className="wholesale-band__cap">Priced to your volume, not a shelf ticket</span>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────── Why AZRAA ─────────── */
const WHY = [
  ['Quality', 'Every line is selected, specced and checked to a retail standard, whatever the order size.'],
  ['Wholesale', 'Built for businesses and bulk buyers: retail and wholesale pricing on the same catalogue.'],
  ['Reach', 'Serving customers and trade partners across Asia and Africa, with regional currency and payment.'],
  ['Reliability', 'Honest stock, clear lead times, and a professional purchasing experience end to end.'],
];
export function WhySection() {
  return (
    <section className="hsec hsec--why">
      <div className="u-wrap">
        <Reveal className="hsec__head">
          <span className="label">Why AZRAA</span>
          <h2 className="hsec__title">A serious supplier, end to end</h2>
        </Reveal>
        <div className="why">
          {WHY.map(([t, d], i) => (
            <Reveal key={t} className="why__item" delay={i * 55}>
              <span className="why__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="why__t">{t}</h3>
              <p className="why__d">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Regional shopping ─────────── */
export function RegionalSection() {
  const { country, setCountry } = useRegion();
  const regions = [
    { code: 'US', name: 'United States', note: 'Priced in $ USD · PayPal' },
    { code: 'IN', name: 'India', note: 'Priced in ₹ INR · Razorpay & PayPal' },
    { code: 'NG', name: 'Nigeria', note: 'Priced in ₦ NGN · Paystack & PayPal' },
    { code: 'GH', name: 'Ghana', note: 'Priced in GH₵ · Paystack & PayPal' },
  ];
  return (
    <section className="hsec hsec--regional">
      <div className="u-wrap">
        <Reveal className="hsec__head">
          <span className="label">Worldwide</span>
          <h2 className="hsec__title">We ship anywhere in the world</h2>
          <p className="hsec__lede">
            AZRAA is a global store, order from any country. Prices show in USD
            by default and convert automatically to your local currency and
            payment methods where we support them; everywhere else checks out
            in USD. You’re currently shopping as <strong>{country.name}</strong>.
          </p>
        </Reveal>
        <div className="regions">
          {regions.map((r, i) => (
            <Reveal key={r.code} className="region" delay={i * 55}>
              <button className={`region__btn ${country.code === r.code ? 'is-active' : ''}`} onClick={() => setCountry(r.code)}>
                <span className="region__name">{r.name}</span>
                <span className="region__note">{r.note}</span>
              </button>
            </Reveal>
          ))}
          <Reveal className="region" delay={regions.length * 55}>
            <div className="region__btn region__btn--pick">
              <span className="region__name">Anywhere else</span>
              <span className="region__note">Choose your country for local pricing where we support it.</span>
              <CountryPicker align="left" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────── About ─────────── */
export function AboutSection() {
  return (
    <section className="hsec hsec--about">
      <div className="u-wrap about-band">
        <Reveal>
          <span className="label">About</span>
          <h2 className="hsec__title">AZRAA</h2>
          <p className="hsec__lede">
            AZRAA is a wholesale-focused commerce company supplying clothing,
            footwear and accessories to businesses and consumers across Asia and
            Africa. We buy well, hold real stock, and make purchasing
            (one piece or one container) straightforward.
          </p>
          <Button to="/about" variant="link">More about the company →</Button>
        </Reveal>
        <Reveal className="about-band__stats" delay={100}>
          {[
            ['4', 'live product lines'],
            ['2', 'core markets, India & Nigeria'],
            ['1', 'standard, retail-grade, any volume'],
          ].map(([n, l]) => (
            <div key={l} className="about-stat">
              <span className="about-stat__n">{n}</span>
              <span className="about-stat__l">{l}</span>
            </div>
          ))}
          <p className="about-band__note">Company registration, facilities and partner details will be published here.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────── Newsletter ─────────── */
export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section className="hsec hsec--news">
      <div className="u-wrap news-band">
        <Reveal>
          <h2 className="news-band__title">Stay in touch</h2>
          <p className="news-band__lede">New stock, restocks and trade terms, a few times a season, nothing more.</p>
        </Reveal>
        <Reveal delay={80} className="news-band__form-wrap">
          {done ? (
            <p className="news-band__done">Thank you, check your inbox to confirm.</p>
          ) : (
            <form className="news-band__form" onSubmit={(e) => { e.preventDefault(); if (email.trim()) setDone(true); }}>
              <input type="email" required placeholder="Email address" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit">Subscribe</Button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
