import { Clock } from "lucide-react";

const latestNews = [
  {
    id: "1",
    title: "ಮುಂಬೈನಲ್ಲಿ ಭಾರೀ ಪ್ರವಾಹ, ದೈನಂದಿನ ಜೀವನ ಅಸ್ತವ್ಯಸ್ತ",
    image: "/placeholder.svg",
    time: "15 ನಿಮಿಷಗಳ ಹಿಂದೆ",
  },
  {
    id: "2",
    title: "ಕಾಂಗ್ರೆಸ್ ಬಂಡಾಯ ನಾಯಕ ಊಹಾಪೋಹಕ್ಕೆ ಕಾರಣ",
    image: "/placeholder.svg",
    time: "25 ನಿಮಿಷಗಳ ಹಿಂದೆ",
  },
  {
    id: "3",
    title: "ಹುಬ್ಬಳ್ಳಿಯಲ್ಲಿ ಭಾರೀ ದರೋಡೆ",
    image: "/placeholder.svg",
    time: "1 ಗಂಟೆ ಹಿಂದೆ",
  },
  {
    id: "4",
    title: "ಪ್ರಧಾನಿ ಮೋದಿ ಸ್ವಾವಲಂಬಿ ಮೈದಾನ ಉದ್ಘಾಟನೆ",
    image: "/placeholder.svg",
    time: "2 ಗಂಟೆ ಹಿಂದೆ",
  },
];

const categories = [
  { id: "crime", label: "CRIME", labelKn: "ಅಪರಾಧ", color: "bg-red-600" },
  { id: "education", label: "EDUCATION", labelKn: "ಶಿಕ್ಷಣ", color: "bg-blue-600" },
  { id: "politics", label: "POLITICS", labelKn: "ರಾಜಕೀಯ", color: "bg-green-600" },
  { id: "health", label: "HEALTH", labelKn: "ಆರೋಗ್ಯ", color: "bg-amber-600" },
];

const LatestNewsCategorySection = () => {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Latest News List (2/3) */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
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
                  alt={news.title}
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

        {/* Right - Category Cards 2x2 + Ad (1/3) */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative rounded-lg overflow-hidden cursor-pointer group h-[130px]"
              >
                <img
                  src="/placeholder.svg"
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-accent/40 group-hover:bg-accent/50 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className={`${cat.color} text-white text-xs font-bold px-2 py-1 rounded`}>
                    {cat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ad banner below categories */}
          <div className="mt-4 bg-muted border border-border rounded-lg flex items-center justify-center h-16">
            <span className="text-muted-foreground text-sm font-bold tracking-[0.3em] uppercase">
              Advertisement
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNewsCategorySection;
