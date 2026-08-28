import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/products.js';
import { CATEGORIES } from '../../data/categories.js';
import ProductImage from '../ui/ProductImage.jsx';
import Price from '../ui/Price.jsx';

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = 'hidden';
    }
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return PRODUCTS.filter((p) =>
      [p.name, p.summary, p.category, p.subcategory, ...(p.tags || [])].join(' ').toLowerCase().includes(s)
    ).slice(0, 6);
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="search" role="dialog" aria-modal="true" aria-label="Search">
      <div className="search__scrim" onClick={onClose} />
      <div className="search__panel">
        <form className="search__form" onSubmit={submit}>
          <input
            ref={inputRef}
            className="search__input"
            type="search"
            placeholder="Search products, categories…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="button" className="search__close" onClick={onClose}>Close</button>
        </form>

        {!q && (
          <div className="search__suggest">
            <span className="label">Browse</span>
            <div className="search__chips">
              {CATEGORIES.map((c) => (
                <button key={c.slug} onClick={() => { navigate(`/shop/${c.slug}`); onClose(); }}>
                  {c.name}
                </button>
              ))}
              <button onClick={() => { navigate('/wholesale'); onClose(); }}>Wholesale</button>
            </div>
          </div>
        )}

        {q && (
          <div className="search__results">
            {results.length === 0 && <p className="search__empty">No products match “{q}”.</p>}
            {results.map((p) => (
              <button
                key={p.id}
                className="search__result"
                onClick={() => { navigate(`/product/${p.slug}`); onClose(); }}
              >
                <ProductImage product={p} className="search__thumb" ratio="1 / 1" />
                <span className="search__rmeta">
                  <span className="search__rname">{p.name}</span>
                  <span className="search__rcat">{p.category}</span>
                </span>
                <Price product={p} className="search__rprice" note={false} showCompare={false} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
