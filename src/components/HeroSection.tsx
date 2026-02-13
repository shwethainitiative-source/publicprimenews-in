import { Clock } from "lucide-react";

const heroNews = {
  id: "1",
  title: "SL Ramesh Joins Modi to Boost 'Yatra Ida'...",
  titleKn: "ಎಸ್‌ಎಲ್ ರಮೇಶ್ ಮೋದಿ ಜೊತೆ ಸೇರಿ 'ಯಾತ್ರಾ ಇಡಾ' ಬಲಪಡಿಸಲು...",
  image: "/placeholder.svg",
  time: "3 ನಿಮಿಷಗಳ ಹಿಂದೆ",
};

const sideCards = [
  { id: "2", title: "Bengaluru: Miscreants Torch Car in Broad Daylight", titleKn: "ಬೆಂಗಳೂರು: ಹಗಲಿನಲ್ಲೇ ಕಾರಿಗೆ ಬೆಂಕಿ", image: "/placeholder.svg", time: "5 ನಿಮಿಷಗಳ ಹಿಂದೆ", label: "" },
  { id: "3", title: "Excitement Among Parents as SSLC Toppers Announced", titleKn: "SSLC ಟಾಪರ್ಸ್ ಘೋಷಣೆ", image: "/placeholder.svg", time: "10 ನಿಮಿಷಗಳ ಹಿಂದೆ", label: "" },
  { id: "4", title: "Gang of Thieves Arrested", titleKn: "ಕಳ್ಳರ ಗ್ಯಾಂಗ್ ಬಂಧನ", image: "/placeholder.svg", time: "1 ಗಂಟೆ ಹಿಂದೆ", label: "CRIME" },
  { id: "5", title: "New Education Policy Updates", titleKn: "ಹೊಸ ಶಿಕ್ಷಣ ನೀತಿ", image: "/placeholder.svg", time: "1 ಗಂಟೆ ಹಿಂದೆ", label: "EDUCATION" },
  { id: "6", title: "Political Developments in Karnataka", titleKn: "ಕರ್ನಾಟಕ ರಾಜಕೀಯ", image: "/placeholder.svg", time: "2 ಗಂಟೆ ಹಿಂದೆ", label: "POLITICS" },
  { id: "7", title: "Health Department Advisory", titleKn: "ಆರೋಗ್ಯ ಇಲಾಖೆ ಸಲಹೆ", image: "/placeholder.svg", time: "2 ಗಂಟೆ ಹಿಂದೆ", label: "HEALTH" },
];

const latestNews = [
  { id: "l1", title: "Massive Flooding in Mumbai Disrupts Daily Life", titleKn: "ಮುಂಬೈನಲ್ಲಿ ಭಾರೀ ಪ್ರವಾಹ", image: "/placeholder.svg", time: "15 ನಿಮಿಷಗಳ ಹಿಂದೆ" },
  { id: "l2", title: "Congress Rebel Leader Sparks Speculation", titleKn: "ಕಾಂಗ್ರೆಸ್ ಬಂಡಾಯ ನಾಯಕ", image: "/placeholder.svg", time: "25 ನಿಮಿಷಗಳ ಹಿಂದೆ" },
  { id: "l3", title: "Major Robbery in Hubballi", titleKn: "ಹುಬ್ಬಳ್ಳಿಯಲ್ಲಿ ಭಾರೀ ದರೋಡೆ", image: "/placeholder.svg", time: "1 ಗಂಟೆ ಹಿಂದೆ" },
  { id: "l4", title: "PM Modi Inaugurates Swavalambi Maidan in Hubballi", titleKn: "ಪ್ರಧಾನಿ ಮೋದಿ ಉದ್ಘಾಟನೆ", image: "/placeholder.svg", time: "2 ಗಂಟೆ ಹಿಂದೆ" },
];

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {/* LEFT COLUMN (2/3) — Big card + Latest News */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Big Featured News */}
          <article className="rounded-lg overflow-hidden group cursor-pointer bg-card shadow-md">
            <img
              src={heroNews.image}
              alt={heroNews.titleKn}
              className="w-full h-[250px] md:h-[340px] object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="text-card-foreground text-xl md:text-2xl font-extrabold leading-tight mb-2">
                {heroNews.title}
              </h2>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{heroNews.time}</span>
              </div>
            </div>
          </article>

          {/* Latest News List */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-extrabold whitespace-nowrap uppercase tracking-wide">
                Latest News
              </h2>
              <div className="flex-1 h-0.5 bg-primary" />
            </div>
            <div className="divide-y divide-border">
              {latestNews.map((news) => (
                <article
                  key={news.id}
                  className="flex gap-3 cursor-pointer group py-3 first:pt-0 last:pb-0"
                >
                  <img
                    src={news.image}
                    alt={news.titleKn}
                    className="w-24 h-18 rounded object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold leading-snug line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
                      {news.title}
                    </h4>
                    <div className="flex items-center gap-1 mt-1.5 text-muted-foreground text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{news.time}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3) — 6 cards (2×3) + Ad */}
        <div className="flex flex-col gap-4 h-full">
          <div className="grid grid-cols-2 gap-3 flex-1">
            {sideCards.map((card) => (
              <article
                key={card.id}
                className="relative rounded-lg overflow-hidden group cursor-pointer h-[140px]"
              >
                <img
                  src={card.image}
                  alt={card.titleKn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  {card.label && (
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider mb-1 block">
                      {card.label}
                    </span>
                  )}
                  <h3 className="text-white text-xs font-bold leading-snug line-clamp-2">
                    {card.title}
                  </h3>
                  <div className="flex items-center gap-1 text-white/70 text-[10px] mt-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{card.time}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Advertisement */}
          <div className="bg-muted border border-border rounded-lg flex items-center justify-center h-14">
            <span className="text-muted-foreground text-sm font-bold tracking-[0.3em] uppercase">
              Advertisement
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
