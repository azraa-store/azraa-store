import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';

/**
 * The official Azraa lockup, emblem + wordmark in one mark.
 * Light theme -> original colours.  Dark theme -> warm off-white rendering.
 * The mark carries the "AZRAA" wordmark itself, so no separate text is drawn.
 */
export default function Logo({ compact = false, className = '' }) {
  const { isDark } = useTheme();
  const src = isDark ? '/brand/logo-mono.png' : '/brand/logo-color.png';
  return (
    <Link
      to="/"
      className={`logo ${compact ? 'logo--compact' : ''} ${className}`}
      aria-label="AZRAA, home"
    >
      <img className="logo__mark" src={src} alt="AZRAA" width="43" height="42" />
    </Link>
  );
}
