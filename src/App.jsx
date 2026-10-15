import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { RegionProvider } from './context/RegionContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { AssistantProvider } from './context/AssistantContext.jsx';
import RootLayout from './components/layout/RootLayout.jsx';
import ScrollManager from './components/layout/ScrollManager.jsx';
import RouteFallback from './components/layout/RouteFallback.jsx';
import RegionModal from './components/chrome/RegionModal.jsx';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion.js';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'));
const WholesalePage = lazy(() => import('./pages/WholesalePage.jsx'));
const WholesaleEnquiryPage = lazy(() => import('./pages/WholesaleEnquiryPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const WishlistPage = lazy(() => import('./pages/WishlistPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const LegalPage = lazy(() => import('./pages/LegalPage.jsx'));
const SignInPage = lazy(() => import('./pages/auth/SignInPage.jsx'));
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage.jsx'));
const ResetPage = lazy(() => import('./pages/auth/ResetPage.jsx'));
const AccountPage = lazy(() => import('./pages/account/AccountPage.jsx'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

const wrap = (el) => <Suspense fallback={<RouteFallback />}>{el}</Suspense>;

export default function App() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ThemeProvider>
      <RegionProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AssistantProvider>
                <ScrollManager />
                <RegionModal />
                <Routes>
                  <Route element={<RootLayout reducedMotion={reducedMotion} />}>
                    <Route index element={wrap(<HomePage reducedMotion={reducedMotion} />)} />
                    <Route path="shop" element={wrap(<ShopPage />)} />
                    <Route path="shop/:category" element={wrap(<ShopPage />)} />
                    <Route path="product/:slug" element={wrap(<ProductPage reducedMotion={reducedMotion} />)} />
                    <Route path="wholesale" element={wrap(<WholesalePage />)} />
                    <Route path="wholesale/enquiry" element={wrap(<WholesaleEnquiryPage />)} />
                    <Route path="cart" element={wrap(<CartPage />)} />
                    <Route path="wishlist" element={wrap(<WishlistPage />)} />
                    <Route path="checkout" element={wrap(<CheckoutPage />)} />
                    <Route path="order/:id" element={wrap(<OrderConfirmationPage />)} />
                    <Route path="about" element={wrap(<AboutPage />)} />
                    <Route path="contact" element={wrap(<ContactPage />)} />
                    <Route path="legal/:doc" element={wrap(<LegalPage />)} />
                    <Route path="account/*" element={wrap(<AccountPage />)} />
                    <Route path="admin/*" element={wrap(<AdminPage />)} />
                    <Route path="sign-in" element={wrap(<SignInPage />)} />
                    <Route path="sign-up" element={wrap(<SignUpPage />)} />
                    <Route path="reset-password" element={wrap(<ResetPage />)} />
                    <Route path="*" element={wrap(<NotFoundPage />)} />
                  </Route>
                </Routes>
              </AssistantProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </RegionProvider>
    </ThemeProvider>
  );
}
