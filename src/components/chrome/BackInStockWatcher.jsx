import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { pendingSubscriptions, markNotified } from '../../services/backInStock.js';
import { availability } from '../../services/inventory.js';
import { getProductById } from '../../data/products.js';

/**
 * No UI of its own most of the time — sweeps pending back-in-stock
 * subscriptions against live availability() on mount (app load, and again
 * on every route change, which covers "visited a product page" too) and
 * surfaces a toast for whatever just came back. Mock notification, same
 * limitation as the rest of this mock backend: no real email is sent.
 */
export default function BackInStockWatcher() {
  const [restocked, setRestocked] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const pending = pendingSubscriptions();
    for (const sub of pending) {
      const product = getProductById(sub.productId);
      if (!product) continue;
      if (availability(product, sub.color, sub.size) === 'in') {
        markNotified(sub.productId, sub.color, sub.size);
        setRestocked(product);
        break; // one toast at a time
      }
    }
  }, [pathname]);

  if (!restocked) return null;

  return (
    <div className="fxnote back-in-stock-note">
      <span>
        <strong>{restocked.name}</strong> is back in stock.{' '}
        <Link to={`/product/${restocked.slug}`} onClick={() => setRestocked(null)}>Shop it</Link>
      </span>
      <button type="button" onClick={() => setRestocked(null)} aria-label="Dismiss">×</button>
    </div>
  );
}
