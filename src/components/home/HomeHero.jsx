import Button from '../ui/Button.jsx';

/**
 * The hero is the full editorial product photograph (assets/hero.png, prepped to
 * a clean 4K by scripts/process-hero.py). It is shown complete and uncropped —
 * every garment, bag and shoe in frame — with the AZRAA copy set over the open
 * concrete on the left.
 */
function HeroCopy() {
  return (
    <div className="home-hero__copy">
      <p className="home-hero__eyebrow">Est. supply — Asia &amp; Africa</p>
      <h1 className="home-hero__word">AZRAA</h1>
      <p className="home-hero__tag">Wholesale. Retail.<br />Across Asia &amp; Africa.</p>
      <div className="home-hero__cta">
        <Button to="/shop" size="lg">Shop Retail</Button>
        <Button to="/wholesale" size="lg" variant="outline">Shop Wholesale</Button>
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
          alt="The AZRAA range — crew tees, shirts, bags and footwear on warm concrete"
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
