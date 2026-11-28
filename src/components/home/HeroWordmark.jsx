/**
 * A bespoke-styled "azraa" lockup for the hero, not a plain CSS heading.
 * Lowercase, in the quiet-confidence register of marks like Myntra's rather
 * than a shouted all-caps logotype. Built from Bodoni Moda (a high-contrast
 * Didone, same family the spec asks for) with hand-tuned per-letter spacing
 * and a signature underline flourish — true custom letterforms need a type
 * designer, not hand-coded SVG paths, so this is a refined styling treatment
 * of an existing face rather than original glyph outlines.
 *
 * `variant` swaps the fill between the espresso (default) and champagne-gold
 * readings the brief asks for; both are plain flat color, no gradients/bevels.
 */
const LETTERS = [
  { ch: 'a', x: 0 },
  { ch: 'z', x: 134 },
  { ch: 'r', x: 260 },
  { ch: 'a', x: 358 },
  { ch: 'a', x: 490 },
];

export default function HeroWordmark({ variant = 'espresso', className = '' }) {
  const fill = variant === 'gold' ? 'var(--hero-gold)' : 'currentColor';
  return (
    <svg
      className={`hero-wordmark ${className}`}
      viewBox="0 0 640 150"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <text
        y="120"
        fontFamily="'Bodoni Moda', Georgia, 'Times New Roman', serif"
        fontWeight="500"
        fontSize="200"
        fill={fill}
      >
        {LETTERS.map(({ ch, x }, i) => (
          <tspan key={i} x={x}>{ch}</tspan>
        ))}
      </text>
      <path
        d="M4 140 Q 320 130 636 140"
        fill="none"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
