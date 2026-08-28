// Sample catalogue. Shape = the API contract.
//
// PRICING — every product carries a RETAIL and a WHOLESALE price, each as
// { inr, usd }. INR figures are the supplied source of truth; the USD figure is
// the canonical cross-rate reference, derived once at CONFIG_INR_PER_USD.
//   • customer in India  -> the exact INR figure
//   • customer in the US -> the USD figure (shown by default)
//   • anywhere else      -> USD converted live to their currency (services/fx.js)
//
// Wholesale is a direct purchase, not an enquiry: the customer picks a quantity
// (at or above the product's MOQ) and checks out at the wholesale unit price.
//
// INVENTORY: real per-variant quantities live in services/inventory.js + the
// Python tool. Here we only carry the low-stock threshold.

import { colorList } from './colors.js';

// Rate used to derive the USD reference from the supplied INR prices.
export const CONFIG_INR_PER_USD = 90;
export const toUSD = (inr) => Math.round((inr / CONFIG_INR_PER_USD) * 100) / 100;
const price = (inr) => ({ inr, usd: toUSD(inr) });

const sizes = (labels) => labels.map((label) => ({ label }));

export const PRODUCTS = [
  /* ─────────────────────────────  MEN  ───────────────────────────── */
  {
    id: 'azr-tee-round',
    slug: 'round-neck-t-shirt',
    name: 'Round Neck T-Shirt',
    category: 'men',
    subcategory: 'T-shirts',
    hero: true,
    featured: true,
    unit: 'piece',
    plate: { motif: 'RN' },
    images: { primary: null, gallery: [], byColor: {} },
    summary: 'A clean crew-neck tee for everyday wear, priced for volume.',
    description:
      'A clean-lined crew-neck tee built for daily wear. Soft, mid-weight jersey with a smooth, dry handle and a ribbed neckline that holds its shape wash after wash. Regular fit — close to the body without clinging — with twin-needle hems for durability. The everyday staple of the range.',
    details: [
      'Ribbed crew neckline',
      'Regular fit, straight hem',
      'Twin-needle sleeve and bottom hems',
      'Full colour and size runs held for wholesale',
    ],
    fit: 'Regular fit. Take your usual size; size up for a looser drape.',
    care: ['Machine wash cold, inside out', 'Do not bleach', 'Tumble dry low or dry flat', 'Warm iron if needed'],
    colors: colorList(['White', 'Black', 'Grey', 'Green', 'Blue']),
    sizes: sizes(['S', 'M', 'L', 'XL', 'XXL']),
    modes: ['retail', 'wholesale'],
    pricing: { retail: price(180), wholesale: price(130) },
    wholesale: { moq: 12, unitHint: 'sold from 12 pieces', packSize: 12 },
    inventory: { lowStockThreshold: 12 },
    tags: ['core', 'tee', 'unisex'],
  },
  {
    id: 'azr-tee-collar',
    slug: 'collar-neck-t-shirt',
    name: 'Collar Neck T-Shirt',
    category: 'men',
    subcategory: 'T-shirts',
    featured: true,
    unit: 'piece',
    plate: { motif: 'CN' },
    images: { primary: null, gallery: [], byColor: {} },
    summary: 'A collared polo-style tee — smart, breathable, easy to layer.',
    description:
      'A collared tee that sits between a polo and a t-shirt. A structured, flat-knit collar and a short placket lift it for smart-casual wear, while the soft jersey body keeps it easy. Regular fit, ribbed cuffs on the sleeves, a straight hem you can wear in or out.',
    details: ['Flat-knit collar, short button placket', 'Ribbed sleeve cuffs', 'Regular fit, straight hem'],
    fit: 'Regular fit. True to size.',
    care: ['Machine wash cold', 'Do not bleach', 'Dry flat', 'Warm iron'],
    colors: colorList(['White', 'Black', 'Grey']),
    sizes: sizes(['S', 'M', 'L', 'XL', 'XXL']),
    modes: ['retail', 'wholesale'],
    pricing: { retail: price(240), wholesale: price(175) },
    wholesale: { moq: 12, unitHint: 'sold from 12 pieces', packSize: 12 },
    inventory: { lowStockThreshold: 12 },
    tags: ['polo', 'smart-casual'],
  },
  {
    id: 'azr-singlet-gym',
    slug: 'gym-singlet',
    name: 'Gym Singlet',
    category: 'men',
    subcategory: 'Singlets',
    featured: false,
    unit: 'piece',
    plate: { motif: 'GS' },
    images: { primary: null, gallery: [], byColor: {} },
    summary: 'A cut-away training singlet with a dropped armhole.',
    description:
      'A training singlet cut for movement — a dropped armhole and a slightly scooped neck give the shoulders room, and the lightweight jersey moves sweat off the skin. Cut close through the body so it stays put under a hoodie or on its own.',
    details: ['Dropped armhole', 'Scooped neck', 'Close fit through the body', 'Lightweight jersey'],
    fit: 'Close fit. Size up for a relaxed cut.',
    care: ['Machine wash cold', 'Do not bleach', 'Dry flat', 'Do not iron'],
    colors: colorList(['White', 'Black', 'Grey', 'Red']),
    sizes: sizes(['S', 'M', 'L', 'XL']),
    modes: ['retail', 'wholesale'],
    pricing: { retail: price(140), wholesale: price(100) },
    wholesale: { moq: 12, unitHint: 'sold from 12 pieces', packSize: 12 },
    inventory: { lowStockThreshold: 12 },
    tags: ['training', 'singlet'],
  },
  {
    id: 'azr-singlet-standard',
    slug: 'standard-singlet',
    name: 'Standard Singlet',
    category: 'men',
    subcategory: 'Singlets',
    featured: false,
    unit: 'piece',
    plate: { motif: 'SS' },
    images: { primary: null, gallery: [], byColor: {} },
    summary: 'The everyday vest — a plain, mid-weight base layer.',
    description:
      'The plain vest, done properly. Mid-weight jersey with standard-width straps and a straight neckline, cut for a regular fit so it works as a base layer or on its own. Bound edges at the neck and armholes hold their shape.',
    details: ['Standard straps', 'Bound neck and armhole edges', 'Regular fit', 'Mid-weight jersey'],
    fit: 'Regular fit. True to size.',
    care: ['Machine wash cold', 'Do not bleach', 'Tumble dry low', 'Warm iron if needed'],
    colors: colorList(['White', 'Black']),
    sizes: sizes(['S', 'M', 'L', 'XL']),
    modes: ['retail', 'wholesale'],
    pricing: { retail: price(120), wholesale: price(85) },
    wholesale: { moq: 12, unitHint: 'sold from 12 pieces', packSize: 12 },
    inventory: { lowStockThreshold: 12 },
    tags: ['base-layer', 'singlet'],
  },

  /* ─────────────────────────────  SHOES  ───────────────────────────── */
  {
    id: 'azr-shoe-leather',
    slug: 'leather-shoes',
    name: 'Leather Shoes',
    category: 'shoes',
    subcategory: 'Shoes',
    featured: true,
    unit: 'pair',
    plate: { motif: 'LS' },
    images: { primary: null, gallery: [], byColor: {} },
    summary: 'A clean derby in leather, made to be resoled.',
    description:
      'A pared-back derby shoe with a leather upper and a low, even heel. A plain rounded toe and minimal stitching keep it versatile — equally at home with trousers or denim. Built on a construction that can be resoled, so it lasts.',
    details: ['Leather upper', 'Plain rounded toe', 'Low stacked heel', 'Resoleable construction', 'Sizes in UK'],
    fit: 'True to size; half sizes round up. Wide feet may prefer a half size up.',
    care: ['Wipe clean with a soft cloth', 'Condition the leather periodically', 'Use shoe trees to hold shape', 'Air-dry away from direct heat'],
    colors: colorList(['Black', 'Grey']),
    sizes: sizes(['UK6', 'UK7', 'UK8', 'UK9', 'UK10', 'UK11']),
    modes: ['retail', 'wholesale'],
    pricing: { retail: price(1800), wholesale: price(1300) },
    wholesale: { moq: 6, unitHint: 'sold from 6 pairs', packSize: 6 },
    inventory: { lowStockThreshold: 6 },
    tags: ['leather', 'formal'],
  },
  {
    id: 'azr-shoe-canvas',
    slug: 'leather-canvas',
    name: 'Leather Canvas',
    category: 'shoes',
    subcategory: 'Shoes',
    featured: false,
    unit: 'pair',
    plate: { motif: 'LC' },
    images: { primary: null, gallery: [], byColor: {} },
    summary: 'A low canvas sneaker with leather trims.',
    description:
      'A low-profile canvas sneaker finished with leather at the toe cap and heel. A vulcanised rubber sole and a slim silhouette keep it neat; the canvas upper breaks in quickly and cleans up easily. An everyday shoe that goes with everything.',
    details: ['Canvas upper, leather toe cap and heel', 'Vulcanised rubber sole', 'Cotton laces', 'Sizes in UK'],
    fit: 'True to size. Runs slightly narrow.',
    care: ['Spot clean the canvas', 'Wipe the leather trims with a damp cloth', 'Air-dry, do not machine wash'],
    colors: colorList(['White', 'Black', 'Grey']),
    sizes: sizes(['UK6', 'UK7', 'UK8', 'UK9', 'UK10', 'UK11']),
    modes: ['retail', 'wholesale'],
    pricing: { retail: price(1400), wholesale: price(1000) },
    wholesale: { moq: 6, unitHint: 'sold from 6 pairs', packSize: 6 },
    inventory: { lowStockThreshold: 6 },
    tags: ['canvas', 'sneaker', 'everyday'],
  },
  {
    id: 'azr-sandal-standard',
    slug: 'sandals',
    name: 'Sandals',
    category: 'shoes',
    subcategory: 'Sandals',
    featured: false,
    unit: 'pair',
    plate: { motif: 'SD' },
    images: { primary: null, gallery: [], byColor: {} },
    summary: 'A two-strap sandal on a cushioned footbed.',
    description:
      'A simple two-strap slide on a contoured, cushioned footbed. The straps are adjustable at the buckle for a secure fit, and a grippy outsole handles wet ground. Unisex sizing.',
    details: ['Two adjustable straps', 'Contoured cushioned footbed', 'Grip outsole', 'Sizes in EU, unisex'],
    fit: 'Unisex EU sizing. If between sizes, size down.',
    care: ['Wipe clean with a damp cloth', 'Air-dry away from heat'],
    colors: colorList(['Black', 'Grey']),
    sizes: sizes(['EU39', 'EU40', 'EU41', 'EU42', 'EU43', 'EU44']),
    modes: ['retail', 'wholesale'],
    pricing: { retail: price(600), wholesale: price(430) },
    wholesale: { moq: 8, unitHint: 'sold from 8 pairs', packSize: 8 },
    inventory: { lowStockThreshold: 8 },
    tags: ['sandal', 'summer', 'unisex'],
  },
  {
    id: 'azr-sandal-leather',
    slug: 'leather-sandals',
    name: 'Leather Sandals',
    category: 'shoes',
    subcategory: 'Sandals',
    featured: true,
    unit: 'pair',
    plate: { motif: 'LD' },
    images: { primary: null, gallery: [], byColor: {} },
    summary: 'A leather-strap sandal with a moulded footbed.',
    description:
      'A more considered sandal — leather straps over a moulded footbed that shapes to the foot with wear. Brushed metal buckles, a stitched-edge sole and a low heel. Made to be worn every day through the warm months.',
    details: ['Leather straps, brushed buckles', 'Moulded footbed', 'Stitched-edge sole, low heel', 'Sizes in EU'],
    fit: 'True to size. The footbed moulds in over the first few wears.',
    care: ['Wipe clean with a soft cloth', 'Condition the leather occasionally', 'Air-dry away from heat'],
    colors: colorList(['Black']),
    sizes: sizes(['EU39', 'EU40', 'EU41', 'EU42', 'EU43', 'EU44']),
    modes: ['retail', 'wholesale'],
    pricing: { retail: price(950), wholesale: price(685) },
    wholesale: { moq: 8, unitHint: 'sold from 8 pairs', packSize: 8 },
    inventory: { lowStockThreshold: 8 },
    tags: ['leather', 'sandal', 'summer'],
  },

  /* ─────────────────────────────  BAGS  ───────────────────────────── */
  {
    id: 'azr-bag-sling',
    slug: 'sling-bags',
    name: 'Sling Bags',
    category: 'bags',
    subcategory: 'Sling bags',
    featured: true,
    unit: 'piece',
    plate: { motif: 'SB' },
    images: { primary: null, gallery: [], byColor: {} },
    summary: 'A compact cross-body sling for daily carry.',
    description:
      'A compact sling made to sit across the body and stay out of the way. One main compartment with an internal slip pocket, a secure zip, and an adjustable webbing strap. Sized for a phone, wallet, keys and a small water bottle.',
    details: ['Main zip compartment, internal slip pocket', 'Adjustable webbing strap', 'Front quick-access pocket', 'One size'],
    fit: null,
    care: ['Spot clean with a damp cloth', 'Air-dry, do not machine wash'],
    colors: colorList(['Black', 'Grey']),
    sizes: null,
    modes: ['retail', 'wholesale'],
    pricing: { retail: price(800), wholesale: price(575) },
    wholesale: { moq: 6, unitHint: 'sold from 6 pieces', packSize: 6 },
    inventory: { lowStockThreshold: 10 },
    tags: ['bag', 'cross-body', 'everyday'],
  },

  /* ─────────────────────────────  LADIES  ───────────────────────────── */
  {
    id: 'azr-bag-ladies-leather',
    slug: 'ladies-leather-bags',
    name: 'Leather Bags',
    category: 'ladies',
    subcategory: 'Bags',
    featured: true,
    unit: 'piece',
    plate: { motif: 'LB' },
    images: { primary: null, gallery: [], byColor: {} },
    summary: 'A structured leather bag, cut clean and finished by hand.',
    description:
      'A structured leather bag with a clean, architectural shape. A wide opening and a lined interior with a zip pocket make it practical; a top handle and a detachable shoulder strap make it versatile. Hand-finished edges and a minimal hardware set.',
    details: ['Leather exterior, lined interior', 'Top handle and detachable shoulder strap', 'Internal zip pocket', 'Hand-finished edges', 'One size'],
    fit: null,
    care: ['Wipe clean with a soft dry cloth', 'Condition the leather periodically', 'Store stuffed, out of direct sun'],
    colors: colorList(['Black', 'Red']),
    sizes: null,
    modes: ['retail', 'wholesale'],
    pricing: { retail: price(1600), wholesale: price(1150) },
    wholesale: { moq: 6, unitHint: 'sold from 6 pieces', packSize: 6 },
    inventory: { lowStockThreshold: 6 },
    tags: ['leather', 'bag', 'ladies'],
  },
];

export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug);
export const getProductById = (id) => PRODUCTS.find((p) => p.id === id);
export const getHeroProduct = () => PRODUCTS.find((p) => p.hero) || PRODUCTS[0];

// Every product now carries both prices; kept for call-site safety.
export const hasPrice = (product, mode) => Boolean(product?.pricing?.[mode]?.usd != null);
export const anyPrice = (product) => hasPrice(product, 'retail') || hasPrice(product, 'wholesale');
