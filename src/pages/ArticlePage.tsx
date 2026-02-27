import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import SponsoredCard from "@/components/SponsoredCard";
import ImageSlider from "@/components/ImageSlider";
import ShareButton from "@/components/ShareButton";
import { Clock } from "lucide-react";
import { extractArticleIdFromParam, getPublicArticleUrl } from "@/lib/articleUrl";

interface ArticleImage {
  id: string;
  image_url: string;
  caption: string | null;
  caption_en: string | null;
  sort_order: number;
  is_cover: boolean;
}

interface Article {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  thumbnail_url: string | null;
  created_at: string;
  author_name: string | null;
  author_photo_url: string | null;
  categories?: { name: string } | null;
}

const ArticlePage = () => {
  const { id: articleParam } = useParams<{ id: string }>();
  const articleId = articleParam ? extractArticleIdFromParam(articleParam) : "";
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleId) return;
    setLoading(true);
    Promise.all([
      supabase
        .from("articles")
        .select("id, title, title_en, description, description_en, thumbnail_url, created_at, author_name, author_photo_url, categories(name)")
        .eq("id", articleId)
        .single(),
      supabase
        .from("article_images")
        .select("*")
        .eq("article_id", articleId)
        .order("sort_order"),
    ]).then(([articleRes, imagesRes]) => {
      setArticle(articleRes.data as Article | null);
      setImages((imagesRes.data as ArticleImage[]) ?? []);
      setLoading(false);
    });
  }, [articleId]);

  // Dynamic OG meta tags
  useEffect(() => {
    if (!article) return;

    const title = language === "kn" ? article.title : (article.title_en || article.title);
    const description = (language === "kn" ? article.description : (article.description_en || article.description)) || "";
    const shortDesc = description
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 160);
    const ogImage = images[0]?.image_url || article.thumbnail_url || "";
    const articleUrl = getPublicArticleUrl(article.id, article.title_en || article.title);

    document.title = `${title} - Public Prime News`;

    const metaTags: Record<string, string> = {
      "og:title": title,
      "og:description": shortDesc,
      "og:image": ogImage,
      "og:image:secure_url": ogImage,
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:url": articleUrl,
      "og:type": "article",
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": shortDesc,
      "twitter:image": ogImage,
    };

    const setMeta = (property: string, content: string) => {
      const attr = property.startsWith("twitter:") ? "name" : "property";
      let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setCanonical = (href: string) => {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.href = href;
    };

    Object.entries(metaTags).forEach(([key, val]) => setMeta(key, val));
    setCanonical(articleUrl);

    // Also update description meta
    let descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (descMeta) descMeta.content = shortDesc;

    return () => {
      document.title = "Public Prime News";
      // Reset OG tags to defaults
      const defaults: Record<string, string> = {
        "og:title": "Public Prime News",
        "og:description": "Latest news, breaking stories and updates from Public Prime News",
        "og:type": "website",
      };
      Object.entries(defaults).forEach(([key, val]) => setMeta(key, val));
      ["og:image", "og:image:secure_url", "og:image:width", "og:image:height", "og:url", "twitter:title", "twitter:description", "twitter:image"].forEach((key) => {
        const attr = key.startsWith("twitter:") ? "name" : "property";
        document.querySelector(`meta[${attr}="${key}"]`)?.removeAttribute("content");
      });
      document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://publicprimenews.in/");
    };
  }, [article, images, language]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === "kn" ? "kn-IN" : "en-IN", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  // Use article_images if available, otherwise fall back to thumbnail_url
  const coverImage = images.length > 0 ? images[0] : null;
  const galleryImages = images.length > 1 ? images.slice(1) : [];
  const coverUrl = coverImage?.image_url || article?.thumbnail_url || "/placeholder.svg";

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
              {/* Cover Image */}
              <img
                src={coverUrl}
                alt={t(article.title, article.title_en)}
                className="w-full h-[300px] md:h-[450px] object-cover object-center"
              />
              {coverImage?.caption && (
                <p className="text-xs text-muted-foreground px-6 pt-2">
                  {t(coverImage.caption, coverImage.caption_en)}
                </p>
              )}

              <div className="p-6">
                {article.categories?.name && (
                  <span className="text-xs font-bold uppercase text-primary tracking-wider">
                    {article.categories.name}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-card-foreground mt-2">
                  {t(article.title, article.title_en)}
                </h1>

                {/* Author Section */}
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={article.author_photo_url || "/placeholder.svg"}
                    alt={article.author_name || "Author"}
                    className="w-10 h-10 rounded-full object-cover border border-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-card-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <span className="text-xs text-muted-foreground font-normal">By </span>
                      <span className="font-bold">{article.author_name || "Public Prime News"}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTime(article.created_at)}</span>
                    </div>
                  </div>
                  <ShareButton articleId={article.id} title={t(article.title, article.title_en)} variant="inline" iconSize={18} />
                </div>
                <div
                  className="mt-6 text-foreground leading-relaxed prose prose-sm max-w-none [&>*]:my-1"
                  dangerouslySetInnerHTML={{
                    __html: t(article.description, article.description_en) || (language === "kn" ? "ವಿವರ ಲಭ್ಯವಿಲ್ಲ" : "No details available"),
                  }}
                />

                {/* Gallery Images (images 2 & 3) */}
                {galleryImages.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-card-foreground mb-3">
                      {language === "kn" ? "ಫೋಟೊ ಗ್ಯಾಲರಿ" : "Photo Gallery"}
                    </h3>
                    <ImageSlider
                      images={galleryImages}
                      language={language}
                      t={t}
                      imageClassName="w-full h-[250px] md:h-[400px] object-cover object-center rounded-lg"
                      showCaptions
                      showDots
                      showArrows
                    />
                  </div>
                )}
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
