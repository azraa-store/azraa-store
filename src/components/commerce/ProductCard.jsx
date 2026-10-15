import { Link } from 'react-router-dom';
import ProductImage from '../ui/ProductImage.jsx';
import Price from '../ui/Price.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { availability, availabilityLabel } from '../../services/inventory.js';

export default function ProductCard({ product, priority = false }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const avail = availability(product);
  const soldOut = avail === 'out';
  const saved = has(product.id);

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
        <button
          type="button"
          className={`pcard__wish ${saved ? 'is-on' : ''}`}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M12 20.3 4.6 13c-2-2-2-5.3 0-7.3 2-2 5.2-2 7.1 0l.3.3.3-.3c2-2 5.2-2 7.1 0 2 2 2 5.3 0 7.3L12 20.3Z" />
          </svg>
        </button>
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
