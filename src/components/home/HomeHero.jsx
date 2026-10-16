import { useState } from 'react';
import Button from '../ui/Button.jsx';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

/**
 * The hero is the full editorial product photograph (assets/hero.png, prepped to
 * a clean 4K by scripts/process-hero.py). It is shown complete and uncropped —
 * every garment, bag and shoe in frame — with the AZRAA copy set over the open
 * marble counter on the left. A short muted intro clip (assets/hero-intro.mp4,
 * prepped by scripts/process-hero-video.py) autoplays once on top of it, then
 * fades out to reveal the same still photo underneath — no layout shift, since
 * the clip's 16:9 frame is cropped to match the photo's aspect via object-fit.
 * Skipped entirely for prefers-reduced-motion.
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
  const reducedMotion = usePrefersReducedMotion();
  const [introEnded, setIntroEnded] = useState(false);

  return (
    <section className="home-hero home-hero--still">
      <div className="home-hero__still">
        <img
          src="/textures/hero-range.jpg"
          alt="The AZRAA range — crew tees, shirts, bags and footwear displayed on a sunlit boutique rail"
          sizes="100vw"
          fetchpriority="high"
        />
        {!reducedMotion && (
          <video
            className={`home-hero__intro ${introEnded ? 'is-ended' : ''}`}
            src="/textures/hero-intro.mp4"
            poster="/textures/hero-intro-poster.jpg"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => setIntroEnded(true)}
            aria-hidden="true"
          />
        )}
        <div className="home-hero__wash" aria-hidden="true" />
        <div className="home-hero__vignette" aria-hidden="true" />
      </div>
      <div className="home-hero__stage home-hero__stage--static">
        <HeroCopy />
      </div>
    </section>
  );
}
