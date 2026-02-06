import { Search } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="flex border border-border rounded overflow-hidden">
        <input
          type="text"
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2.5 text-sm bg-card text-card-foreground placeholder:text-muted-foreground outline-none"
        />
        <button className="bg-search-btn text-search-btn-foreground px-4 flex items-center justify-center hover:opacity-90 transition-opacity">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Quote of the day */}
      <div className="bg-quote text-quote-foreground rounded-lg p-5">
        <h3 className="text-sm font-bold mb-3 border-b border-quote-foreground/20 pb-2">
          ಧೀ ಟ್ರುಥ್ ಆಫ್ ಟುಡೇ (ಸುಭಾಷಿತ)
        </h3>
        <div className="flex items-start gap-3 mb-3">
          <span className="text-xs text-muted-foreground whitespace-nowrap">12 min ago</span>
        </div>
        <div className="flex items-start gap-2 mb-3">
          <div className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-xs font-bold shrink-0">
            ✍
          </div>
          <span className="text-xs text-quote-foreground/70">ಲೇಖಕ</span>
        </div>
        <blockquote className="text-lg md:text-xl font-bold leading-relaxed">
          "ನೀವು ಕಲಿಯುವುದನ್ನು ನಿಲ್ಲಿಸಿದಾಗ ಬೆಳೆಯುವುದನ್ನು ನಿಲ್ಲಿಸುತ್ತೀರಿ"
        </blockquote>
      </div>

      {/* Latest news cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-foreground text-base border-b-2 border-primary pb-1">
          ಇತ್ತೀಚಿನ ಸುದ್ದಿ
        </h3>
        {[
          { title: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಹೊಸ ನೀತಿ ಘೋಷಣೆ", time: "25 min ago" },
          { title: "ಉಡುಪಿ ಜಿಲ್ಲೆಯಲ್ಲಿ ಅಭಿವೃದ್ಧಿ ಕಾಮಗಾರಿ ಪ್ರಾರಂಭ", time: "1 hour ago" },
          { title: "ಕನ್ನಡ ಸಾಹಿತ್ಯ ಸಮ್ಮೇಳನ ಯಶಸ್ವಿ ಸಮಾಪ್ತಿ", time: "2 hours ago" },
        ].map((news, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded p-3 hover:shadow-md transition-shadow cursor-pointer"
          >
            <span className="text-xs text-muted-foreground">{news.time}</span>
            <h4 className="text-sm font-semibold text-card-foreground mt-1 leading-snug">
              {news.title}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
