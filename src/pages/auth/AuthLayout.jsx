import { Link } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';

export default function AuthLayout({ title, intro, children, alt }) {
  return (
    <div className="auth">
      <Seo title={title} />
      <div className="auth__panel">
        <Link to="/" className="auth__mark">AZRAA</Link>
        <h1 className="auth__title">{title}</h1>
        {intro && <p className="auth__intro">{intro}</p>}
        {children}
        {alt && <p className="auth__alt">{alt}</p>}
      </div>
      <aside className="auth__aside" aria-hidden="true">
        <img src="/textures/garment-reference.png" alt="" />
        <p className="auth__aside-quote">One garment at a time, made completely.</p>
      </aside>
    </div>
  );
}
