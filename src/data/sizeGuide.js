// Generic, standard-industry size charts (not garment-specific lab
// measurements — AZRAA's supplier hasn't provided per-style measurements).
// Shown with a "general guide" disclaimer in SizeGuideModal, same spirit as
// every other "still needs real data" placeholder in this codebase: swap
// in real per-style numbers here if the supplier ever provides them.

// kind: 'measurements' -> cm/in toggle; 'conversion' -> fixed columns (no unit toggle, these are different sizing systems, not unit conversions of one measurement)

export const TOPS_CHART = {
  title: 'Tops',
  kind: 'measurements',
  columns: ['Chest', 'Length', 'Sleeve'],
  rows: [
    { size: 'S', cm: [92, 69, 61], in: [36, 27, 24] },
    { size: 'M', cm: [100, 71, 62], in: [39, 28, 24.5] },
    { size: 'L', cm: [108, 74, 64], in: [42, 29, 25] },
    { size: 'XL', cm: [116, 76, 65], in: [45, 30, 25.5] },
    { size: 'XXL', cm: [124, 79, 66], in: [48, 31, 26] },
  ],
};

export const BOTTOMS_CHART = {
  title: 'Bottoms',
  kind: 'measurements',
  columns: ['Waist', 'Hip', 'Inseam'],
  rows: [
    { size: 'S', cm: [73, 92, 76], in: [28.5, 36, 30] },
    { size: 'M', cm: [81, 100, 77], in: [32, 39, 30.5] },
    { size: 'L', cm: [89, 108, 79], in: [35, 42, 31] },
    { size: 'XL', cm: [97, 116, 80], in: [38, 45, 31.5] },
    { size: 'XXL', cm: [105, 124, 81], in: [41, 48, 32] },
  ],
};

export const SHOES_CHART = {
  title: 'Shoes',
  kind: 'conversion',
  columns: ['UK', 'EU', 'US'],
  rows: [
    { size: 'UK6', values: ['UK6', '39–40', '7'] },
    { size: 'UK7', values: ['UK7', '40–41', '8'] },
    { size: 'UK8', values: ['UK8', '42', '9'] },
    { size: 'UK9', values: ['UK9', '43', '10'] },
    { size: 'UK10', values: ['UK10', '44', '11'] },
    { size: 'UK11', values: ['UK11', '45–46', '12'] },
  ],
};

export const SANDALS_CHART = {
  title: 'Sandals',
  kind: 'conversion',
  columns: ['EU', 'UK', 'US'],
  rows: [
    { size: 'EU39', values: ['EU39', '6', '7'] },
    { size: 'EU40', values: ['EU40', '6.5', '7.5'] },
    { size: 'EU41', values: ['EU41', '7.5', '8.5'] },
    { size: 'EU42', values: ['EU42', '8', '9'] },
    { size: 'EU43', values: ['EU43', '9', '10'] },
    { size: 'EU44', values: ['EU44', '9.5', '10.5'] },
  ],
};

const BOTTOM_TAGS = new Set(['joggers', 'sweatpants', 'shorts', 'lounge']);

/** Which chart (if any) applies to a product, based on category/tags. */
export function sizeChartFor(product) {
  if (!product?.sizes?.length) return null;
  if (product.category === 'shoes') {
    return product.subcategory === 'Sandals' ? SANDALS_CHART : SHOES_CHART;
  }
  if (product.category !== 'men') return null; // bags/ladies: one-size, no chart
  const isBottom = product.tags?.some((t) => BOTTOM_TAGS.has(t));
  return isBottom ? BOTTOMS_CHART : TOPS_CHART;
}
