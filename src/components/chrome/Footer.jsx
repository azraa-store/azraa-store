import { Link } from 'react-router-dom';
import { useState } from 'react';
import CountryPicker from './CountryPicker.jsx';
import { useRegion } from '../../context/RegionContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { WHATSAPP, whatsappLink } from '../../config/site.js';

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
          <a
            className="ftr__wa"
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 32 32" width="15" height="15" aria-hidden="true">
              <path fill="currentColor" d="M16.02 4c-6.63 0-12 5.37-12 12 0 2.11.55 4.17 1.6 5.99L4 28l6.18-1.6a11.9 11.9 0 0 0 5.83 1.52h.01c6.62 0 12-5.37 12-12s-5.38-11.92-12-11.92Zm0 21.82h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.67.96.98-3.58-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.45 9.92-9.92 9.92Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
            </svg>
            WhatsApp · {WHATSAPP.display}
          </a>
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
