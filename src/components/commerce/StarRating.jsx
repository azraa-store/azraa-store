const Star = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="m12 3.5 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8Z" strokeLinejoin="round" />
  </svg>
);

/** Display-only stars (average, 1-5). Pass `onRate` to make it an input. */
export default function StarRating({ value = 0, count, onRate, size = 15 }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onRate === 'function';
  return (
    <span className={`star-rating ${interactive ? 'star-rating--input' : ''}`} style={{ '--star-size': `${size}px` }}>
      {stars.map((n) =>
        interactive ? (
          <button
            key={n}
            type="button"
            className="star-rating__star"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => onRate(n)}
          >
            <Star filled={n <= value} />
          </button>
        ) : (
          <span key={n} className="star-rating__star" aria-hidden="true">
            <Star filled={n <= Math.round(value)} />
          </span>
        )
      )}
      {typeof count === 'number' && (
        <span className="star-rating__count">
          {value > 0 ? value.toFixed(1) : '—'} {count > 0 && `(${count})`}
        </span>
      )}
    </span>
  );
}
