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
  thumbnail_url: string | null;
  created_at: string;
}

interface CategoryWithArticle {
  slug: string;
  name: string;
  article?: Article | null;
}

const categoryMeta = [
  { slug: "crime", color: "bg-red-600" },
  { slug: "education", color: "bg-blue-600" },
  { slug: "politics", color: "bg-green-600" },
  { slug: "health", color: "bg-amber-600" },
];

const LatestNewsCategorySection = () => {
  const { language, t } = useLanguage();
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [categoryCards, setCategoryCards] = useState<CategoryWithArticle[]>([]);

  useEffect(() => {
    // Fetch latest articles
    supabase
      .from("articles")
      .select("id, title, title_en, thumbnail_url, created_at")
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => setLatestNews((data as Article[]) ?? []));

    // Fetch category cards with latest article per category
    const fetchCategoryCards = async () => {
      const results: CategoryWithArticle[] = [];
      for (const meta of categoryMeta) {
        const { data: cats } = await supabase
          .from("categories")
          .select("id, name, slug")
          .eq("slug", meta.slug)
          .limit(1);
        if (cats?.[0]) {
          const { data: articles } = await supabase
            .from("articles")
            .select("id, title, title_en, thumbnail_url, created_at")
            .eq("category_id", cats[0].id)
            .order("created_at", { ascending: false })
            .limit(1);
          results.push({
            slug: meta.slug,
            name: cats[0].name,
            article: (articles?.[0] as Article) ?? null,
          });
        }
      }
      setCategoryCards(results);
    };
    fetchCategoryCards();
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
    <section className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Latest News List */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
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
                    className="w-24 h-18 rounded object-cover flex-shrink-0"
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

        {/* Right - Category Cards + Ad */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {categoryCards.map((cat, i) => (
              <Link to={`/category/${cat.slug}`} key={cat.slug}>
                <div className="relative rounded-lg overflow-hidden cursor-pointer group h-[130px]">
                  <img
                    src={cat.article?.thumbnail_url || "/placeholder.svg"}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-accent/40 group-hover:bg-accent/50 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className={`${categoryMeta[i]?.color ?? "bg-primary"} text-white text-xs font-bold px-2 py-1 rounded`}>
                      {cat.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {categoryCards.length === 0 && categoryMeta.map((meta) => (
              <div key={meta.slug} className="relative rounded-lg overflow-hidden bg-muted h-[130px] flex items-center justify-center">
                <span className="text-muted-foreground text-xs">{meta.slug}</span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <AdSlider showHeading={false} position="sidebar" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNewsCategorySection;
