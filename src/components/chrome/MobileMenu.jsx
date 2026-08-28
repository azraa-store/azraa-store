import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import CountryPicker from './CountryPicker.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function MobileMenu({ open, onClose, nav, isAuthed }) {
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

  return (
    <div className={`mmenu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="mmenu__bar">
        <span className="mmenu__title">Menu</span>
        <button className="mmenu__close" onClick={onClose} aria-label="Close menu">Close</button>
      </div>

      <nav className="mmenu__nav" aria-label="Mobile">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `mmenu__link ${isActive ? 'is-active' : ''}`}
            onClick={onClose}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mmenu__foot">
        <Link className="mmenu__account" to={isAuthed ? '/account' : '/sign-in'} onClick={onClose}>
          {isAuthed ? 'Your account' : 'Sign in / Create account'}
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
