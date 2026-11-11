import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { addReview, getReviews, getSummary, myReview } from '../../services/reviews.js';
import StarRating from './StarRating.jsx';

export default function ProductReviews({ productId }) {
  const { user, isAuthed } = useAuth();
  const [reviews, setReviews] = useState(() => getReviews(productId));
  const summary = getSummary(productId);
  const existing = myReview(productId, user?.id);
  const [form, setForm] = useState(existing || { rating: 0, title: '', body: '' });
  const [editing, setEditing] = useState(!existing);
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.rating) return;
    addReview(productId, { userId: user.id, name: user.name, ...form });
    setReviews(getReviews(productId));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="reviews" id="reviews">
      <div className="reviews__head">
        <h2 className="hsec__title">Reviews</h2>
        <StarRating value={summary.average} count={summary.count} size={18} />
      </div>

      {isAuthed ? (
        editing ? (
          <form className="reviews__form" onSubmit={submit}>
            <span className="reviews__form-label">{existing ? 'Edit your review' : 'Write a review'}</span>
            <StarRating value={form.rating} onRate={(rating) => setForm({ ...form, rating })} size={22} />
            <input
              className="input"
              placeholder="Title (optional)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="input reviews__textarea"
              placeholder="What did you think of it?"
              rows={3}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
            <div className="reviews__form-actions">
              <button type="submit" className="btn btn--primary btn--sm" disabled={!form.rating}>
                {existing ? 'Update review' : 'Post review'}
              </button>
              {existing && (
                <button type="button" className="link" onClick={() => setEditing(false)}>Cancel</button>
              )}
            </div>
          </form>
        ) : (
          <p className="reviews__done">
            {saved ? 'Thanks, your review is posted. ' : 'You reviewed this product. '}
            <button type="button" className="link" onClick={() => setEditing(true)}>Edit it</button>
          </p>
        )
      ) : (
        <p className="reviews__signin">
          <Link to="/sign-in" className="link">Sign in</Link> to write a review.
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="muted">No reviews yet — be the first.</p>
      ) : (
        <ul className="reviews__list">
          {reviews.map((r) => (
            <li key={r.userId} className="reviews__item">
              <StarRating value={r.rating} size={13} />
              {r.title && <strong className="reviews__item-title">{r.title}</strong>}
              {r.body && <p className="reviews__item-body">{r.body}</p>}
              <span className="reviews__item-meta">
                {r.name} · {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
