import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import Button from '../components/ui/Button.jsx';
import { getOrder } from '../services/orders.js';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const [order, setOrder] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    getOrder(id).then((o) => (o ? setOrder(o) : setMissing(true)));
  }, [id]);

  if (missing) {
    return (
      <div className="u-wrap page-narrow">
        <Seo title="Order" />
        <h1 className="page-title">Order not found</h1>
        <div className="row-gap"><Button to="/account/orders" variant="outline">Your orders</Button></div>
      </div>
    );
  }
  if (!order) return <div className="u-wrap page-narrow"><p className="muted">Loading…</p></div>;

  const d = order.display || {};
  const mode = state?.sessionMode;

  return (
    <div className="u-wrap page-narrow confirm">
      <Seo title={`Order ${order.number}`} />
      <span className="confirm__badge">Order confirmed</span>
      <h1 className="page-title">Thank you, {order.customer.name.split(' ')[0]}.</h1>
      <p className="confirm__lede">
        We’ve emailed a confirmation to <strong>{order.customer.email}</strong>. Your reference is{' '}
        <strong>{order.number}</strong> ({order.orderType} order).
      </p>

      {mode === 'mock' && (
        <p className="confirm__demo">
          Demo checkout — no payment was taken and no live stock moved beyond this browser.
          Connect a payment provider’s live keys to process real transactions.
        </p>
      )}

      <div className="confirm__card">
        <h2 className="confirm__h">Summary</h2>
        <ul className="confirm__items">
          {(d.lines || order.items.map((it) => ({ label: `${it.qty}× ${it.name}`, mode: it.mode, value: '' }))).map((l, i) => (
            <li key={i}>
              <span>{l.label} {l.mode && <em>· {l.mode}</em>}</span>
              <span>{l.value}</span>
            </li>
          ))}
        </ul>
        <dl className="summary__rows">
          <div><dt>Subtotal</dt><dd>{d.subtotal}</dd></div>
          <div><dt>Shipping</dt><dd>{d.shipping}</dd></div>
          <div><dt>Tax</dt><dd>{d.tax}</dd></div>
          <div className="summary__total"><dt>Total</dt><dd>{d.total}</dd></div>
        </dl>
        <div className="confirm__ship">
          <span className="label">Delivery</span>
          <p>
            {order.shippingAddress.name}<br />
            {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}<br />
            {order.shippingAddress.city}{order.shippingAddress.postcode ? ` ${order.shippingAddress.postcode}` : ''}<br />
            {order.shippingMethod.label} · {order.shippingMethod.eta}
          </p>
        </div>
      </div>

      <div className="row-gap">
        <Button to="/shop">Continue shopping</Button>
        <Button to="/account/orders" variant="outline">View your orders</Button>
      </div>
    </div>
  );
}
