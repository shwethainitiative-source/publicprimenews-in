import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import SponsoredCard from "@/components/SponsoredCard";
import { Clock } from "lucide-react";

interface Article {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  thumbnail_url: string | null;
  created_at: string;
  categories?: { name: string } | null;
}

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from("articles")
      .select("id, title, title_en, description, description_en, thumbnail_url, created_at, categories(name)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setArticle(data as Article | null);
        setLoading(false);
      });
  }, [id]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === "kn" ? "kn-IN" : "en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            {language === "kn" ? "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Loading..."}
          </div>
        ) : !article ? (
          <div className="text-center py-16 text-muted-foreground">
            {language === "kn" ? "ಲೇಖನ ಕಂಡುಬಂದಿಲ್ಲ" : "Article not found"}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <article className="flex-1 min-w-0 bg-card rounded-lg shadow-md overflow-hidden">
              <img
                src={article.thumbnail_url || "/placeholder.svg"}
                alt={t(article.title, article.title_en)}
                className="w-full h-[300px] md:h-[450px] object-cover"
              />
              <div className="p-6">
                {article.categories?.name && (
                  <span className="text-xs font-bold uppercase text-primary tracking-wider">
                    {article.categories.name}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-card-foreground mt-2">
                  {t(article.title, article.title_en)}
                </h1>
                <div className="flex items-center gap-1.5 mt-3 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(article.created_at)}</span>
                </div>
                <div className="mt-6 text-foreground leading-relaxed whitespace-pre-wrap">
                  {t(article.description, article.description_en) || (language === "kn" ? "ವಿವರ ಲಭ್ಯವಿಲ್ಲ" : "No details available")}
                </div>
              </div>
            </article>
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
              <SponsoredCard position="sidebar" />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
