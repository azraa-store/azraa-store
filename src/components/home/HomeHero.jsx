import Button from '../ui/Button.jsx';

/**
 * The hero is the full editorial product photograph (assets/hero.png, prepped to
 * a clean 4K by scripts/process-hero.py). It is shown complete and uncropped —
 * every garment, bag and shoe in frame — with the AZRAA copy set over the open
 * marble counter on the left.
 */
function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 12h16" /><path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function HeroCopy() {
  return (
    <div className="home-hero__copy">
      <p className="home-hero__eyebrow">Est. supply — Asia &amp; Africa</p>
      <h1 className="home-hero__word">AZRAA</h1>
      <p className="home-hero__tag">Wholesale. Retail.<br />Across Asia &amp; Africa.</p>
      <div className="home-hero__cta">
        <Button to="/shop" size="lg">Shop Retail <Arrow /></Button>
        <Button to="/wholesale" size="lg" variant="outline">Explore Wholesale <Arrow /></Button>
      </div>
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="home-hero home-hero--still">
      <div className="home-hero__still">
        <img
          src="/textures/hero-range.jpg"
          alt="The AZRAA range — crew tees, shirts, bags and footwear displayed on a sunlit boutique rail"
          sizes="100vw"
          fetchpriority="high"
        />
        <div className="home-hero__wash" aria-hidden="true" />
        <div className="home-hero__vignette" aria-hidden="true" />
      </div>
      <div className="home-hero__stage home-hero__stage--static">
        <HeroCopy />
      </div>
    </section>
  );
}
