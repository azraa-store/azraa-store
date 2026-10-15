import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import CountryPicker from './CountryPicker.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function MobileMenu({ open, onClose, nav, isAuthed, wishCount = 0 }) {
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => { if (!open) setOpenGroup(null); }, [open]);

  return (
    <div className={`mmenu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="mmenu__bar">
        <span className="mmenu__title">Menu</span>
        <button className="mmenu__close" onClick={onClose} aria-label="Close menu">Close</button>
      </div>

      <nav className="mmenu__nav" aria-label="Mobile">
        {nav.map((item) => {
          if (!item.items) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `mmenu__link ${isActive ? 'is-active' : ''}`}
                onClick={onClose}
              >
                {item.label}
              </NavLink>
            );
          }
          const isOpen = openGroup === item.label;
          return (
            <div key={item.label} className={`mmenu__group ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="mmenu__link mmenu__group-trigger"
                aria-expanded={isOpen}
                onClick={() => setOpenGroup(isOpen ? null : item.label)}
              >
                {item.label}
                <span className="mmenu__chevron" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              <div className="mmenu__sublist">
                {item.items.map((sub) => (
                  <NavLink
                    key={sub.to}
                    to={sub.to}
                    end={sub.end}
                    className={({ isActive }) => `mmenu__sublink ${isActive ? 'is-active' : ''}`}
                    onClick={onClose}
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="mmenu__foot">
        <Link className="mmenu__account" to={isAuthed ? '/account' : '/sign-in'} onClick={onClose}>
          {isAuthed ? 'Your account' : 'Sign in / Create account'}
        </Link>
        <Link className="mmenu__account" to="/wishlist" onClick={onClose}>
          Wishlist{wishCount > 0 ? ` (${wishCount})` : ''}
        </Link>
        <div className="mmenu__region">
          <span>Region</span>
          <CountryPicker align="left" />
        </div>
        <div className="mmenu__region">
          <span>Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
