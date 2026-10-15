import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import CountryPicker from './CountryPicker.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import MobileMenu from './MobileMenu.jsx';
import SearchOverlay from './SearchOverlay.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Primary nav, grouped the way a fashion retailer organises a header: a
// standalone Home link, then labelled groups (Collections / Wholesale /
// Company) that open a dropdown of their member pages.
export const NAV = [
  { to: '/', label: 'Home', end: true },
  {
    label: 'Collections',
    base: '/shop',
    items: [
      { to: '/shop', label: 'Shop All', end: true },
      { to: '/shop/men', label: 'Men' },
      { to: '/shop/ladies', label: 'Ladies' },
      { to: '/shop/shoes', label: 'Shoes' },
      { to: '/shop/bags', label: 'Bags' },
    ],
  },
  {
    label: 'Wholesale',
    base: '/wholesale',
    items: [
      { to: '/wholesale', label: 'Buy Wholesale', end: true },
      { to: '/wholesale/enquiry', label: 'Trade Account' },
    ],
  },
  {
    label: 'Company',
    items: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
    ],
  },
];

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { count, setOpen: setCartOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const { isAuthed } = useAuth();

  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setOpenGroup(null); }, [pathname]);

  const openGroupNow = (label) => {
    clearTimeout(closeTimer.current);
    setOpenGroup(label);
  };
  const closeGroupSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenGroup(null), 150);
  };

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
            {NAV.map((item) => {
              if (!item.items) {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `hdr__link ${isActive ? 'is-active' : ''}`}
                  >
                    {item.label}
                  </NavLink>
                );
              }
              const isGroupActive = item.items.some((sub) =>
                sub.end ? pathname === sub.to : pathname.startsWith(sub.to)
              );
              const isOpen = openGroup === item.label;
              return (
                <div
                  key={item.label}
                  className="hdr__group"
                  onMouseEnter={() => openGroupNow(item.label)}
                  onMouseLeave={closeGroupSoon}
                >
                  {item.base ? (
                    <NavLink
                      to={item.base}
                      className={() => `hdr__link hdr__link--group ${isGroupActive ? 'is-active' : ''}`}
                      onFocus={() => openGroupNow(item.label)}
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <button
                      type="button"
                      className={`hdr__link hdr__link--group ${isGroupActive ? 'is-active' : ''}`}
                      aria-expanded={isOpen}
                      onClick={() => setOpenGroup(isOpen ? null : item.label)}
                      onFocus={() => openGroupNow(item.label)}
                    >
                      {item.label}
                    </button>
                  )}
                  <div className={`hdr__dropdown ${isOpen ? 'is-open' : ''}`}>
                    {item.items.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        end={sub.end}
                        className={({ isActive }) => `hdr__dropdown-link ${isActive ? 'is-active' : ''}`}
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hdr__right">
            <button className="hdr__icon" aria-label="Search" onClick={() => setSearchOpen(true)}><SearchIcon /></button>
            <button
              className="hdr__icon hdr__icon--wish"
              aria-label={`Wishlist, ${wishCount} item${wishCount === 1 ? '' : 's'}`}
              onClick={() => navigate('/wishlist')}
            >
              <HeartIcon />
              {wishCount > 0 && <span className="hdr__icon-count">{wishCount}</span>}
            </button>
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

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} nav={NAV} isAuthed={isAuthed} wishCount={wishCount} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.6-3.6" />
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M12 20.3 4.6 13c-2-2-2-5.3 0-7.3 2-2 5.2-2 7.1 0l.3.3.3-.3c2-2 5.2-2 7.1 0 2 2 2 5.3 0 7.3L12 20.3Z" />
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
