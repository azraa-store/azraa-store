import Seo from '../components/ui/Seo.jsx';
import Button from '../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="u-wrap page-narrow notfound">
      <Seo title="Page not found" />
      <span className="notfound__code">404</span>
      <h1 className="page-title">This page has moved on</h1>
      <p className="muted">The page you’re looking for isn’t here.</p>
      <div className="row-gap">
        <Button to="/">Home</Button>
        <Button to="/shop" variant="outline">Shop</Button>
      </div>
    </div>
  );
}
