import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import CountryPicker from './CountryPicker.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import MobileMenu from './MobileMenu.jsx';
import SearchOverlay from './SearchOverlay.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/shop/men', label: 'Men' },
  { to: '/shop/shoes', label: 'Shoes' },
  { to: '/shop/bags', label: 'Bags' },
  { to: '/shop/ladies', label: 'Ladies' },
  { to: '/wholesale', label: 'Wholesale' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { count, setOpen: setCartOpen } = useCart();
  const { isAuthed } = useAuth();

  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  return (
    <>
      <header className={`hdr ${scrolled ? 'is-solid' : 'is-over'}`}>
        <div className="hdr__inner">
          <div className="hdr__left">
            <button className="hdr__burger" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
              <span /><span /><span />
            </button>
            <Logo />
          </div>

          <nav className="hdr__nav" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `hdr__link ${isActive ? 'is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hdr__right">
            <button className="hdr__icon" aria-label="Search" onClick={() => setSearchOpen(true)}><SearchIcon /></button>
            <button
              className="hdr__icon hdr__icon--account"
              aria-label={isAuthed ? 'Your account' : 'Sign in'}
              onClick={() => navigate(isAuthed ? '/account' : '/sign-in')}
            >
              <UserIcon />
            </button>
            <CountryPicker />
            <ThemeToggle className="hdr__icon" />
            <button className="hdr__bag" aria-label={`Bag, ${count} item${count === 1 ? '' : 's'}`} onClick={() => setCartOpen(true)}>
              <BagIcon />
              <span className="hdr__bag-count">{count}</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} nav={NAV} isAuthed={isAuthed} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.6-3.6" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
  </svg>
);
const BagIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
