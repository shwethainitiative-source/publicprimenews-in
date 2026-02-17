import { useEffect, useState } from "react";
import { Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import ArticleLink from "@/components/ArticleLink";
import { Link } from "react-router-dom";
import { getYoutubeThumbnail } from "@/lib/youtube";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Article {
  id: string;
  title: string;
  title_en: string | null;
  thumbnail_url: string | null;
  youtube_url?: string | null;
  created_at: string;
}

interface GalleryPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  caption_en: string | null;
}

interface Video {
  id: string;
  title: string;
  thumbnail_url: string | null;
  youtube_url: string;
  video_type: string;
}

const FeaturedNewsSection = () => {
  const { language, t } = useLanguage();
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [lightboxImage, setLightboxImage] = useState<{ title: string; image: string } | null>(null);

  useEffect(() => {
    // Fetch featured articles (is_featured)
    (supabase
      .from("articles")
      .select("id, title, title_en, thumbnail_url, youtube_url, created_at, categories(name)") as any)
      .eq("home_position", "featured")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }: any) => setFeaturedNews((data as any[]) ?? []));

    // Fetch gallery photos
    supabase
      .from("gallery_photos")
      .select("id, image_url, caption, caption_en")
      .order("sort_order")
      .limit(4)
      .then(({ data }) => setGallery(data ?? []));

    // Fetch latest articles for right column
    supabase
      .from("articles")
      .select("id, title, title_en, thumbnail_url, youtube_url, created_at, categories(name)")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setLatestNews((data as any[]) ?? []));
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
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-extrabold whitespace-nowrap">
          {language === "kn" ? "ವಿಶೇಷ ಸುದ್ದಿ" : "Featured News"}
        </h2>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-8">
          {/* Featured Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredNews.length > 0 ? featuredNews.map((news) => (
              <ArticleLink articleId={news.id} youtubeUrl={news.youtube_url} title={t(news.title, news.title_en)} key={news.id}>
                <article className="group cursor-pointer rounded-lg overflow-hidden border border-border bg-card hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={news.thumbnail_url || (news.youtube_url ? getYoutubeThumbnail(news.youtube_url) : null) || "/placeholder.svg"}
                      alt={t(news.title, news.title_en)}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-[10px] font-bold rounded">
                      {language === "kn" ? "ವಿಶೇಷ" : "Featured"}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold leading-snug line-clamp-3 text-card-foreground">
                      {t(news.title, news.title_en)}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-muted-foreground text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(news.created_at)}</span>
                    </div>
                  </div>
                </article>
              </ArticleLink>
            )) : Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border bg-card h-64 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">{language === "kn" ? "ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ" : "No news"}</span>
              </div>
            ))}
          </div>

          {/* Photo Gallery */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-extrabold whitespace-nowrap">
                {language === "kn" ? "ಫೋಟೊ ಗ್ಯಾಲರಿ" : "Photo Gallery"}
              </h2>
              <Separator className="flex-1" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="cursor-pointer group"
                  onClick={() => setLightboxImage({ title: t(img.caption || "", img.caption_en) || "", image: img.image_url })}
                >
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={img.image_url}
                      alt={t(img.caption || "", img.caption_en) || "Gallery"}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">
                    {t(img.caption || "", img.caption_en) || ""}
                  </p>
                </div>
              ))}
              {gallery.length === 0 && (
                <p className="text-muted-foreground text-sm col-span-full text-center py-4">
                  {language === "kn" ? "ಫೋಟೊ ಲಭ್ಯವಿಲ್ಲ" : "No photos"}
                </p>
              )}
            </div>
            <div className="text-right mt-2">
              <Link to="/gallery" className="text-primary text-sm font-semibold hover:underline">
                {language === "kn" ? "ಇನ್ನಷ್ಟು ನೋಡಿ" : "More collection"}
              </Link>
            </div>
          </div>
        </div>

        {/* Right - Latest News */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-extrabold whitespace-nowrap">
              {language === "kn" ? "ಇತ್ತೀಚಿನ ಸುದ್ದಿ" : "Latest News"}
            </h2>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-3">
            {latestNews.map((news) => (
              <ArticleLink articleId={news.id} youtubeUrl={news.youtube_url} title={t(news.title, news.title_en)} key={news.id}>
                <article className="flex gap-3 cursor-pointer group rounded-md p-1.5 hover:bg-muted transition-colors">
                  <img
                    src={news.thumbnail_url || (news.youtube_url ? getYoutubeThumbnail(news.youtube_url) : null) || "/placeholder.svg"}
                    alt={t(news.title, news.title_en)}
                    className="w-20 h-16 rounded object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold leading-snug line-clamp-3 text-card-foreground group-hover:text-primary transition-colors">
                      {t(news.title, news.title_en)}
                    </h4>
                    <div className="flex items-center gap-1 mt-1 text-muted-foreground text-[10px]">
                      <Eye className="w-3 h-3" />
                      <span>{formatTime(news.created_at)}</span>
                    </div>
                  </div>
                </article>
              </ArticleLink>
            ))}
            {latestNews.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                {language === "kn" ? "ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ" : "No news"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={(open) => !open && setLightboxImage(null)}>
        <DialogContent className="sm:max-w-[700px] p-2">
          <DialogHeader className="p-2 pb-0">
            <DialogTitle className="text-sm">{lightboxImage?.title}</DialogTitle>
          </DialogHeader>
          <img
            src={lightboxImage?.image}
            alt={lightboxImage?.title}
            className="w-full rounded"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedNewsSection;
