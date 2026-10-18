import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import Button from '../components/ui/Button.jsx';
import { Field, TextInput, Select } from '../components/ui/Field.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useRegion } from '../context/RegionContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { computeCartTotals } from '../services/pricing.js';
import { providersForCountry } from '../services/payments/index.js';
import { createOrder } from '../services/orders.js';
import { countryList } from '../data/countries.js';

const STEPS = ['Contact', 'Delivery', 'Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const { countryCode, country, setCountry, rates } = useRegion();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  const [contact, setContact] = useState({ email: user?.email || '' });
  const [address, setAddress] = useState({
    name: user?.name || '', line1: '', line2: '', city: '', state: '', postcode: '', phone: '',
  });
  const [express, setExpress] = useState(false);
  const providers = useMemo(() => providersForCountry(countryCode), [countryCode]);
  const [payMethod, setPayMethod] = useState(providers[0]?.id || 'paypal');

  const totals = computeCartTotals(items, countryCode, rates, { express });

  if (items.length === 0 && !placing) {
    return (
      <div className="u-wrap page-narrow">
        <Seo title="Checkout" />
        <h1 className="page-title">Checkout</h1>
        <p className="muted">Your bag is empty.</p>
        <div className="row-gap"><Button to="/shop" variant="outline">Back to shop</Button></div>
      </div>
    );
  }

  const canNext = () => {
    if (step === 0) return /\S+@\S+\.\S+/.test(contact.email);
    if (step === 1) return address.name && address.line1 && address.city && address.phone;
    return true;
  };

  const placeOrder = async () => {
    setPlacing(true); setError(null);
    try {
      const provider = providers.find((p) => p.id === payMethod) || providers[0];
      const draft = {
        currency: totals.currency,
        customer: { email: contact.email, name: address.name },
        shippingAddress: { ...address, country: countryCode },
        shippingMethod: { id: express ? 'express' : 'standard', label: express ? 'Express' : 'Standard', eta: express ? '2–4 working days' : '5–9 working days' },
        country: countryCode,
        orderType: totals.orderMode,
        items: totals.lines.map((l) => ({
          productId: l.product.id, name: l.product.name, slug: l.product.slug,
          mode: l.mode, variant: l.variant, qty: l.qty, unit: l.unit,
        })),
        amounts: { subtotal: totals.subtotal, shipping: totals.shipping, tax: totals.tax, total: totals.total, currency: totals.currency },
        display: {
          currency: totals.currency, locale: totals.locale,
          subtotal: totals.subtotalText, shipping: totals.shippingText, tax: totals.taxText, total: totals.totalText,
          lines: totals.lines.map((l) => ({ label: `${l.qty}× ${l.product.name}`, mode: l.mode, value: totals.money(l.lineAmount) })),
        },
      };

      const order = await createOrder(draft); // also commits inventory
      const session = await provider.createSession({
        order: { id: order.id, total: totals.total, currency: totals.currency },
        country: countryCode,
        returnUrl: `${window.location.origin}/order/${order.id}`,
      });
      const result = await provider.confirm(session, { orderId: order.id });

      clear();
      navigate(`/order/${order.id}`, { state: { payment: { provider: provider.id, ...result }, sessionMode: session.mode } });
    } catch (e) {
      setError(e.message || 'Something went wrong placing your order.');
      setPlacing(false);
    }
  };

  return (
    <div className="u-wrap checkout">
      <Seo title="Checkout" />
      <div className="checkout__head">
        <h1 className="page-title">Checkout</h1>
        <Link to="/cart" className="link">Edit bag</Link>
      </div>

      <ol className="checkout__steps" aria-label="Checkout progress">
        {STEPS.map((s, i) => (
          <li key={s} className={`${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`}>
            <button onClick={() => i < step && setStep(i)} disabled={i >= step}>
              <span>{String(i + 1).padStart(2, '0')}</span> {s}
            </button>
          </li>
        ))}
      </ol>

      <div className="checkout__grid">
        <div className="checkout__panel">
          {step === 0 && (
            <section>
              <h2 className="checkout__h">Contact</h2>
              {!user && (
                <p className="checkout__hint">
                  Have an account? <Link to="/sign-in" className="link">Sign in</Link> for saved
                  addresses and order history, or continue as a guest.
                </p>
              )}
              <Field label="Email address" required>
                <TextInput type="email" value={contact.email} onChange={(e) => setContact({ email: e.target.value })} placeholder="you@company.com" />
              </Field>
              <p className="checkout__fine">Order confirmation and shipping updates are sent here.</p>
            </section>
          )}

          {step === 1 && (
            <section>
              <h2 className="checkout__h">Delivery address</h2>
              <Field label="Country / region" required>
                <Select value={countryCode} onChange={(e) => setCountry(e.target.value)}>
                  {countryList().map((c) => <option key={c.code} value={c.code}>{c.name}, {c.currency}</option>)}
                </Select>
              </Field>
              <Field label="Full name" required><TextInput value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} /></Field>
              <Field label="Address line 1" required><TextInput value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} /></Field>
              <Field label="Address line 2"><TextInput value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} /></Field>
              <div className="field-row">
                <Field label="City" required><TextInput value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /></Field>
                <Field label="State / region"><TextInput value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} /></Field>
              </div>
              <div className="field-row">
                <Field label="Postcode / PIN"><TextInput value={address.postcode} onChange={(e) => setAddress({ ...address, postcode: e.target.value })} /></Field>
                <Field label="Phone" required><TextInput value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} /></Field>
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 className="checkout__h">Shipping method</h2>
              <p className="checkout__hint">
                This is a <strong>{totals.orderMode}</strong> order ,{' '}
                <strong>{totals.logisticsLabel}</strong> applies, {totals.logisticsBase} standard.
              </p>
              <div className="radio-list">
                <label className={`radio-card ${!express ? 'is-on' : ''}`}>
                  <input type="radio" name="ship" checked={!express} onChange={() => setExpress(false)} />
                  <span className="radio-card__main">
                    <span className="radio-card__title">Standard</span>
                    <span className="radio-card__sub">5–9 working days</span>
                  </span>
                  <span className="radio-card__price">{totals.logisticsBase}</span>
                </label>
                <label className={`radio-card ${express ? 'is-on' : ''}`}>
                  <input type="radio" name="ship" checked={express} onChange={() => setExpress(true)} />
                  <span className="radio-card__main">
                    <span className="radio-card__title">Express</span>
                    <span className="radio-card__sub">2–4 working days</span>
                  </span>
                  <span className="radio-card__price">{totals.shippingText}</span>
                </label>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="checkout__h">Payment</h2>
              <p className="checkout__hint">
                Options for <strong>{country.name}</strong>. The charge is taken in {country.currency}.
                Card details are entered with the provider, never on AZRAA.
              </p>
              <div className="radio-list">
                {providers.map((p) => (
                  <label key={p.id} className={`radio-card ${payMethod === p.id ? 'is-on' : ''}`}>
                    <input type="radio" name="pay" checked={payMethod === p.id} onChange={() => setPayMethod(p.id)} />
                    <span className="radio-card__main">
                      <span className="radio-card__title">{p.label}</span>
                      <span className="radio-card__sub">{p.description}</span>
                    </span>
                    {!p.configured && <span className="radio-card__tag">test mode</span>}
                  </label>
                ))}
              </div>
              <p className="checkout__fine">
                Providers show “test mode” until live publishable keys are configured
                (<code>VITE_RAZORPAY_KEY_ID</code>, <code>VITE_PAYSTACK_PUBLIC_KEY</code>,
                <code>VITE_FLUTTERWAVE_PUBLIC_KEY</code>, <code>VITE_PAYPAL_CLIENT_ID</code>).
              </p>
            </section>
          )}

          {step === 4 && (
            <section>
              <h2 className="checkout__h">Review</h2>
              <div className="review">
                <ReviewRow label="Contact" value={contact.email} onEdit={() => setStep(0)} />
                <ReviewRow label="Deliver to" value={`${address.name}, ${address.line1}, ${address.city}, ${country.name}`} onEdit={() => setStep(1)} />
                <ReviewRow label="Order type" value={totals.orderMode === 'wholesale' ? 'Wholesale' : 'Retail'} onEdit={() => navigate('/cart')} />
                <ReviewRow label="Shipping" value={express ? 'Express · 2–4 days' : 'Standard · 5–9 days'} onEdit={() => setStep(2)} />
                <ReviewRow label="Payment" value={(providers.find((p) => p.id === payMethod) || {}).label || 'PayPal'} onEdit={() => setStep(3)} />
              </div>
              {error && <p className="checkout__error">{error}</p>}
              <Button block onClick={placeOrder} disabled={placing}>
                {placing ? 'Placing order…' : `Place order · ${totals.totalText}`}
              </Button>
              <p className="checkout__fine">
                By placing the order you agree to our <Link to="/legal/terms">terms</Link> and
                {' '}<Link to="/legal/privacy">privacy policy</Link>. The final amount is validated
                server-side in {country.currency} before payment.
              </p>
            </section>
          )}

          {step < 4 && (
            <div className="checkout__nav">
              {step > 0 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>Continue</Button>
            </div>
          )}
        </div>

        <aside className="checkout__summary">
          <h2 className="summary__title">Order · {totals.orderMode}</h2>
          <ul className="checkout__items">
            {totals.lines.map((l) => (
              <li key={l.product.id + l.mode + JSON.stringify(l.variant)}>
                <span>{l.qty}× {l.product.name} <em className={`mode-pill mode-pill--${l.mode}`}>{l.mode}</em></span>
                <span>{totals.money(l.lineAmount)}</span>
              </li>
            ))}
          </ul>
          <dl className="summary__rows">
            <div><dt>Subtotal</dt><dd>{totals.subtotalText}</dd></div>
            <div><dt>{totals.logisticsLabel}{express ? ' (express)' : ''}</dt><dd>{totals.shippingText}</dd></div>
            <div><dt>{totals.taxLabel}</dt><dd>{totals.taxText}</dd></div>
            <div className="summary__total"><dt>Total</dt><dd>{totals.totalText}</dd></div>
          </dl>
          <p className="summary__note">Charged in {totals.currency}. Confirmed by the payment provider.</p>
        </aside>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="review__row">
      <span className="review__label">{label}</span>
      <span className="review__value">{value}</span>
      <button className="review__edit" onClick={onEdit}>Edit</button>
    </div>
  );
}
