import Seo from '../components/ui/Seo.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Button from '../components/ui/Button.jsx';
import EditorialImage from '../components/ui/EditorialImage.jsx';

const DIFFERENTIATORS = [
  {
    title: 'Retail and wholesale, one catalogue',
    body: 'Every product on AZRAA carries both a retail price and a wholesale price. There is no separate "trade site" with a different range — browse once, buy either way.',
  },
  {
    title: 'Real stock, not a dropship list',
    body: 'We hold inventory and check it against every order before it confirms, so a sale on the site is stock we actually have, not a listing waiting on a third party.',
  },
  {
    title: 'Pricing you can see, in your currency',
    body: 'Prices convert to your local currency automatically, from one published cross-rate — not a marked-up checkout surprise.',
  },
  {
    title: 'People, not just a form',
    body: 'WhatsApp and email reach a person who can actually answer a stock, sizing or wholesale question — not a ticket queue.',
  },
];

export default function AboutPage() {
  return (
    <div className="u-wrap page about-page">
      <Seo
        title="About AZRAA"
        description="AZRAA supplies clothing, footwear and accessories at both retail and wholesale pricing, worldwide. Here's what the brand is and how it works."
      />

      <Reveal>
        <span className="label">About AZRAA</span>
        <h1 className="page-title">Built for how people actually buy</h1>
        <p className="about-page__lede">
          AZRAA supplies clothing, footwear and accessories — to individual
          customers buying one piece, and to retailers and distributors
          buying by the volume, on the same catalogue, at the same time.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <EditorialImage
          src="/lifestyle/about-banner.jpg"
          alt="People wearing AZRAA pieces in everyday, real settings"
          ratio="21 / 9"
          className="about-page__banner"
          label="Lifestyle photography — coming soon"
        />
      </Reveal>

      <Reveal delay={120} className="about-page__section">
        <h2 className="about-page__h2">What AZRAA is</h2>
        <p>
          We're a supplier first: tees, shirts, outerwear, footwear and bags,
          bought well and held as real stock, then sold two ways from the
          same listing. A single customer can order one piece at a retail
          price. A shop, distributor or bulk buyer can order from the same
          page at a wholesale price and minimum order quantity. Nothing
          about the product changes between the two — only the price, the
          quantity, and the logistics rate.
        </p>
      </Reveal>

      <div className="about-page__grid">
        {DIFFERENTIATORS.map((d, i) => (
          <Reveal key={d.title} delay={i * 70} className="about-page__card">
            <h3>{d.title}</h3>
            <p>{d.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="about-page__cta">
        <h2 className="about-page__h2">However you're buying</h2>
        <p>Shop a single piece, or open an account for volume pricing — both start from the same catalogue.</p>
        <div className="about-page__cta-row">
          <Button to="/shop" size="lg">Shop retail</Button>
          <Button to="/wholesale/enquiry" size="lg" variant="outline">Open a wholesale account</Button>
        </div>
      </Reveal>
    </div>
  );
}
