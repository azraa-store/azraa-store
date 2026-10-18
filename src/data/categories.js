// Product taxonomy. `active: false` keeps a category in the architecture but out
// of the storefront (Food is planned, not shown yet).

export const CATEGORIES = [
  {
    slug: 'men',
    name: 'Men',
    navLabel: 'Men',
    active: true,
    tagline: 'Everyday cotton, cleanly cut',
    blurb:
      'Tees and singlets built to a wholesale standard and finished like a small run. Full size and colour runs, packed for retail floors and single orders alike.',
    subcategories: ['T-shirts', 'Singlets', 'Hoodies & Sweatshirts', 'Joggers & Sweatpants', 'Polos', 'Shirts & Denim'],
  },
  {
    slug: 'shoes',
    name: 'Shoes',
    navLabel: 'Shoes',
    active: true,
    tagline: 'Leather footwear, cased and carried',
    blurb:
      'Leather shoes and sandals in full size runs. Made to be worn hard and resoled, packed for retail and personal wardrobes.',
    subcategories: ['Shoes', 'Sandals'],
  },
  {
    slug: 'bags',
    name: 'Bags',
    navLabel: 'Bags',
    active: true,
    tagline: 'Carry, considered',
    blurb: 'Everyday carry in leather and canvas, cross-body and sling shapes, made to last.',
    subcategories: ['Sling bags'],
  },
  {
    slug: 'ladies',
    name: 'Ladies',
    navLabel: 'Ladies',
    active: true,
    tagline: 'Leather goods for every day',
    blurb: 'Leather bags and accessories, cut clean and finished by hand.',
    subcategories: ['Bags'],
  },
  {
    slug: 'food',
    name: 'Food',
    navLabel: 'Food',
    active: false, // planned, not shown in the storefront yet
    tagline: 'Rice, grains and staples',
    blurb: 'Rice and staple foods, sourced and moved at scale. Coming soon.',
    subcategories: ['Rice', 'Grains', 'Staples'],
  },
];

export const activeCategories = () => CATEGORIES.filter((c) => c.active);
export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const isActiveCategory = (slug) => Boolean(getCategory(slug)?.active);
