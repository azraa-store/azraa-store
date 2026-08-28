import { Link } from 'react-router-dom';
import { useState } from 'react';
import CountryPicker from './CountryPicker.jsx';
import { useRegion } from '../../context/RegionContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Footer() {
  const { country } = useRegion();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const columns = [
    {
      title: 'Shop',
      links: [
        ['All products', '/shop'],
        ['Men', '/shop/men'],
        ['Shoes', '/shop/shoes'],
        ['Bags', '/shop/bags'],
        ['Ladies', '/shop/ladies'],
      ],
    },
    {
      title: 'Trade',
      links: [
        ['Wholesale', '/wholesale'],
        ['Open a trade account', '/wholesale/enquiry'],
        ['About AZRAA', '/about'],
        ['Contact', '/contact'],
      ],
    },
    {
      title: 'Support',
      links: [
        ['Shipping', '/legal/shipping'],
        ['Returns & refunds', '/legal/returns'],
        ['Privacy', '/legal/privacy'],
        ['Terms', '/legal/terms'],
      ],
    },
  ];

  return (
    <footer className="ftr">
      <div className="u-wrap ftr__inner">
        <div className="ftr__brand">
          <img src={isDark ? '/brand/logo-mono.png' : '/brand/logo-color.png'} alt="AZRAA" width="104" height="101" className="ftr__mark" />
          <p className="ftr__line">
            Wholesale and retail supply of clothing, footwear and accessories
            across Asia and Africa.
          </p>
          <div className="ftr__region">
            <span className="label">Shipping to</span>
            <CountryPicker align="left" />
            <span className="ftr__region-note">
              {country.name} · prices in {country.currency}
            </span>
          </div>
        </div>

        <div className="ftr__cols">
          {columns.map((col) => (
            <nav key={col.title} className="ftr__col" aria-label={col.title}>
              <h3 className="ftr__col-title">{col.title}</h3>
              <ul>
                {col.links.map(([label, to]) => (
                  <li key={to}><Link to={to}>{label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="ftr__col ftr__news">
            <h3 className="ftr__col-title">Newsletter</h3>
            {done ? (
              <p className="ftr__news-done">Thank you — you’re on the list.</p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email.trim()) setDone(true); }}
                className="ftr__news-form"
              >
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
                <button type="submit" aria-label="Subscribe">→</button>
              </form>
            )}
            <p className="ftr__news-fine">
              Occasional notes on new stock and trade terms. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="u-wrap ftr__bottom">
        <span>© {new Date().getFullYear()} AZRAA. All rights reserved.</span>
        <span className="ftr__bottom-meta">
          <Link to="/legal/privacy">Privacy</Link>
          <Link to="/legal/terms">Terms</Link>
          <span>Registered company details to follow.</span>
        </span>
      </div>
    </footer>
  );
}
