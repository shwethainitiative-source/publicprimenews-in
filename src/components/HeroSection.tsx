import { Clock } from "lucide-react";

const heroNews = {
  id: "1",
  title: "SL Ramesh Joins Modi to Boost 'Yatra Ida'...",
  titleKn: "ಎಸ್‌ಎಲ್ ರಮೇಶ್ ಮೋದಿ ಜೊತೆ ಸೇರಿ 'ಯಾತ್ರಾ ಇಡಾ' ಬಲಪಡಿಸಲು...",
  image: "/placeholder.svg",
  time: "3 ನಿಮಿಷಗಳ ಹಿಂದೆ",
};

const sideNews = [
  {
    id: "2",
    title: "Bengaluru: Miscreants Torch Car in Broad Daylight",
    titleKn: "ಬೆಂಗಳೂರು: ಹಗಲಿನಲ್ಲೇ ಕಾರಿಗೆ ಬೆಂಕಿ ಹಚ್ಚಿದ ದುಷ್ಕರ್ಮಿಗಳು",
    image: "/placeholder.svg",
    time: "5 ನಿಮಿಷಗಳ ಹಿಂದೆ",
  },
  {
    id: "3",
    title: "Excitement Among Parents as SSLC Toppers Announced",
    titleKn: "SSLC ಟಾಪರ್ಸ್ ಘೋಷಣೆ: ಪೋಷಕರಲ್ಲಿ ಸಂಭ್ರಮ",
    image: "/placeholder.svg",
    time: "10 ನಿಮಿಷಗಳ ಹಿಂದೆ",
  },
];

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left - Large Featured */}
        <div className="lg:col-span-2">
          <article className="relative rounded-lg overflow-hidden group cursor-pointer bg-card shadow-md h-full">
            <img
              src={heroNews.image}
              alt={heroNews.titleKn}
              className="w-full h-[300px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className="text-accent-foreground text-xl md:text-2xl font-extrabold leading-tight mb-2">
                {heroNews.titleKn}
              </h2>
              <div className="flex items-center gap-1.5 text-accent-foreground/70 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{heroNews.time}</span>
              </div>
            </div>
          </article>
        </div>

        {/* Right - 2 Stacked Cards */}
        <div className="flex flex-col gap-4">
          {sideNews.map((news) => (
            <article
              key={news.id}
              className="relative rounded-lg overflow-hidden group cursor-pointer bg-card shadow-md flex-1"
            >
              <img
                src={news.image}
                alt={news.titleKn}
                className="w-full h-full min-h-[150px] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-accent-foreground text-sm md:text-base font-bold leading-snug mb-1">
                  {news.titleKn}
                </h3>
                <div className="flex items-center gap-1 text-accent-foreground/70 text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>{news.time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
