import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import ProductCard from '../components/commerce/ProductCard.jsx';
import { listProducts } from '../services/catalog.js';
import { activeCategories, getCategory } from '../data/categories.js';

const CATEGORIES = activeCategories();

const SORTS = [
  ['featured', 'Featured'],
  ['price-asc', 'Price · low to high'],
  ['price-desc', 'Price · high to low'],
  ['name', 'Name'],
];

export default function ShopPage() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const sub = params.get('sub') || '';
  const sort = params.get('sort') || 'featured';

  const cat = category ? getCategory(category) : null;
  const invalidCategory = category && (!cat || !cat.active);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listProducts({ category, subcategory: sub || undefined, search: q || undefined, sort })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category, sub, q, sort]);

  const setParam = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const title = q
    ? `Search, “${q}”`
    : cat
      ? cat.name
      : 'All products';

  const subcats = useMemo(() => (cat ? cat.subcategories : []), [cat]);

  if (invalidCategory) return <Navigate to="/shop" replace />;

  return (
    <div className="shop">
      <Seo title={title} description={cat ? cat.blurb : 'Browse AZRAA clothing, footwear and food. Retail and wholesale.'} />

      <header className="shop__head">
        <div className="u-wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            <Link to="/shop">Shop</Link>
            {cat && (<><span>/</span><span>{cat.name}</span></>)}
          </nav>
          <h1 className="shop__title">{title}</h1>
          {cat && <p className="shop__blurb">{cat.blurb}</p>}

          <div className="shop__cats">
            <Link to="/shop" className={`chip ${!category ? 'is-active' : ''}`}>All</Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/shop/${c.slug}`}
                className={`chip ${category === c.slug ? 'is-active' : ''}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="u-wrap shop__body">
        <div className="shop__toolbar">
          <div className="shop__subs">
            {subcats.length > 0 && (
              <>
                <button className={`chip chip--sm ${!sub ? 'is-active' : ''}`} onClick={() => setParam('sub', '')}>
                  Everything
                </button>
                {subcats.map((s) => (
                  <button
                    key={s}
                    className={`chip chip--sm ${sub === s ? 'is-active' : ''}`}
                    onClick={() => setParam('sub', s === sub ? '' : s)}
                  >
                    {s}
                  </button>
                ))}
              </>
            )}
          </div>
          <label className="shop__sort">
            <span>Sort</span>
            <select value={sort} onChange={(e) => setParam('sort', e.target.value)} className="input input--select">
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>

        {loading ? (
          <div className="shop__loading">Loading…</div>
        ) : products.length === 0 ? (
          <div className="shop__empty">
            <p>No products found{q && ` for “${q}”`}.</p>
            <Link to="/shop" className="link">Clear filters</Link>
          </div>
        ) : (
          <div className="grid grid--3">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 6) * 50}>
                <ProductCard product={p} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        )}

        <p className="shop__count">{products.length} product{products.length === 1 ? '' : 's'}</p>
      </div>
    </div>
  );
}
