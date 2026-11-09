import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { activeCategories, getCategory } from '../../data/categories.js';
import { getFeatured } from '../../services/catalog.js';
import ProductImage from '../ui/ProductImage.jsx';

// The category whose photography is complete enough to spotlight in the
// editorial panel — see the plan note: all storefront-ready products right
// now are in "men", the others are still pending real photography.
const EDITORIAL_CATEGORY = 'men';

function CollectionsMenu({ onNavigate }) {
  const cats = activeCategories();
  const [featured, setFeatured] = useState([]);
  const editorial = getCategory(EDITORIAL_CATEGORY);

  useEffect(() => {
    let alive = true;
    getFeatured(1).then((items) => alive && setFeatured(items));
    return () => { alive = false; };
  }, []);

  return (
    <div className="mega mega--collections">
      <div className="mega__col">
        <span className="mega__col-title">Shop by category</span>
        <ul className="mega__list">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop/${c.slug}`} onClick={onNavigate} className="mega__cat">{c.name}</Link>
              <ul className="mega__sublist">
                {c.subcategories.slice(0, 4).map((s) => (
                  <li key={s}>
                    <Link to={`/shop/${c.slug}?sub=${encodeURIComponent(s)}`} onClick={onNavigate}>{s}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="mega__col">
        <span className="mega__col-title">Featured</span>
        <ul className="mega__list mega__list--plain">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop/${c.slug}`} onClick={onNavigate}>{c.name}</Link>
            </li>
          ))}
          <li>
            <Link to="/shop?sort=featured" onClick={onNavigate} className="mega__best">Bestsellers →</Link>
          </li>
        </ul>
      </div>

      <div className="mega__col mega__col--editorial">
        {featured[0] ? (
          <ProductImage product={featured[0]} ratio="4 / 5" className="mega__editorial-img" sizes="220px" />
        ) : (
          <div className="mega__editorial-img mega__editorial-img--empty" aria-hidden="true" />
        )}
        <span className="mega__editorial-title">{editorial.name}</span>
        <p className="mega__editorial-desc">{editorial.tagline}</p>
        <Link to={`/shop/${editorial.slug}`} onClick={onNavigate} className="mega__editorial-cta">
          Discover {editorial.name} →
        </Link>
      </div>
    </div>
  );
}

function WholesaleMenu({ onNavigate }) {
  const links = [
    ['Wholesale catalogue', '/wholesale'],
    ['Bulk orders', '/wholesale'],
    ['Request a quote', '/wholesale/enquiry'],
    ['Become a wholesale partner', '/wholesale/enquiry'],
  ];
  return (
    <div className="mega mega--wholesale">
      <div className="mega__col">
        <span className="mega__col-title">Wholesale</span>
        <ul className="mega__list mega__list--plain">
          {links.map(([label, to]) => (
            <li key={label}><Link to={to} onClick={onNavigate}>{label}</Link></li>
          ))}
        </ul>
      </div>
      <div className="mega__col mega__col--editorial">
        <p className="mega__editorial-title">Buy wholesale directly</p>
        <p className="mega__editorial-desc">
          Every product carries a wholesale price. Enter a quantity at or
          above the minimum and check out, no quote or wait.
        </p>
        <Link to="/wholesale" onClick={onNavigate} className="mega__editorial-cta">
          How wholesale works →
        </Link>
      </div>
    </div>
  );
}

export default function MegaMenu({ type, onNavigate }) {
  if (type === 'wholesale') return <WholesaleMenu onNavigate={onNavigate} />;
  return <CollectionsMenu onNavigate={onNavigate} />;
}
