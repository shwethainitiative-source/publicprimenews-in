import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
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
      <SponsoredBanner />

      {/* Hero Section */}
      <HeroSection />

      {/* Special Sections */}
      <SpecialSections />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
