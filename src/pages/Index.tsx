import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import SponsoredBanner from "@/components/SponsoredBanner";
import FeaturedNews from "@/components/FeaturedNews";
import Sidebar from "@/components/Sidebar";
import PopularNewsSection from "@/components/PopularNewsSection";
import FeaturedNewsSection from "@/components/FeaturedNewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <NavigationBar />
      <BreakingNewsTicker />
      <SponsoredBanner />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="lg:w-2/3">
            <FeaturedNews />
          </div>
          <div className="lg:w-1/3 flex flex-col">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* Popular News Section */}
      <PopularNewsSection />

      {/* Featured News Section */}
      <FeaturedNewsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
