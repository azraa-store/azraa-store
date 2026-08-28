import HomeHero from '../components/home/HomeHero.jsx';
import {
  CategoriesSection,
  FeaturedSection,
  WholesaleSection,
  WhySection,
  RegionalSection,
  AboutSection,
  NewsletterSection,
} from '../components/home/HomeSections.jsx';
import Seo from '../components/ui/Seo.jsx';

export default function HomePage() {
  return (
    <div className="home">
      <Seo
        title="Wholesale & Retail across Asia and Africa"
        description="AZRAA supplies clothing, footwear and staple foods to businesses and consumers across Asia and Africa. Wholesale pricing and retail purchasing, in your local currency."
      />
      <HomeHero />
      <div className="home__content">
        <CategoriesSection />
        <FeaturedSection />
        <WholesaleSection />
        <WhySection />
        <RegionalSection />
        <AboutSection />
        <NewsletterSection />
      </div>
    </div>
  );
}
