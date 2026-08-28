import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 100000) / 100000;
}

/** Resolve the best available image source for a product (+ optional colour). */
export function resolveImage(product, color) {
  const im = product.images || {};
  if (color && im.byColor && im.byColor[color]) return im.byColor[color];
  return im.primary || null;
}

/**
 * A real photograph where one exists, otherwise a quiet generative "plate" that
 * adapts to the theme. Structured so colour-specific images drop in later.
 */
export default function ProductImage({ product, color, className = '', ratio = '4 / 5', priority = false, sizes }) {
  const { isDark } = useTheme();
  const seed = useMemo(() => hash(product.id + (color || '')), [product.id, color]);
  const src = resolveImage(product, color);

  if (src) {
    return (
      <div className={`pimg ${className}`} style={{ aspectRatio: ratio }}>
        <img
          src={src}
          alt={`${product.name}${color ? ` — ${color}` : ''}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          className="pimg__photo"
        />
      </div>
    );
  }

  const motif = product.plate?.motif || product.name.slice(0, 2).toUpperCase();
  const gid = `pl-${product.id}-${color || 'x'}`.replace(/[^a-z0-9-]/gi, '');
  const angle = 105 + Math.round(seed * 50);

  const bg0 = isDark ? '#26262a' : '#e6dfcd';
  const bg1 = isDark ? '#0e0e10' : '#d0c7b0';
  const bg2 = isDark ? '#08080a' : '#c1b79c';
  const ink = isDark ? '243, 240, 233' : '20, 18, 12';
  const motifOp = isDark ? 0.2 : 0.3;
  const labelOp = isDark ? 0.6 : 0.82;
  const markOp = isDark ? 0.55 : 0.68;

  return (
    <div className={`pimg pimg--plate ${className}`} style={{ aspectRatio: ratio }}>
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label={product.name}>
        <defs>
          <linearGradient id={`${gid}-g`} x1="0" y1="0" x2="1" y2="1" gradientTransform={`rotate(${angle} .5 .5)`}>
            <stop offset="0" stopColor={bg0} />
            <stop offset="0.55" stopColor={bg1} />
            <stop offset="1" stopColor={bg2} />
          </linearGradient>
          <linearGradient id={`${gid}-s`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={isDark ? '#fff' : '#fff'} stopOpacity={isDark ? '0.08' : '0.35'} />
            <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id={`${gid}-n`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.round(seed * 999)} stitchTiles="stitch" />
            <feColorMatrix type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${isDark ? 0.04 : 0.05} 0`} />
          </filter>
        </defs>
        <rect width="400" height="500" fill={`url(#${gid}-g)`} />
        <rect width="400" height="500" fill={`url(#${gid}-s)`} />
        <rect width="400" height="500" filter={`url(#${gid}-n)`} opacity="0.6" />
        <rect x="16" y="16" width="368" height="468" fill="none" stroke={`rgba(${ink}, 0.18)`} />
        <text x="30" y="42" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="15" letterSpacing="6" fill={`rgba(${ink}, ${markOp})`}>AZRAA</text>
        <text x="200" y="288" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="140" fontWeight="300" fill={`rgba(${ink}, ${motifOp})`} letterSpacing="6">{motif}</text>
        <line x1="30" y1="440" x2="120" y2="440" stroke={`rgba(${ink}, 0.4)`} />
        <text x="30" y="464" fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="4" fill={`rgba(${ink}, ${labelOp})`}>
          {(color || product.subcategory || product.category).toUpperCase()}
        </text>
      </svg>
    </div>
  );
}
