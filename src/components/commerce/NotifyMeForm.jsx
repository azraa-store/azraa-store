import { useState } from 'react';
import { subscribe, isSubscribed } from '../../services/backInStock.js';

/**
 * Compact "Notify Me" control for an out-of-stock product/variant. Mock
 * capture, same spirit as the newsletter forms — see backInStock.js for
 * what "notify" actually means here.
 */
export default function NotifyMeForm({ productId, color, size, className = '' }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(() => isSubscribed(productId, color, size, email));

  if (done) {
    return <p className={`notify-me notify-me--done ${className}`}>We'll email you when it's back.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        className={`notify-me__trigger ${className}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
      >
        Notify me when back in stock
      </button>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!/\S+@\S+\.\S+/.test(email)) return;
    subscribe(productId, color, size, email);
    setDone(true);
  };

  return (
    <form
      className={`notify-me ${className}`}
      onSubmit={submit}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="email"
        required
        placeholder="Email address"
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input notify-me__input"
      />
      <button type="submit" className="notify-me__submit">Notify me</button>
    </form>
  );
}
