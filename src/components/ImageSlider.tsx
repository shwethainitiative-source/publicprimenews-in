import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderImage {
  image_url: string;
  caption?: string | null;
  caption_en?: string | null;
}

interface ImageSliderProps {
  images: SliderImage[];
  language?: string;
  t?: (kn: string | null | undefined, en: string | null | undefined) => string;
  className?: string;
  imageClassName?: string;
  showCaptions?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const ImageSlider = ({
  images,
  language = "en",
  t,
  className = "",
  imageClassName = "w-full h-[300px] md:h-[450px] object-cover object-center",
  showCaptions = true,
  showDots = true,
  showArrows = true,
  autoSlide = false,
  autoSlideInterval = 4000,
}: ImageSliderProps) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!autoSlide || images.length <= 1) return;
    const timer = setInterval(next, autoSlideInterval);
    return () => clearInterval(timer);
  }, [autoSlide, autoSlideInterval, next, images.length]);

  if (!images.length) return null;
  if (images.length === 1) {
    const img = images[0];
    const caption = t ? t(img.caption, img.caption_en) : (language === "kn" ? img.caption : img.caption_en) || img.caption;
    return (
      <div className={className}>
        <img src={img.image_url} alt={caption || ""} className={imageClassName} />
        {showCaptions && caption && (
          <p className="text-sm text-muted-foreground mt-2 px-1">{caption}</p>
        )}
      </div>
    );
  }

  const img = images[current];
  const caption = t ? t(img.caption, img.caption_en) : (language === "kn" ? img.caption : img.caption_en) || img.caption;

  return (
    <div className={`relative group ${className}`}>
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={img.image_url}
          alt={caption || ""}
          className={`${imageClassName} transition-opacity duration-500`}
        />
        {showArrows && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
          {current + 1}/{images.length}
        </div>
      </div>
      {showDots && (
        <div className="flex justify-center gap-1.5 mt-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      )}
      {showCaptions && caption && (
        <p className="text-sm text-muted-foreground mt-1 px-1">{caption}</p>
      )}
    </div>
  );
};

export default ImageSlider;
