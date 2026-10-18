import Seo from '../components/ui/Seo.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Button from '../components/ui/Button.jsx';

export default function AboutPage() {
  return (
    <div className="u-wrap page-narrow about-page">
      <Seo title="About" description="AZRAA is a wholesale-focused commerce company supplying clothing, footwear and staple foods across Asia and Africa." />
      <span className="label">About</span>
      <h1 className="page-title">A supplier, first</h1>

      <Reveal className="prose">
        <p>
          AZRAA is a wholesale-focused commerce company. We supply clothing,
          footwear and accessories to businesses and consumers across Asia and
          Africa, with staple foods planned as the next category.
        </p>
        <p>
          The model is simple: buy well, hold real stock, price to volume, and
          make purchasing straightforward whether the order is a single piece or
          a full container. Retailers, distributors, resellers, institutions and
          individual customers all buy from the same catalogue, on terms that
          suit their scale.
        </p>
        <h2>Markets</h2>
        <p>
          Our core markets are India and Nigeria, with regional pricing, local
          payment methods and delivery already in place. We ship more widely
          across Asia and Africa, and add currencies and payment options as we
          grow.
        </p>
        <h2>Standard</h2>
        <p>
          Everything is specced and checked to a retail standard before it
          ships, the wholesale price reflects the volume, not a drop in
          quality.
        </p>
        <h2>Company information</h2>
        <p className="muted">
          Registered company name and number, registered office, facilities,
          sourcing partners and leadership will be published here. This section
          is a placeholder pending confirmed details.
        </p>
      </Reveal>

      <div className="row-gap">
        <Button to="/wholesale">Wholesale</Button>
        <Button to="/contact" variant="outline">Contact us</Button>
      </div>
    </div>
  );
}
