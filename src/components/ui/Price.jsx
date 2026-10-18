import { useRegion } from '../../context/RegionContext.jsx';
import { resolvePrice, displayPrice, formatMoney, amountIn } from '../../services/pricing.js';
import { roundForCurrency } from '../../services/fx.js';

/**
 * Region-aware price.
 *   <Price product={p} mode="retail" />   a specific mode
 *   <Price product={p} />                  retail (for cards / listings)
 *   <Price usd={0.44} inr={40} />          a raw reference amount (e.g. logistics)
 */
export default function Price({ product, mode, usd, inr, className = '' }) {
  const { currency, locale, rates } = useRegion();

  if (typeof usd === 'number') {
    const amt = roundForCurrency(amountIn({ inr, usd }, currency, rates), currency);
    return <span className={`price ${className}`}>{formatMoney(amt, currency, locale)}</span>;
  }

  const p = mode
    ? resolvePrice(product, mode, currency, rates, locale)
    : displayPrice(product, currency, rates, locale);

  if (p.status) return <span className={`price price--soon ${className}`}>Soon</span>;

  return <span className={`price ${className}`}><span className="price__amount">{p.formatted}</span></span>;
}
