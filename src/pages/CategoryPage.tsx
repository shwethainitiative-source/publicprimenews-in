import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import SponsoredCard from "@/components/SponsoredCard";
import ArticleLink from "@/components/ArticleLink";
import { getYoutubeThumbnail } from "@/lib/youtube";
import { Clock } from "lucide-react";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

const slugToCategoryMap: Record<string, { kn: string; en: string }> = {
  "nammura-suddi": { kn: "ನಮ್ಮೂರ ಸುದ್ದಿ", en: "Local News" },
  "udupi": { kn: "ಉಡುಪಿ", en: "Udupi" },
  "karkala": { kn: "ಕಾರ್ಕಳ", en: "Karkala" },
  "crime": { kn: "ಅಪರಾಧ ಲೋಕ", en: "Crime" },
  "politics": { kn: "ರಾಜಕೀಯ", en: "Politics" },
  "education": { kn: "ಶಿಕ್ಷಣ", en: "Education" },
  "health": { kn: "ಆರೋಗ್ಯವೇ ಭಾಗ್ಯ", en: "Health" },
  "agriculture": { kn: "ಕೃಷಿ ಮಾಹಿತಿ", en: "Agriculture" },
  "social-media": { kn: "ಸೋಷಿಯಲ್ ಮೀಡಿಯಾ ಕಥೆಗಳು", en: "Social Media Stories" },
  "write": { kn: "ಬರಹಗಾರರಾಗಿ, ನೀವು ಬರೆಯಿರಿ ..?", en: "Write for Us" },
  "interviews": { kn: "ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್ ಸಂದರ್ಶನಗಳು", en: "Interviews" },
  "voice-of-public": { kn: "ವಾಯ್ಸ್ ಆಫ್ ಪಬ್ಲಿಕ್", en: "Voice of Public" },
  "third-eye": { kn: "ಭ್ರಷ್ಟರ ಬೇಟೆಗೆ ಮೂರನೇ ಕಣ್ಣು..", en: "Third Eye" },
  "achievers": { kn: "ಸಾಧಕರ ಚರಿತ್ರೆ..", en: "Achievers" },
  "local-achievers": { kn: "ನಮ್ಮೂರ ಹೆಮ್ಮೆಯ ಸಾಧಕರು", en: "Local Achievers" },
  "kannadanadi": { kn: "ಕನ್ನಡನಾಡಿ", en: "Kannadanadi" },
};

interface Article {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  thumbnail_url: string | null;
  youtube_url: string | null;
  created_at: string;
  category_id: string | null;
}

interface Ad {
  id: string;
  image_url: string;
  redirect_link: string | null;
}

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [inlineAds, setInlineAds] = useState<Ad[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const categoryInfo = slug ? slugToCategoryMap[slug] : undefined;
  const pageTitle = categoryInfo
    ? language === "en" ? categoryInfo.en : categoryInfo.kn
    : slug || "";

  useEffect(() => {
    if (slug === "write") return;
    supabase.from("advertisements").select("id, image_url, redirect_link")
      .eq("is_enabled", true).eq("position", "below_news")
      .then(({ data }) => setInlineAds(data ?? []));
  }, [slug]);

  useEffect(() => {
    if (slug === "write") return;
    const fetchArticles = async () => {
      setLoading(true);
      let categoryId: string | null = null;
      if (slug) {
        const { data: cats } = await supabase
          .from("categories").select("id").eq("slug", slug).limit(1);
        categoryId = cats?.[0]?.id ?? null;
      }

      const from = (page - 1) * PAGE_SIZE;
      let query = supabase
        .from("articles")
        .select("id, title, title_en, description, description_en, thumbnail_url, youtube_url, created_at, category_id", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      } else {
        query = query.contains("tags", [slug || ""]);
      }

      const { data, count } = await query;
      setArticles((data as Article[]) ?? []);
      setTotalCount(count ?? 0);
      setLoading(false);
    };

    setPage(1);
    fetchArticles();
  }, [slug, categoryInfo]);

  useEffect(() => {
    if (slug === "write") return;
    if (page === 1) return;
    const fetchPage = async () => {
      setLoading(true);
      let categoryId: string | null = null;
      if (slug) {
        const { data: cats } = await supabase
          .from("categories").select("id").eq("slug", slug).limit(1);
        categoryId = cats?.[0]?.id ?? null;
      }
      const from = (page - 1) * PAGE_SIZE;
      let query = supabase
        .from("articles")
        .select("id, title, title_en, description, description_en, thumbnail_url, youtube_url, created_at, category_id", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);
      if (categoryId) query = query.eq("category_id", categoryId);
      else query = query.contains("tags", [slug || ""]);
      const { data, count } = await query;
      setArticles((data as Article[]) ?? []);
      setTotalCount(count ?? 0);
      setLoading(false);
    };
    fetchPage();
  }, [page, slug]);

  // Redirect "write" slug to WriteForUs page
  if (slug === "write") {
    return <Navigate to="/write-for-us" replace />;
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const featured = articles[0];
  const listArticles = articles.slice(1);

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return language === "kn" ? `${mins} ನಿಮಿಷಗಳ ಹಿಂದೆ` : `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return language === "kn" ? `${hours} ಗಂಟೆ ಹಿಂದೆ` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return language === "kn" ? `${days} ದಿನಗಳ ಹಿಂದೆ` : `${days}d ago`;
  };

  const renderInlineAd = () => {
    if (inlineAds.length === 0) return null;
    const ad = inlineAds[Math.floor(Math.random() * inlineAds.length)];
    return (
      <div className="my-4 rounded-lg overflow-hidden border border-border">
        <div className="bg-muted text-muted-foreground text-center text-[10px] font-bold py-1 uppercase tracking-widest">
          {language === "kn" ? "ಜಾಹೀರಾತು" : "Advertisement"}
        </div>
        <a href={ad.redirect_link || "#"} target="_blank" rel="noopener noreferrer">
          <img src={ad.image_url} alt="Ad" className="w-full object-cover" loading="lazy" />
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-extrabold whitespace-nowrap">{pageTitle}</h1>
          <div className="flex-1 h-0.5 bg-primary" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: News Content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground">
                {language === "kn" ? "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Loading..."}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                {language === "kn" ? "ಸುದ್ದಿಗಳು ಲಭ್ಯವಿಲ್ಲ" : "No articles found"}
              </div>
            ) : (
              <div>
                {featured && (
                  <ArticleLink articleId={featured.id} youtubeUrl={featured.youtube_url} title={t(featured.title, featured.title_en)}>
                  <article className="rounded-lg overflow-hidden bg-card shadow-md mb-6 cursor-pointer group">
                    <img
                      src={featured.thumbnail_url || (featured.youtube_url ? getYoutubeThumbnail(featured.youtube_url) : null) || "/placeholder.svg"}
                      alt=""
                      className="w-full h-[220px] md:h-[360px] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h2 className="text-xl md:text-2xl font-extrabold leading-tight text-card-foreground group-hover:text-primary transition-colors">
                        {t(featured.title, featured.title_en)}
                      </h2>
                      {(featured.description || featured.description_en) && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: t(featured.description, featured.description_en) }}
                        />
                      )}
                      <div className="flex items-center gap-1.5 mt-2 text-muted-foreground text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTime(featured.created_at)}</span>
                      </div>
                    </div>
                  </article>
                  </ArticleLink>
                )}

                <div className="space-y-0 divide-y divide-border bg-card rounded-lg shadow-sm">
                  {listArticles.map((article, idx) => (
                    <div key={article.id}>
                      <ArticleLink articleId={article.id} youtubeUrl={article.youtube_url} title={t(article.title, article.title_en)}>
                      <article className="flex gap-4 p-4 cursor-pointer group hover:bg-muted/50 transition-colors">
                        <img
                          src={article.thumbnail_url || (article.youtube_url ? getYoutubeThumbnail(article.youtube_url) : null) || "/placeholder.svg"}
                          alt=""
                          className="w-28 h-20 md:w-36 md:h-24 rounded object-cover flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base leading-snug line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
                            {t(article.title, article.title_en)}
                          </h3>
                          {(article.description || article.description_en) && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: t(article.description, article.description_en) }}
                            />
                          )}
                          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatTime(article.created_at)}</span>
                          </div>
                        </div>
                      </article>
                      </ArticleLink>
                      {(idx + 1) % 4 === 0 && renderInlineAd()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage(page - 1); }} />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                      .map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink href="#" isActive={p === page} onClick={(e) => { e.preventDefault(); setPage(p); }}>
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    {page < totalPages && (
                      <PaginationItem>
                        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage(page + 1); }} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Right: Ad Sidebar */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <SponsoredCard position="sidebar" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
