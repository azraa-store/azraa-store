import { getRecentlyViewed } from '../../services/recentlyViewed.js';
import ProductCard from './ProductCard.jsx';

export default function RecentlyViewed({ excludeId }) {
  const items = getRecentlyViewed(excludeId);
  if (items.length === 0) return null;
  return (
    <section className="hsec pdp__recent u-wrap">
      <h2 className="hsec__title">Recently viewed</h2>
      <div className="grid grid--4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
