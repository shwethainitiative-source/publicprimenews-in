import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import SponsoredBanner from "@/components/SponsoredBanner";
import FeaturedNews from "@/components/FeaturedNews";
import Sidebar from "@/components/Sidebar";
import PopularNewsSection from "@/components/PopularNewsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <NavigationBar />
      <BreakingNewsTicker />
      <SponsoredBanner />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Featured */}
          <div className="lg:col-span-2">
            <FeaturedNews />
          </div>

          {/* Right - Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* Popular News Section */}
      <PopularNewsSection />

      {/* Footer */}
      <footer className="bg-nav text-nav-foreground py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p className="font-bold text-lg mb-1">ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್</p>
          <p className="text-nav-foreground/60">
            © {new Date().getFullYear()} ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
