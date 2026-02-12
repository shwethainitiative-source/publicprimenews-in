import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import SponsoredBanner from "@/components/SponsoredBanner";
import HeroSection from "@/components/HeroSection";
import LatestNewsCategorySection from "@/components/LatestNewsCategorySection";
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

      {/* Latest News + Category Section */}
      <LatestNewsCategorySection />

      {/* Full-Width Ad Banner */}
      <div className="container mx-auto px-4 py-2">
        <div className="bg-muted border border-border rounded-lg flex items-center justify-center h-16">
          <span className="text-muted-foreground text-sm font-bold tracking-[0.3em] uppercase">
            Advertisement
          </span>
        </div>
      </div>

      {/* Special Sections */}
      <SpecialSections />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
