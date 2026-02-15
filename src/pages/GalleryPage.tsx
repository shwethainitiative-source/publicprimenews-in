import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
  id: string;
  image_url: string;
  caption: string | null;
  caption_en: string | null;
  created_at: string;
}

const GalleryPage = () => {
  const { language, t } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("gallery_photos").select("*").order("sort_order").order("created_at", { ascending: false })
      .then(({ data }) => { setPhotos((data as Photo[]) ?? []); setLoading(false); });
  }, []);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => i !== null ? (i - 1 + photos.length) % photos.length : null);
  const next = () => setLightboxIndex(i => i !== null ? (i + 1) % photos.length : null);

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-extrabold whitespace-nowrap">
            {language === "kn" ? "ಫೋಟೊ ಗ್ಯಾಲರಿ" : "Photo Gallery"}
          </h1>
          <div className="flex-1 h-0.5 bg-primary" />
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            {language === "kn" ? "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Loading..."}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {language === "kn" ? "ಫೋಟೊಗಳು ಲಭ್ಯವಿಲ್ಲ" : "No photos found"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="bg-card rounded-lg overflow-hidden border border-border shadow-sm cursor-pointer group hover:shadow-md transition-shadow"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={photo.image_url}
                  alt={t(photo.caption, photo.caption_en) || ""}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="p-3">
                  {(photo.caption || photo.caption_en) && (
                    <p className="text-sm font-medium text-card-foreground line-clamp-2">
                      {t(photo.caption, photo.caption_en)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(photo.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
            <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={closeLightbox}>
              <X className="w-8 h-8" />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={e => { e.stopPropagation(); prev(); }}>
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={e => { e.stopPropagation(); next(); }}>
              <ChevronRight className="w-10 h-10" />
            </button>
            <div className="max-w-4xl max-h-[80vh] px-4" onClick={e => e.stopPropagation()}>
              <img
                src={photos[lightboxIndex].image_url}
                alt=""
                className="max-w-full max-h-[75vh] object-contain mx-auto rounded"
              />
              {(photos[lightboxIndex].caption || photos[lightboxIndex].caption_en) && (
                <p className="text-white text-center mt-3 text-sm">
                  {t(photos[lightboxIndex].caption, photos[lightboxIndex].caption_en)}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
