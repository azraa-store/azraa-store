import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { getBalance, REDEEM_COST, REDEEM_VALUE } from '../../services/loyalty.js';

/** Shared rewards-redeem toggle, used in both the cart drawer and the full cart page. */
export default function LoyaltyRedeemField({ orderMode }) {
  const { user, isAuthed } = useAuth();
  const { loyaltyRedeemed, redeemLoyalty, unredeemLoyalty } = useCart();
  if (!isAuthed || orderMode !== 'retail') return null;

  const balance = getBalance(user.id);
  if (!loyaltyRedeemed && balance < REDEEM_COST) return null;

  if (loyaltyRedeemed) {
    return (
      <div className="promo-field promo-field--applied">
        <span>Rewards applied · ${REDEEM_VALUE.usd} off</span>
        <button type="button" onClick={unredeemLoyalty}>Remove</button>
      </div>
    );
  }

  return (
    <div className="promo-field">
      <div className="promo-field__row">
        <span className="loyalty-field__balance">{balance} points available</span>
        <button type="button" className="promo-field__apply" onClick={redeemLoyalty}>
          Redeem {REDEEM_COST} for ${REDEEM_VALUE.usd} off
        </button>
      </div>
    </div>
  );
}
