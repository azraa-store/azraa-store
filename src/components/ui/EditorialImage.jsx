import { useState } from 'react';

/**
 * A real lifestyle/editorial photograph where one exists at `src`, otherwise
 * a quiet placeholder naming what belongs there — mirrors ProductImage's
 * real-photo-or-plate pattern, but for brand/lifestyle imagery rather than
 * per-product shots. Drop the generated file at `src` once it exists and
 * this renders it automatically; nothing else needs to change.
 */
export default function EditorialImage({ src, alt, ratio = '16 / 9', label, className = '' }) {
  const [errored, setErrored] = useState(false);

  if (src && !errored) {
    return (
      <div className={`edimg ${className}`} style={{ aspectRatio: ratio }}>
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setErrored(true)} />
      </div>
    );
  }

  return (
    <div className={`edimg edimg--plate ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={alt}>
      <span className="edimg__mark">AZRAA</span>
      <span className="edimg__label">{label || 'Lifestyle photography — coming soon'}</span>
    </div>
  );
}
