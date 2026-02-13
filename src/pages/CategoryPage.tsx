import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { Clock } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

// Map route slugs to category names
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
  "jobs": { kn: "ಉದ್ಯೋಗ ಮಾಹಿತಿ", en: "Jobs" },
  "gallery": { kn: "ಫೋಟೊ ಗ್ಯಾಲರಿ", en: "Photo Gallery" },
  "feedback": { kn: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ", en: "Feedback" },
};

interface Article {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  thumbnail_url: string | null;
  created_at: string;
  category_id: string | null;
}

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const categoryInfo = slug ? slugToCategoryMap[slug] : undefined;
  const pageTitle = categoryInfo
    ? language === "en" ? categoryInfo.en : categoryInfo.kn
    : slug || "";

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);

      // First find the category by name (Kannada name)
      let categoryId: string | null = null;
      if (categoryInfo) {
        const { data: cats } = await supabase
          .from("categories")
          .select("id")
          .eq("name", categoryInfo.kn)
          .limit(1);
        categoryId = cats?.[0]?.id ?? null;
      }

      if (!categoryId) {
        // Try matching by slug tag
        const from = (page - 1) * PAGE_SIZE;
        const { data, count } = await supabase
          .from("articles")
          .select("id, title, title_en, description, description_en, thumbnail_url, created_at, category_id", { count: "exact" })
          .contains("tags", [slug || ""])
          .order("created_at", { ascending: false })
          .range(from, from + PAGE_SIZE - 1);
        setArticles((data as Article[]) ?? []);
        setTotalCount(count ?? 0);
        setLoading(false);
        return;
      }

      const from = (page - 1) * PAGE_SIZE;
      const { data, count } = await supabase
        .from("articles")
        .select("id, title, title_en, description, description_en, thumbnail_url, created_at, category_id", { count: "exact" })
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      setArticles((data as Article[]) ?? []);
      setTotalCount(count ?? 0);
      setLoading(false);
    };

    setPage(1);
    fetchArticles();
  }, [slug, categoryInfo]);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      let categoryId: string | null = null;
      if (categoryInfo) {
        const { data: cats } = await supabase
          .from("categories")
          .select("id")
          .eq("name", categoryInfo.kn)
          .limit(1);
        categoryId = cats?.[0]?.id ?? null;
      }

      const from = (page - 1) * PAGE_SIZE;
      let query = supabase
        .from("articles")
        .select("id, title, title_en, description, description_en, thumbnail_url, created_at, category_id", { count: "exact" })
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

    if (page > 1) fetchPage();
  }, [page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <NavigationBar />

      <main className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-extrabold whitespace-nowrap">{pageTitle}</h1>
          <div className="flex-1 h-0.5 bg-primary" />
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            {language === "kn" ? "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Loading..."}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {language === "kn" ? "ಸುದ್ದಿಗಳು ಲಭ್ಯವಿಲ್ಲ" : "No articles found"}
          </div>
        ) : (
          <div className="space-y-0 divide-y divide-border bg-card rounded-lg shadow-sm">
            {articles.map((article) => (
              <article key={article.id} className="flex gap-4 p-4 cursor-pointer group hover:bg-muted/50 transition-colors">
                <img
                  src={article.thumbnail_url || "/placeholder.svg"}
                  alt=""
                  className="w-28 h-20 md:w-36 md:h-24 rounded object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base leading-snug line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
                    {t(article.title, article.title_en)}
                  </h3>
                  {(article.description || article.description_en) && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {t(article.description, article.description_en)}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2 text-muted-foreground text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(article.created_at)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
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
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={(e) => { e.preventDefault(); setPage(p); }}
                      >
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
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
