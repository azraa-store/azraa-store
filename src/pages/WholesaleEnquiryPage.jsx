import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import Button from '../components/ui/Button.jsx';
import { Field, TextInput, TextArea, Select } from '../components/ui/Field.jsx';
import { PRODUCTS } from '../data/products.js';
import { countryList } from '../data/countries.js';
import { useRegion } from '../context/RegionContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { submitWholesaleEnquiry } from '../services/wholesale.js';

const BUSINESS_TYPES = ['Retailer', 'Distributor', 'Reseller', 'Wholesaler', 'Institution / caterer', 'NGO / government', 'Other'];

export default function WholesaleEnquiryPage() {
  const [params] = useSearchParams();
  const { countryCode } = useRegion();
  const { user } = useAuth();

  const preId = params.get('product');
  const [lines, setLines] = useState(() => {
    const p = PRODUCTS.find((x) => x.id === preId);
    return p ? [{ productId: p.id, quantity: p.wholesale?.moq || 50, note: '' }] : [{ productId: PRODUCTS[0].id, quantity: 50, note: '' }];
  });
  const [business, setBusiness] = useState({
    name: user?.account?.company || '', type: BUSINESS_TYPES[0],
    country: countryCode, website: '', taxId: '',
  });
  const [contact, setContact] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.account?.phone || '', role: '',
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const wholesaleProducts = useMemo(
    () => PRODUCTS.filter((p) => p.wholesale && p.modes?.includes('wholesale')),
    []
  );

  const addLine = () =>
    setLines((l) => [...l, { productId: wholesaleProducts[0].id, quantity: 50, note: '' }]);
  const setLine = (i, patch) =>
    setLines((l) => l.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const removeLine = (i) => setLines((l) => l.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitWholesaleEnquiry({
        business,
        contact,
        message,
        items: lines.map((l) => {
          const p = PRODUCTS.find((x) => x.id === l.productId);
          return { productId: l.productId, name: p?.name, quantity: Number(l.quantity), note: l.note };
        }),
      });
      setResult(res);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="u-wrap page-narrow confirm">
        <Seo title="Trade account request received" />
        <span className="confirm__badge">Request received</span>
        <h1 className="page-title">Thank you.</h1>
        <p className="confirm__lede">
          Your reference is <strong>{result.reference}</strong>. Our trade desk
          will review it and reply to <strong>{contact.email}</strong>, usually
          within two working days, with account terms and any custom pricing.
          You can buy wholesale on the store in the meantime, no account needed.
        </p>
        <div className="confirm__card">
          <h2 className="confirm__h">Products you flagged</h2>
          <ul className="confirm__items">
            {result.items.map((it, i) => (
              <li key={i}><span>{it.name}</span><span>{it.quantity.toLocaleString()} units</span></li>
            ))}
          </ul>
        </div>
        <div className="row-gap">
          <Button to="/shop">Browse products</Button>
          <Button to="/wholesale" variant="outline">Back to wholesale</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="u-wrap page enquiry">
      <Seo title="Wholesale enquiry" />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/wholesale">Wholesale</Link><span>/</span><span>Trade account</span>
      </nav>
      <h1 className="page-title">Open a trade account</h1>
      <p className="enquiry__lede">
        You can buy wholesale on the store right now, this form is only for
        <strong> custom pricing, payment terms, standing orders</strong> or
        volumes beyond the standard runs. Tell us about your business and what
        you expect to order.
      </p>

      <form onSubmit={submit} className="enquiry__form">
        <section className="enquiry__block">
          <h2 className="checkout__h">Products</h2>
          {lines.map((line, i) => {
            const p = PRODUCTS.find((x) => x.id === line.productId);
            return (
              <div className="enquiry__line" key={i}>
                <Field label="Product">
                  <Select value={line.productId} onChange={(e) => setLine(i, { productId: e.target.value })}>
                    {wholesaleProducts.map((wp) => (
                      <option key={wp.id} value={wp.id}>{wp.name}, {wp.category}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Quantity" hint={p ? `MOQ ${p.wholesale.moq} · ${p.wholesale.unitHint}` : ''}>
                  <TextInput
                    type="number" min="1" value={line.quantity}
                    onChange={(e) => setLine(i, { quantity: e.target.value })}
                  />
                </Field>
                <Field label="Note (optional)">
                  <TextInput
                    value={line.note} placeholder="Sizes, colours, timing…"
                    onChange={(e) => setLine(i, { note: e.target.value })}
                  />
                </Field>
                {lines.length > 1 && (
                  <button type="button" className="enquiry__remove" onClick={() => removeLine(i)}>Remove</button>
                )}
              </div>
            );
          })}
          <Button type="button" variant="ghost" size="sm" onClick={addLine}>+ Add another product</Button>
        </section>

        <section className="enquiry__block">
          <h2 className="checkout__h">Your business</h2>
          <div className="field-row">
            <Field label="Business name" required>
              <TextInput value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} required />
            </Field>
            <Field label="Business type">
              <Select value={business.type} onChange={(e) => setBusiness({ ...business, type: e.target.value })}>
                {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
              </Select>
            </Field>
          </div>
          <div className="field-row">
            <Field label="Country" required>
              <Select value={business.country} onChange={(e) => setBusiness({ ...business, country: e.target.value })}>
                {countryList().map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Website (optional)">
              <TextInput value={business.website} onChange={(e) => setBusiness({ ...business, website: e.target.value })} placeholder="https://" />
            </Field>
          </div>
          <Field label="Tax / business ID (optional)" hint="GSTIN, RC number, VAT, whatever applies in your market.">
            <TextInput value={business.taxId} onChange={(e) => setBusiness({ ...business, taxId: e.target.value })} />
          </Field>
        </section>

        <section className="enquiry__block">
          <h2 className="checkout__h">Contact</h2>
          <div className="field-row">
            <Field label="Full name" required>
              <TextInput value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
            </Field>
            <Field label="Role (optional)">
              <TextInput value={contact.role} onChange={(e) => setContact({ ...contact, role: e.target.value })} />
            </Field>
          </div>
          <div className="field-row">
            <Field label="Email" required>
              <TextInput type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
            </Field>
            <Field label="Phone" required>
              <TextInput value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} required />
            </Field>
          </div>
          <Field label="Anything else?">
            <TextArea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Target delivery dates, recurring volumes, payment terms…" />
          </Field>
        </section>

        {error && <p className="checkout__error">{error}</p>}
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Sending…' : 'Submit enquiry'}
        </Button>
        <p className="checkout__fine">
          We use your details only to respond to this enquiry. See our{' '}
          <Link to="/legal/privacy">privacy policy</Link>.
        </p>
      </form>
    </div>
  );
}
