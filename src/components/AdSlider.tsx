import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Ad {
  id: string;
  image_url: string;
  redirect_link: string | null;
}

interface AdSliderProps {
  showHeading?: boolean;
  position?: string;
}

const AdSlider = ({ showHeading = true, position = "sidebar" }: AdSliderProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("advertisements")
      .select("id, image_url, redirect_link")
      .eq("is_enabled", true)
      .eq("position", position)
      .then(({ data }) => setAds(data ?? []));
  }, [position]);

  const next = useCallback(() => {
    if (ads.length <= 1) return;
    setCurrent((prev) => (prev + 1) % ads.length);
  }, [ads.length]);

  useEffect(() => {
    if (paused || ads.length <= 1) return;
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next, paused, ads.length]);

  if (ads.length === 0) return null;

  return (
    <div
      className="w-full rounded-lg border bg-card overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      ref={containerRef}
    >
      {showHeading && (
        <div className="bg-primary text-primary-foreground text-center text-sm font-bold py-2">
          ಜಾಹೀರಾತು (Advertisement)
        </div>
      )}
      <div className="relative w-full aspect-[16/5] overflow-hidden">
        {ads.map((ad, i) => (
          <a
            key={ad.id}
            href={ad.redirect_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
            style={{
              transform: `translateY(${(i - current) * 100}%)`,
              opacity: i === current ? 1 : 0,
            }}
          >
            <img
              src={ad.image_url}
              alt="Ad"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdSlider;
