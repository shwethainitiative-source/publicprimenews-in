import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Ad {
  id: string;
  image_url: string;
  redirect_link: string | null;
  title: string | null;
  description: string | null;
}

interface SponsoredCardProps {
  position?: string;
}

const SponsoredCard = ({ position = "sidebar" }: SponsoredCardProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    supabase
      .from("advertisements")
      .select("id, image_url, redirect_link, title, description")
      .eq("is_enabled", true)
      .eq("position", position)
      .then(({ data }) => setAds((data as Ad[]) ?? []));
  }, [position]);

  const next = useCallback(() => {
    if (ads.length <= 1) return;
    setCurrent((prev) => (prev + 1) % ads.length);
  }, [ads.length]);

  useEffect(() => {
    if (paused || ads.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, paused, ads.length]);

  if (ads.length === 0) return null;

  const ad = ads[current];

  return (
    <div
      className="w-full rounded-lg border border-border bg-card overflow-hidden shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image with Sponsored label */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full" style={{ minHeight: 200 }}>
          {ads.map((a, i) => (
            <img
              key={a.id}
              src={a.image_url}
              alt={a.title || "Sponsored"}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              style={{
                opacity: i === current ? 1 : 0,
                zIndex: i === current ? 1 : 0,
              }}
              loading="lazy"
            />
          ))}
        </div>
        {/* Green Sponsored label */}
        <span className="absolute top-3 left-3 z-10 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow">
          Sponsored
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {ad.title && (
          <h3 className="font-bold text-base text-card-foreground leading-snug line-clamp-2">
            {ad.title}
          </h3>
        )}
        {ad.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {ad.description}
          </p>
        )}
        <a
          href={ad.redirect_link || "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" className="w-full gap-2 mt-1">
            <ExternalLink className="w-3.5 h-3.5" />
            Learn More
          </Button>
        </a>
      </div>

      {/* Slider dots */}
      {ads.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-3">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-primary w-4"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SponsoredCard;
