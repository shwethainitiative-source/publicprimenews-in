import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import AdSlider from "@/components/AdSlider";

interface Article {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  thumbnail_url: string | null;
  created_at: string;
  is_featured: boolean;
  category_id: string | null;
  article_type?: string;
  categories?: { name: string } | null;
}

const HeroSection = () => {
  const { language, t } = useLanguage();
  const [featured, setFeatured] = useState<Article | null>(null);
  const [sideCards, setSideCards] = useState<Article[]>([]);
  const [latestNews, setLatestNews] = useState<Article[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      // Fetch 1 featured article
      const { data: featuredData } = await supabase
        .from("articles")
        .select("id, title, title_en, description, description_en, thumbnail_url, created_at, is_featured, category_id, article_type, categories(name)")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (featuredData?.[0]) setFeatured(featuredData[0] as Article);

      // Fetch 6 popular/recent for side cards
      const { data: sideData } = await supabase
        .from("articles")
        .select("id, title, title_en, thumbnail_url, created_at, category_id, categories(name)")
        .eq("is_popular", true)
        .order("created_at", { ascending: false })
        .limit(6);

      setSideCards((sideData as Article[]) ?? []);

      // Fetch 5 latest news
      const { data: latestData } = await supabase
        .from("articles")
        .select("id, title, title_en, thumbnail_url, created_at, category_id, categories(name)")
        .order("created_at", { ascending: false })
        .limit(5);

      setLatestNews((latestData as Article[]) ?? []);
    };

    fetchNews();
  }, []);

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return language === "kn" ? `${mins} ನಿಮಿಷಗಳ ಹಿಂದೆ` : `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return language === "kn" ? `${hours} ಗಂಟೆ ಹಿಂದೆ` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return language === "kn" ? `${days} ದಿನಗಳ ಹಿಂದೆ` : `${days}d ago`;
  };

  return (
    <section className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {/* LEFT COLUMN (2/3) — Big card + Latest News */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Big Featured News */}
          {featured ? (
            <Link to={`/article/${featured.id}`}>
              <article className="rounded-lg overflow-hidden group cursor-pointer bg-card shadow-md relative">
                {(featured.article_type === "live" || featured.article_type === "podcast") && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-green-600 px-3 py-1 rounded text-white text-xs font-bold uppercase">
                    {featured.article_type === "live" ? "LIVE" : "PODCAST"}
                    {featured.article_type === "live" && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  </div>
                )}
                <img
                  src={featured.thumbnail_url || "/placeholder.svg"}
                  alt={t(featured.title, featured.title_en)}
                  className="w-full h-[250px] md:h-[340px] object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-card-foreground text-xl md:text-2xl font-extrabold leading-tight mb-2">
                    {t(featured.title, featured.title_en)}
                  </h2>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(featured.created_at)}</span>
                  </div>
                </div>
              </article>
            </Link>
          ) : (
            <article className="rounded-lg overflow-hidden bg-card shadow-md h-[340px] flex items-center justify-center">
              <span className="text-muted-foreground">{language === "kn" ? "ಪ್ರಮುಖ ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ" : "No featured news"}</span>
            </article>
          )}

          {/* Latest News List */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-extrabold whitespace-nowrap uppercase tracking-wide">
                {language === "kn" ? "ಇತ್ತೀಚಿನ ಸುದ್ದಿ" : "Latest News"}
              </h2>
              <div className="flex-1 h-0.5 bg-primary" />
            </div>
            <div className="divide-y divide-border">
              {latestNews.map((news) => (
                <Link to={`/article/${news.id}`} key={news.id}>
                  <article className="flex gap-3 cursor-pointer group py-3 first:pt-0 last:pb-0">
                    <img
                      src={news.thumbnail_url || "/placeholder.svg"}
                      alt={t(news.title, news.title_en)}
                      className="w-24 h-[72px] rounded object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold leading-snug line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
                        {t(news.title, news.title_en)}
                      </h4>
                      <div className="flex items-center gap-1 mt-1.5 text-muted-foreground text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(news.created_at)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
              {latestNews.length === 0 && (
                <p className="text-muted-foreground text-center py-4 text-sm">
                  {language === "kn" ? "ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ" : "No news available"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3) — 6 cards (2×3) + Ad */}
        <div className="flex flex-col gap-4 h-full">
          <div className="grid grid-cols-2 gap-3 flex-1">
            {sideCards.length > 0 ? sideCards.map((card) => (
              <Link to={`/article/${card.id}`} key={card.id}>
                <article className="relative rounded-lg overflow-hidden group cursor-pointer min-h-[160px] h-full">
                  <img
                    src={card.thumbnail_url || "/placeholder.svg"}
                    alt={t(card.title, card.title_en)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    {card.categories?.name && (
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider mb-1 block">
                        {card.categories.name}
                      </span>
                    )}
                    <h3 className="text-white text-xs font-bold leading-snug line-clamp-2">
                      {t(card.title, card.title_en)}
                    </h3>
                    <div className="flex items-center gap-1 text-white/70 text-[10px] mt-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatTime(card.created_at)}</span>
                    </div>
                  </div>
                </article>
              </Link>
            )) : Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden bg-muted min-h-[160px] flex items-center justify-center">
                <span className="text-muted-foreground text-xs">{language === "kn" ? "ಸುದ್ದಿ" : "News"}</span>
              </div>
            ))}
          </div>

          {/* Advertisement */}
          <AdSlider showHeading={false} position="sidebar" aspectRatio="16/5" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
