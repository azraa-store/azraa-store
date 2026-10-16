import { Link } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Button from '../components/ui/Button.jsx';
import Price from '../components/ui/Price.jsx';
import { PRODUCTS } from '../data/products.js';
import { LOGISTICS } from '../data/logistics.js';
import { isStorefrontReady } from '../services/catalog.js';

const AUDIENCE = [
  ['Retailers', 'Independent shops and chains stocking rails and shelves.'],
  ['Distributors', 'Regional distribution with consolidated freight and terms.'],
  ['Resellers', 'Market traders and online sellers buying to resell.'],
  ['Institutions', 'Uniform programmes, caterers, NGOs and government buyers.'],
  ['Organisations', 'Events, corporate gifting and staff kit.'],
  ['Bulk buyers', 'Anyone ordering by the pack or the pallet.'],
];
const STEPS = [
  ['Choose', 'Open any product, switch to Wholesale, and enter the quantity you need.'],
  ['Checkout', 'Pay the wholesale unit price and wholesale delivery — no quote, no wait.'],
  ['Account', 'For custom pricing, payment terms or standing orders, open a trade account.'],
  ['Fulfil', 'We pick, document and ship — tracked courier or consolidated export.'],
];

export default function WholesalePage() {
  // The example links to the product page, which 404s for anything not yet
  // storefront-ready — pick a product that's actually live.
  const tee = PRODUCTS.find((p) => p.id === 'azr-tee-round' && isStorefrontReady(p)) || PRODUCTS.find(isStorefrontReady);

  return (
    <div className="wpage">
      <Seo
        title="Wholesale"
        description="Every AZRAA product is available to buy at a wholesale price — pick a quantity and check out. Serving retailers, distributors and bulk buyers across Asia and Africa."
      />

      <section className="wpage__hero">
        <div className="u-wrap">
          <Reveal>
            <span className="label">Wholesale</span>
            <h1 className="wpage__title">Buy wholesale directly — no enquiry</h1>
            <p className="wpage__lede">
              Every product in the store carries a retail and a wholesale price.
              Open a product, switch to Wholesale, enter your quantity, and check
              out at the wholesale unit price with wholesale delivery. For custom
              pricing or account terms, open a trade account.
            </p>
            <div className="row-gap">
              <Button to="/shop" size="lg">Shop the range</Button>
              <Button to="/wholesale/enquiry" size="lg" variant="outline">Open a trade account</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="wpage__sec">
        <div className="u-wrap">
          <Reveal className="hsec__head"><span className="label">Example</span>
            <h2 className="hsec__title">Retail and wholesale, one product</h2>
          </Reveal>
          <div className="wexample">
            <div>
              <span className="label">{tee.name}</span>
              <div className="wexample__rows">
                <div><span>Retail</span><Price product={tee} mode="retail" /> <em>/ {tee.unit}</em></div>
                <div><span>Wholesale</span><Price product={tee} mode="wholesale" /> <em>/ {tee.unit}</em></div>
                <div><span>Wholesale from</span><em>{tee.wholesale.moq} {tee.unit}s</em></div>
                <div><span>Retail delivery</span><Price usd={LOGISTICS.retail.usd} inr={LOGISTICS.retail.inr} /></div>
                <div><span>Wholesale delivery</span><Price usd={LOGISTICS.wholesale.usd} inr={LOGISTICS.wholesale.inr} /></div>
              </div>
              <p className="wpage__fine">
                Shown in your currency. India sees our listed rupee prices; elsewhere
                converts from the USD reference at live rates. Trade-account pricing
                may differ.
              </p>
            </div>
            <Link to={`/product/${tee.slug}`} className="wexample__cta">
              View product · choose Retail or Wholesale →
            </Link>
          </div>
        </div>
      </section>

      <section className="wpage__sec wpage__sec--alt">
        <div className="u-wrap">
          <Reveal className="hsec__head"><span className="label">Who we supply</span>
            <h2 className="hsec__title">Built for trade buyers</h2>
          </Reveal>
          <div className="grid grid--3">
            {AUDIENCE.map((a, i) => (
              <Reveal key={a[0]} className="wcard" delay={i * 50}>
                <h3>{a[0]}</h3><p>{a[1]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="wpage__sec">
        <div className="u-wrap">
          <Reveal className="hsec__head"><span className="label">How it works</span>
            <h2 className="hsec__title">Four steps</h2>
          </Reveal>
          <ol className="wsteps">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s[0]} className="wstep" delay={i * 60}>
                <span className="wstep__n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s[0]}</h3><p>{s[1]}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="wpage__cta">
        <div className="u-wrap">
          <Reveal>
            <h2 className="hsec__title">Open a trade account</h2>
            <p className="hsec__lede">
              For customer-specific pricing, payment terms, standing orders or
              volumes beyond the standard runs — tell us about your business.
            </p>
            <Button to="/wholesale/enquiry" size="lg">Start a trade account</Button>
            <p className="wpage__fine">
              You can buy wholesale right now without an account — this is only for
              custom terms.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
