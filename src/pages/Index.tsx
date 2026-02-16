import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import QuoteLine from "@/components/QuoteLine";
import SponsoredBanner from "@/components/SponsoredBanner";
import HeroSection from "@/components/HeroSection";
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

      {/* Hero Section - Featured + Latest + 6 Cards + Ad */}
      <HeroSection />

      {/* Our Districts */}
      <SpecialSections />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
