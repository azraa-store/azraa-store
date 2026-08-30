import { Outlet, useLocation } from 'react-router-dom';
import Header from '../chrome/Header.jsx';
import Footer from '../chrome/Footer.jsx';
import CartDrawer from '../chrome/CartDrawer.jsx';
import FxNote from '../chrome/FxNote.jsx';
import WhatsAppFab from '../chrome/WhatsAppFab.jsx';
import AzraaBot from '../chrome/AzraaBot.jsx';

const BARE = ['/sign-in', '/sign-up', '/reset-password'];

export default function RootLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const bare = BARE.includes(pathname);

  if (bare) {
    return (
      <div className="app app--bare">
        <a className="skip-link" href="#main">Skip to content</a>
        <main id="main"><Outlet /></main>
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className={`app ${isHome ? 'app--home' : 'app--inner'}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" className="app__main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FxNote />
      <WhatsAppFab />
      <AzraaBot />
    </div>
  );
}
