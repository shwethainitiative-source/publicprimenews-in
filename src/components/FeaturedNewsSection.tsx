import { useState } from "react";
import { Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const featuredNews = [
  {
    id: 1,
    title: "ಸಮುದ್ರದ ದೃಶ್ಯ ಆನಂದಮಯ, ಆದರೆ ದಡದ ಮೇಲಿಂದ ನೋಡುವವರಿಗೇ ಹೊರತು ಮುಳುಗುವವರಿಗಲ್ಲ. - ವಿನೋಬಾ ಬಾವೆ",
    image: "/placeholder.svg",
    time: "4h ago",
  },
  {
    id: 2,
    title: "ಕರ್ನಾಟಕದಲ್ಲಿ ಹೊಸ ಶಿಕ್ಷಣ ನೀತಿ ಜಾರಿಗೆ ಸರ್ಕಾರ ಸಿದ್ಧತೆ ನಡೆಸುತ್ತಿದೆ",
    image: "/placeholder.svg",
    time: "4h ago",
  },
  {
    id: 3,
    title: "ಉಡುಪಿ ಜಿಲ್ಲೆಯಲ್ಲಿ ಭಾರೀ ಮಳೆ ಸಾಧ್ಯತೆ, ಜನರಿಗೆ ಎಚ್ಚರಿಕೆ ನೀಡಲಾಗಿದೆ",
    image: "/placeholder.svg",
    time: "4h ago",
  },
];

const galleryImages = [
  { id: 1, title: "xxxxxxxxxx xxxxxxxx", image: "/placeholder.svg" },
  { id: 2, title: "xxxxxxxxxx xxxxxxxx", image: "/placeholder.svg" },
  { id: 3, title: "xxxxxxxxxx xxxxxxxx", image: "/placeholder.svg" },
  { id: 4, title: "xxxxxxxxxx xxxxxxxx", image: "/placeholder.svg" },
];

const latestNews = [
  {
    id: 1,
    title: "ಸಮುದ್ರದ ದೃಶ್ಯ ಆನಂದಮಯ, ಆದರೆ ದಡದ ಮೇಲಿಂದ ನೋಡುವವರಿಗೇ ಹೊರತು ಮುಳುಗುವವರಿಗಲ್ಲ. - ವಿನೋಬಾ ಬಾವೆ",
    image: "/placeholder.svg",
    time: "4h ago",
  },
  {
    id: 2,
    title: "ಕರ್ನಾಟಕದಲ್ಲಿ ಹೊಸ ಶಿಕ್ಷಣ ನೀತಿ ಜಾರಿ",
    image: "/placeholder.svg",
    time: "5h ago",
  },
  {
    id: 3,
    title: "ಉಡುಪಿಯಲ್ಲಿ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮ ಆಯೋಜನೆ",
    image: "/placeholder.svg",
    time: "6h ago",
  },
  {
    id: 4,
    title: "ರಾಜ್ಯದಲ್ಲಿ ಹೊಸ ಯೋಜನೆ ಘೋಷಣೆ",
    image: "/placeholder.svg",
    time: "7h ago",
  },
  {
    id: 5,
    title: "ಮಂಗಳೂರು ವಿಮಾನ ನಿಲ್ದಾಣ ಅಭಿವೃದ್ಧಿ ಕಾಮಗಾರಿ",
    image: "/placeholder.svg",
    time: "8h ago",
  },
];

const FeaturedNewsSection = () => {
  const [lightboxImage, setLightboxImage] = useState<{ title: string; image: string } | null>(null);

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Featured News Title */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-extrabold whitespace-nowrap">Featured News</h2>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left - Featured Cards + Gallery (3 cols) */}
        <div className="lg:col-span-3 space-y-8">
          {/* 3 Featured Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredNews.map((news) => (
              <article
                key={news.id}
                className="group cursor-pointer rounded-lg overflow-hidden border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-[10px] font-bold rounded">
                    Featured
                  </Badge>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-snug line-clamp-3 text-card-foreground">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-muted-foreground text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{news.time}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Photo Gallery */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-extrabold whitespace-nowrap">ಫೋಟೊ ಗ್ಯಾಲರಿ</h2>
              <Separator className="flex-1" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="cursor-pointer group"
                  onClick={() => setLightboxImage(img)}
                >
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={img.image}
                      alt={img.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{img.title}</p>
                </div>
              ))}
            </div>
            <div className="text-right mt-2">
              <a href="#" className="text-primary text-sm font-semibold hover:underline">
                More collection
              </a>
            </div>
          </div>
        </div>

        {/* Right - Latest News */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-extrabold whitespace-nowrap">Latest News</h2>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-3">
            {latestNews.map((news) => (
              <article
                key={news.id}
                className="flex gap-3 cursor-pointer group rounded-md p-1.5 hover:bg-muted transition-colors"
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-20 h-16 rounded object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold leading-snug line-clamp-3 text-card-foreground group-hover:text-primary transition-colors">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-muted-foreground text-[10px]">
                    <Eye className="w-3 h-3" />
                    <span>{news.time}</span>
                  </div>
                </div>
              </article>
            ))}
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
