import HomeHero from '../components/home/HomeHero.jsx';
import {
  CategoriesSection,
  FeaturedSection,
  WholesaleSection,
  WhySection,
  RegionalSection,
  NewsletterSection,
} from '../components/home/HomeSections.jsx';
import Seo from '../components/ui/Seo.jsx';

export default function HomePage() {
  return (
    <div className="home">
      <Seo
        title="Wholesale & Retail, Worldwide"
        description="AZRAA supplies clothing, footwear and staple foods to businesses and consumers worldwide. Wholesale pricing and retail purchasing, in your local currency."
      />
      <HomeHero />
      <div className="home__content">
        <CategoriesSection />
        <FeaturedSection />
        <WholesaleSection />
        <WhySection />
        <RegionalSection />
        <NewsletterSection />
      </div>
    </div>
  );
}
