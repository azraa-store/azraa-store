import { Link } from 'react-router-dom';
import ProductImage from '../ui/ProductImage.jsx';
import Price from '../ui/Price.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { availability, availabilityLabel } from '../../services/inventory.js';

export default function ProductCard({ product, priority = false }) {
  const { add } = useCart();
  const avail = availability(product);
  const soldOut = avail === 'out';

  const quickAdd = (e) => {
    e.preventDefault();
    if (soldOut) return;
    const size = product.sizes?.[0]?.label || null;
    const color = product.colors?.[0]?.name || null;
    add(product.id, { qty: 1, mode: 'retail', variant: (size || color) ? { size, color } : null });
  };

  return (
    <article className="pcard">
      <Link to={`/product/${product.slug}`} className="pcard__media">
        <ProductImage product={product} priority={priority} />
        {(avail === 'low' || avail === 'out') && (
          <span className={`pcard__flag pcard__flag--${avail}`}>{availabilityLabel(avail)}</span>
        )}
        <span className="pcard__flag pcard__flag--ws">Retail &amp; wholesale</span>
        {!soldOut && (
          <button className="pcard__quick" onClick={quickAdd} aria-label={`Quick add ${product.name}`}>
            Quick add
          </button>
        )}
      </Link>
      <div className="pcard__body">
        <div className="pcard__row">
          <Link to={`/product/${product.slug}`} className="pcard__name">{product.name}</Link>
          <Price product={product} className="pcard__price" />
        </div>
        <p className="pcard__meta">
          {product.subcategory} · wholesale from <Price product={product} mode="wholesale" />
        </p>
      </div>
    </article>
  );
}
