import { useEffect, useState } from "react";
import { Eye, Play, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import VideoModal from "@/components/VideoModal";
import AdSlider from "@/components/AdSlider";
import ArticleLink from "@/components/ArticleLink";

import { getYoutubeThumbnail } from "@/lib/youtube";

interface Article {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  thumbnail_url: string | null;
  youtube_url: string | null;
  created_at: string;
}

interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  youtube_url: string;
  video_type: string;
}

const PopularNewsSection = () => {
  const { language, t } = useLanguage();
  const [popularBig, setPopularBig] = useState<Article[]>([]);
  const [popularSmall, setPopularSmall] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    // Fetch popular articles - 2 big + 4 small
    supabase
      .from("articles")
      .select("id, title, title_en, description, description_en, thumbnail_url, youtube_url, created_at, categories(name)")
      .eq("is_popular", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        const articles = (data as Article[]) ?? [];
        setPopularBig(articles.slice(0, 2));
        setPopularSmall(articles.slice(2, 6));
      });

    // Fetch videos
    supabase
      .from("youtube_videos")
      .select("id, title, description, thumbnail_url, youtube_url, video_type")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setVideos(data ?? []));
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
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-extrabold text-foreground whitespace-nowrap">
          {language === "kn" ? "ಜನಪ್ರಿಯ ಸುದ್ದಿ" : "Popular News"}
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Top Row - 2 Big Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularBig.length > 0 ? popularBig.map((news) => (
              <ArticleLink articleId={news.id} youtubeUrl={news.youtube_url} title={t(news.title, news.title_en)} key={news.id}>
                <div className="relative rounded-lg overflow-hidden cursor-pointer group h-[250px] sm:h-[280px]">
                  <img
                    src={news.thumbnail_url || (news.youtube_url ? getYoutubeThumbnail(news.youtube_url) : null) || "/placeholder.svg"}
                    alt={t(news.title, news.title_en)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/30 to-transparent" />
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                      {language === "kn" ? "ಜನಪ್ರಿಯ" : "Popular"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-accent-foreground text-base sm:text-lg font-bold leading-tight mb-2">
                      {t(news.title, news.title_en)}
                    </h3>
                    <div className="flex items-center gap-1 text-accent-foreground/70 text-xs">
                      <Eye className="w-3 h-3" />
                      <span>{formatTime(news.created_at)}</span>
                    </div>
                  </div>
                </div>
              </ArticleLink>
            )) : Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden bg-accent h-[280px] flex items-center justify-center">
                <span className="text-muted-foreground">{language === "kn" ? "ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ" : "No news"}</span>
              </div>
            ))}
          </div>

          {/* Bottom Row - Small News */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularSmall.length > 0 ? popularSmall.map((news) => (
              <ArticleLink articleId={news.id} youtubeUrl={news.youtube_url} title={t(news.title, news.title_en)} key={news.id}>
                <div className="flex gap-3 bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div className="w-28 h-24 sm:w-32 sm:h-28 shrink-0">
                    <img
                      src={news.thumbnail_url || (news.youtube_url ? getYoutubeThumbnail(news.youtube_url) : null) || "/placeholder.svg"}
                      alt={t(news.title, news.title_en)}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center py-2 pr-3 min-w-0">
                    <h4 className="text-sm font-bold text-card-foreground leading-snug line-clamp-2">
                      {t(news.title, news.title_en)}
                    </h4>
                    <div className="flex items-center gap-1 text-primary text-xs mt-1.5">
                      <Eye className="w-3 h-3" />
                      <span className="font-semibold">{formatTime(news.created_at)}</span>
                    </div>
                  </div>
                </div>
              </ArticleLink>
            )) : null}
          </div>
        </div>

        {/* Right Column - Ads */}
        <div className="space-y-4">
          <AdSlider showHeading={true} position="sidebar" />
        </div>
      </div>

      {/* Full-Width Bottom Ad */}
      <div className="mt-6">
        <AdSlider showHeading={false} position="bottom" />
      </div>

      {/* Video Section */}
      {videos.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-extrabold text-foreground whitespace-nowrap">
              🎥 {language === "kn" ? "ವೀಡಿಯೊ ಸುದ್ದಿ" : "Video News"}
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="relative rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="aspect-video bg-accent relative">
                  {video.thumbnail_url && (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-accent/30 group-hover:bg-accent/50 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-t-0 border-border rounded-b-lg p-3">
                  <Badge className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded mb-2">
                    {video.video_type === "live" ? (language === "kn" ? "ಲೈವ್" : "Live") :
                     video.video_type === "podcast" ? (language === "kn" ? "ಪಾಡ್‌ಕಾಸ್ಟ್" : "Podcast") :
                     language === "kn" ? "ವೀಡಿಯೊ" : "Video"}
                  </Badge>
                  <h4 className="text-sm font-bold text-card-foreground leading-snug line-clamp-2">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
};

export default PopularNewsSection;
