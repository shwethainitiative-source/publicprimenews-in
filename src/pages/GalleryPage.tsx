import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import ImageSlider from "@/components/ImageSlider";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PostImage {
  id: string;
  image_url: string;
  caption: string | null;
  caption_en: string | null;
  sort_order: number;
}

interface GalleryPost {
  id: string;
  title: string | null;
  title_en: string | null;
  created_at: string;
  gallery_post_images: PostImage[];
}

const GalleryPage = () => {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ postIdx: number; imgIdx: number } | null>(null);

  useEffect(() => {
    supabase
      .from("gallery_posts")
      .select("*, gallery_post_images(*)")
      .order("sort_order")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const sorted = (data ?? []).map((p: any) => ({
          ...p,
          gallery_post_images: (p.gallery_post_images ?? []).sort((a: PostImage, b: PostImage) => a.sort_order - b.sort_order),
        }));
        setPosts(sorted as GalleryPost[]);
        setLoading(false);
      });
  }, []);

  const openLightbox = (postIdx: number, imgIdx: number) => setLightbox({ postIdx, imgIdx });
  const closeLightbox = () => setLightbox(null);

  const currentPost = lightbox ? posts[lightbox.postIdx] : null;
  const currentImages = currentPost?.gallery_post_images ?? [];
  const currentImg = lightbox ? currentImages[lightbox.imgIdx] : null;

  const prevImg = () => {
    if (!lightbox) return;
    setLightbox(lb => lb ? { ...lb, imgIdx: (lb.imgIdx - 1 + currentImages.length) % currentImages.length } : null);
  };
  const nextImg = () => {
    if (!lightbox) return;
    setLightbox(lb => lb ? { ...lb, imgIdx: (lb.imgIdx + 1) % currentImages.length } : null);
  };

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
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {language === "kn" ? "ಫೋಟೊಗಳು ಲಭ್ಯವಿಲ್ಲ" : "No photos found"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, postIdx) => (
              <div key={post.id} className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
                {/* Cover image / slider */}
                {post.gallery_post_images.length === 1 ? (
                  <img
                    src={post.gallery_post_images[0].image_url}
                    alt={t(post.gallery_post_images[0].caption, post.gallery_post_images[0].caption_en) || ""}
                    className="w-full h-48 object-cover object-center cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => openLightbox(postIdx, 0)}
                  />
                ) : (
                  <div onClick={() => openLightbox(postIdx, 0)} className="cursor-pointer">
                    <ImageSlider
                      images={post.gallery_post_images}
                      language={language}
                      t={t}
                      imageClassName="w-full h-48 object-cover object-center"
                      showCaptions={false}
                      showDots
                      showArrows
                      autoSlide
                      autoSlideInterval={5000}
                    />
                  </div>
                )}
                <div className="p-3">
                  {(post.title || post.title_en) && (
                    <p className="text-sm font-medium text-card-foreground line-clamp-2">
                      {t(post.title, post.title_en)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.gallery_post_images.length} {language === "kn" ? "ಚಿತ್ರಗಳು" : "photos"} • {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightbox && currentImg && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
            <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={closeLightbox}>
              <X className="w-8 h-8" />
            </button>
            {currentImages.length > 1 && (
              <>
                <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={e => { e.stopPropagation(); prevImg(); }}>
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={e => { e.stopPropagation(); nextImg(); }}>
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}
            <div className="max-w-4xl max-h-[80vh] px-4" onClick={e => e.stopPropagation()}>
              <img
                src={currentImg.image_url}
                alt=""
                className="max-w-full max-h-[75vh] object-contain mx-auto rounded"
              />
              {(currentImg.caption || currentImg.caption_en) && (
                <p className="text-white text-center mt-3 text-sm">
                  {t(currentImg.caption, currentImg.caption_en)}
                </p>
              )}
              <div className="flex justify-center gap-1.5 mt-3">
                {currentImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightbox(lb => lb ? { ...lb, imgIdx: i } : null); }}
                    className={`w-2 h-2 rounded-full ${i === lightbox.imgIdx ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
