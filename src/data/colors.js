// Shared colour palette. Products opt into a subset; each colour can later carry
// its own product image (see ProductImage / product.images.byColor).

export const COLORS = {
  White: { name: 'White', hex: '#f1efe7' },
  Black: { name: 'Black', hex: '#1b1b1b' },
  Green: { name: 'Green', hex: '#3f5d43' },
  Grey: { name: 'Grey', hex: '#8b8b86' },
  Red: { name: 'Red', hex: '#9c2b25' },
  Blue: { name: 'Blue', hex: '#2f4a6b' },
  Yellow: { name: 'Yellow', hex: '#d7b34c' },
  Beige: { name: 'Beige', hex: '#d8c9ab' },
  Brown: { name: 'Brown', hex: '#4a3528' },
  Charcoal: { name: 'Charcoal', hex: '#36363a' },
  Cream: { name: 'Cream', hex: '#efe6d3' },
  Tan: { name: 'Tan', hex: '#c7a97a' },
  Olive: { name: 'Olive', hex: '#5c6240' },
  Sage: { name: 'Sage', hex: '#a3b093' },
  Multi: { name: 'Multi', hex: '#6b5a4d' },
};

export const colorList = (names = []) => names.map((n) => COLORS[n]).filter(Boolean);
