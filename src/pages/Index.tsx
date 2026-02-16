import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import QuoteLine from "@/components/QuoteLine";
import SponsoredBanner from "@/components/SponsoredBanner";
import HeroSection from "@/components/HeroSection";
import FeaturedNewsSection from "@/components/FeaturedNewsSection";
import PopularNewsSection from "@/components/PopularNewsSection";
import LatestNewsCategorySection from "@/components/LatestNewsCategorySection";
import SpecialSections from "@/components/SpecialSections";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <NavigationBar />
      <BreakingNewsTicker />
      <QuoteLine />
      <SponsoredBanner />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured News */}
      <FeaturedNewsSection />

      {/* Popular News + Videos */}
      <PopularNewsSection />

      {/* Latest News + Categories */}
      <LatestNewsCategorySection />

      {/* Special Sections */}
      <SpecialSections />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
