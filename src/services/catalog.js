// Catalogue access. Async so it can be swapped for a real API. Inactive
// categories (Food, for now) are filtered out of every storefront query.

import { PRODUCTS, getProduct, getHeroProduct, anyPrice } from '../data/products.js';
import { activeCategories, getCategory, isActiveCategory } from '../data/categories.js';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const storefront = () => PRODUCTS.filter((p) => isActiveCategory(p.category));

export async function listCategories() {
  await delay(0);
  return activeCategories();
}

export async function listProducts({ category, subcategory, search, sort, featured } = {}) {
  await delay(30);
  let out = storefront();

  if (category) out = out.filter((p) => p.category === category);
  if (subcategory) out = out.filter((p) => p.subcategory === subcategory);
  if (featured) out = out.filter((p) => p.featured);

  if (search) {
    const q = search.trim().toLowerCase();
    out = out.filter((p) =>
      [p.name, p.summary, p.category, p.subcategory, ...(p.tags || [])]
        .join(' ').toLowerCase().includes(q)
    );
  }

  const priced = (p) => Number(anyPrice(p));
  switch (sort) {
    case 'price-asc':
      out.sort((a, b) => (a.pricing.retail.usd ?? 1e9) - (b.pricing.retail.usd ?? 1e9));
      break;
    case 'price-desc':
      out.sort((a, b) => (b.pricing.retail.usd ?? -1) - (a.pricing.retail.usd ?? -1));
      break;
    case 'name':
      out.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // featured first, then priced-and-available before coming-soon
      out.sort((a, b) => Number(b.featured) - Number(a.featured) || priced(b) - priced(a));
  }
  return out;
}

export async function getProductBySlug(slug) {
  await delay(20);
  const p = getProduct(slug);
  if (!p || !isActiveCategory(p.category)) return null;
  const related = storefront()
    .filter((r) => r.id !== p.id && (r.category === p.category || r.subcategory === p.subcategory))
    .slice(0, 3);
  return { ...p, related };
}

export async function getFeatured(limit = 4) {
  await delay(20);
  return storefront().filter((p) => p.featured).slice(0, limit);
}

export { getCategory, getHeroProduct };
