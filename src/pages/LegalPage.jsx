import { useParams, Navigate, Link } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';

const DOCS = {
  privacy: {
    title: 'Privacy policy',
    body: [
      ['What we collect', 'Account details you provide, order and delivery information, wholesale enquiry details, and standard technical data (device, approximate location for regional pricing). We do not sell personal data.'],
      ['How we use it', 'To process orders and enquiries, provide support, prevent fraud, and, only with consent, send occasional updates.'],
      ['Payments', 'Card and payment details are handled by our payment providers (Razorpay, Paystack, PayPal). AZRAA never stores full card numbers.'],
      ['Your rights', 'You can access, correct or delete your account data, and object to marketing at any time.'],
      ['Contact', 'A data protection contact address will be published here.'],
    ],
  },
  terms: {
    title: 'Terms & conditions',
    body: [
      ['Ordering', 'Retail orders are an offer to buy; a contract forms when we confirm dispatch. Wholesale orders are governed by your account terms and any signed agreement.'],
      ['Pricing', 'Prices shown in your regional currency. Where a price is marked indicative it is a conversion estimate; the amount charged is confirmed by the payment provider in the local currency.'],
      ['Wholesale', 'Minimum order quantities, tiered and customer-specific pricing, and payment terms are set per account and confirmed on your quote.'],
      ['Liability', 'Nothing in these terms limits liability that cannot be limited by law. Full terms to be published.'],
    ],
  },
  shipping: {
    title: 'Shipping & delivery',
    body: [
      ['Regional delivery', 'Orders ship to the country selected at checkout, with tracked courier for retail and consolidated freight for wholesale.'],
      ['Lead times', 'Retail: typically 5–9 working days standard, 2–4 express. Wholesale and export lead times are quoted per order.'],
      ['Duties & taxes', 'Regional tax is shown at checkout. Cross-border duties, where applicable, are the buyer’s responsibility unless the quote states otherwise.'],
      ['Tracking', 'A tracking reference is emailed on dispatch and shown in your account.'],
    ],
  },
  returns: {
    title: 'Returns & refunds',
    body: [
      ['Retail returns', 'Unworn items with tags may be returned within 14 days of delivery for a refund to the original payment method.'],
      ['Food products', 'For safety, food items are non-returnable unless faulty or incorrectly supplied.'],
      ['Wholesale', 'Returns and claims on wholesale orders are handled under your account terms.'],
      ['Faulty goods', 'Contact customer care with your order number and photos; we’ll arrange a replacement or refund.'],
    ],
  },
};

export default function LegalPage() {
  const { doc } = useParams();
  const data = DOCS[doc];
  if (!data) return <Navigate to="/legal/privacy" replace />;

  return (
    <div className="u-wrap page-narrow legal">
      <Seo title={data.title} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span>/</span><span>{data.title}</span>
      </nav>
      <h1 className="page-title">{data.title}</h1>
      <p className="muted legal__stamp">Last updated: placeholder. This document is a working draft pending legal review.</p>
      <div className="prose">
        {data.body.map(([h, p]) => (
          <section key={h}>
            <h2>{h}</h2>
            <p>{p}</p>
          </section>
        ))}
      </div>
      <div className="legal__nav">
        {Object.entries(DOCS).map(([slug, d]) => (
          <Link key={slug} to={`/legal/${slug}`} className={`chip chip--sm ${slug === doc ? 'is-active' : ''}`}>{d.title}</Link>
        ))}
      </div>
    </div>
  );
}
