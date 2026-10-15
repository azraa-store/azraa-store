import { Link } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import Button from '../components/ui/Button.jsx';
import ProductCard from '../components/commerce/ProductCard.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="u-wrap page">
      <Seo title="Your wishlist" />
      <h1 className="page-title">Your wishlist</h1>

      {items.length === 0 ? (
        <div className="cartpage__empty">
          <p>Nothing saved yet.</p>
          <div className="row-gap">
            <Button to="/shop">Shop products</Button>
            <Button to="/wholesale" variant="outline">Wholesale enquiry</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid--4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <p className="muted" style={{ marginTop: '2.5rem' }}>
        Saved items live on this device. <Link to="/shop">Keep browsing</Link>.
      </p>
    </div>
  );
}
