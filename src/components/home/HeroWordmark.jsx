/**
 * A bespoke-styled "AZRAA" lockup for the hero, not a plain CSS heading.
 * Built from Bodoni Moda (a high-contrast Didone, same family the spec asks
 * for) with hand-tuned per-letter spacing and a signature underline flourish
 * — true custom letterforms need a type designer, not hand-coded SVG paths,
 * so this is a refined styling treatment of an existing face rather than
 * original glyph outlines.
 *
 * `variant` swaps the fill between the espresso (default) and champagne-gold
 * readings the brief asks for; both are plain flat color, no gradients/bevels.
 */
const LETTERS = [
  { ch: 'A', x: 0 },
  { ch: 'Z', x: 108 },
  { ch: 'R', x: 222 },
  { ch: 'A', x: 330 },
  { ch: 'A', x: 442 },
];

export default function HeroWordmark({ variant = 'espresso', className = '' }) {
  const fill = variant === 'gold' ? 'var(--hero-gold)' : 'currentColor';
  return (
    <svg
      className={`hero-wordmark ${className}`}
      viewBox="0 0 560 150"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <text
        y="112"
        fontFamily="'Bodoni Moda', Georgia, 'Times New Roman', serif"
        fontWeight="500"
        fontSize="118"
        fill={fill}
      >
        {LETTERS.map(({ ch, x }, i) => (
          <tspan key={i} x={x}>{ch}</tspan>
        ))}
      </text>
      <path
        d="M4 138 Q 280 128 556 138"
        fill="none"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
