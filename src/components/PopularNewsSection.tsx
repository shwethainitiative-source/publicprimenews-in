import { Eye, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import VideoModal from "@/components/VideoModal";
import { useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  timeAgo: string;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  category: string;
}

// Mock data
const featuredNews: NewsItem[] = [
  {
    id: "1",
    title: "ನಕಾರಾತ್ಮಕ ಆಲೋಚನೆಗಳು ಮನುಷ್ಯನನ್ನು ಬಲಹೀನಗೊಳಿಸುತ್ತದೆ",
    category: "Popular",
    imageUrl: "",
    publishedAt: "2026-02-06T10:00:00Z",
    timeAgo: "2h ago",
  },
  {
    id: "2",
    title: "ನಕಾರಾತ್ಮಕ ಆಲೋಚನೆಗಳು ಮನುಷ್ಯನನ್ನು ಬಲಹೀನಗೊಳಿಸುತ್ತದೆ",
    category: "Popular",
    imageUrl: "",
    publishedAt: "2026-02-06T08:00:00Z",
    timeAgo: "2h ago",
  },
];

const smallNews: NewsItem[] = [
  {
    id: "3",
    title: "ನಾಳಿಯೇ ಸಾಯಬಹುದೆಂಬಂತೆ ಜೀವಿಸು",
    description: "ಯಾವಾಗಲೂ ಜೀವಿತ್ತನೆ ನಂಬಿಕೆ ಕಳೆದೆಯನ್ನು ಮಾಡು – ಮಹಾತ್ಮಗಾಂಧಿ.",
    category: "Popular",
    imageUrl: "",
    publishedAt: "2026-02-06T06:00:00Z",
    timeAgo: "4h ago",
  },
  {
    id: "4",
    title: "ಕರ್ನಾಟಕ ರಾಜ್ಯದ ಹೊಸ ಯೋಜನೆ ಪ್ರಾರಂಭ",
    description: "ರಾಜ್ಯ ಸರ್ಕಾರವು ಹೊಸ ಅಭಿವೃದ್ಧಿ ಯೋಜನೆಯನ್ನು ಘೋಷಿಸಿದೆ.",
    category: "Popular",
    imageUrl: "",
    publishedAt: "2026-02-06T04:00:00Z",
    timeAgo: "6h ago",
  },
  {
    id: "5",
    title: "ಉಡುಪಿ ಜಿಲ್ಲೆಯಲ್ಲಿ ಶಿಕ್ಷಣ ಸುಧಾರಣೆ",
    description: "ಹೊಸ ಶಿಕ್ಷಣ ನೀತಿಯ ಅನುಷ್ಠಾನ ಪ್ರಾರಂಭ.",
    category: "Popular",
    imageUrl: "",
    publishedAt: "2026-02-06T02:00:00Z",
    timeAgo: "8h ago",
  },
  {
    id: "6",
    title: "ಕನ್ನಡ ಚಲನಚಿತ್ರ ಉದ್ಯಮದ ಬೆಳವಣಿಗೆ",
    description: "ಹೊಸ ಚಿತ್ರಗಳ ಬಿಡುಗಡೆ ಮತ್ತು ಬಾಕ್ಸ್ ಆಫೀಸ್ ವರದಿ.",
    category: "Popular",
    imageUrl: "",
    publishedAt: "2026-02-06T01:00:00Z",
    timeAgo: "9h ago",
  },
];

const videos: VideoItem[] = [
  {
    id: "v1",
    title: "ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್ ವಿಶೇಷ ಸಂದರ್ಶನ",
    description: "ಈ ವಾರದ ವಿಶೇಷ ಸಂದರ್ಶನ ವೀಡಿಯೊ",
    thumbnailUrl: "",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Interviews",
  },
  {
    id: "v2",
    title: "ಉಡುಪಿ ಜಿಲ್ಲೆಯ ಅಭಿವೃದ್ಧಿ ಕಾಮಗಾರಿ",
    description: "ಅಭಿವೃದ್ಧಿ ಯೋಜನೆಯ ವೀಡಿಯೊ ವರದಿ",
    thumbnailUrl: "",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Special",
  },
  {
    id: "v3",
    title: "ಕನ್ನಡ ಸಾಹಿತ್ಯ ಸಮ್ಮೇಳನ ಹೈಲೈಟ್ಸ್",
    description: "ಸಮ್ಮೇಳನದ ಪ್ರಮುಖ ಕ್ಷಣಗಳು",
    thumbnailUrl: "",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Popular",
  },
];

const PopularNewsSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  return (
    <section className="container mx-auto px-4 py-6">
      {/* Section Title */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-extrabold text-foreground whitespace-nowrap">
          Popular News
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left & Center - News Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top Row - 2 Featured Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredNews.map((news) => (
              <div
                key={news.id}
                className="relative rounded-lg overflow-hidden cursor-pointer group h-[250px] sm:h-[280px]"
              >
                {/* Placeholder bg */}
                <div className="absolute inset-0 bg-accent" />
                {news.imageUrl && (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/30 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                    {news.category}
                  </Badge>
                </div>

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-accent-foreground text-base sm:text-lg font-bold leading-tight mb-2">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-1 text-accent-foreground/70 text-xs">
                    <Eye className="w-3 h-3" />
                    <span>{news.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - Small News List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {smallNews.map((news) => (
              <div
                key={news.id}
                className="flex gap-3 bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="w-28 h-24 sm:w-32 sm:h-28 bg-accent shrink-0">
                  {news.imageUrl && (
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                {/* Content */}
                <div className="flex flex-col justify-center py-2 pr-3 min-w-0">
                  <h4 className="text-sm font-bold text-card-foreground leading-snug line-clamp-2">
                    {news.title}
                  </h4>
                  {news.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {news.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-primary text-xs mt-1.5">
                    <Eye className="w-3 h-3" />
                    <span className="font-semibold">{news.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Ads */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-muted rounded-lg flex items-center justify-center h-[280px] border border-border"
            >
              <span className="text-muted-foreground text-2xl font-bold tracking-wider">
                ADS
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Width Ad Banner */}
      <div className="mt-6 bg-muted border border-border rounded-lg flex items-center justify-center h-24">
        <span className="text-muted-foreground text-xl font-bold tracking-[0.3em]">
          ADVERTISEMENT
        </span>
      </div>

      {/* Video Section */}
      <div className="mt-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-extrabold text-foreground whitespace-nowrap">
            🎥 Video News
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
                {video.thumbnailUrl && (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-accent/30 group-hover:bg-accent/50 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="bg-card border border-t-0 border-border rounded-b-lg p-3">
                <Badge className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded mb-2">
                  {video.category}
                </Badge>
                <h4 className="text-sm font-bold text-card-foreground leading-snug line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
};

export default PopularNewsSection;
