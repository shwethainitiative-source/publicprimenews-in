import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Ad {
  id: string;
  image_url: string;
  redirect_link: string | null;
}

const SponsoredBanner = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase
      .from("advertisements")
      .select("id, image_url, redirect_link")
      .eq("is_enabled", true)
      .eq("position", "top")
      .then(({ data }) => setAds(data ?? []));
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % ads.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [ads.length]);

  if (ads.length === 0) return null;

  const ad = ads[current];

  return (
    <div
      className="relative"
      onMouseEnter={() => clearInterval(undefined)}
    >
      <div className="absolute top-2 left-2 bg-sponsored text-sponsored-foreground text-xs font-bold px-3 py-1 rounded z-10">
        Sponsored
      </div>
      <a href={ad.redirect_link || "#"} target="_blank" rel="noopener noreferrer">
        <img
          src={ad.image_url}
          alt="Sponsored advertisement"
          className="w-full h-auto max-h-56 object-cover"
          loading="lazy"
        />
      </a>
    </div>
  );
};

export default SponsoredBanner;
