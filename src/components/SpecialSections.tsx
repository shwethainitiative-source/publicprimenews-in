import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Ad {
  id: string;
  image_url: string;
  redirect_link: string | null;
}

const SpecialSections = () => {
  const { language } = useLanguage();
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    supabase
      .from("advertisements")
      .select("id, image_url, redirect_link")
      .eq("is_enabled", true)
      .eq("position", "top")
      .then(({ data }) => setAds(data ?? []));
  }, []);

  // Split ads into first row (3) and second row (4)
  const firstRow = ads.slice(0, 3);
  const secondRow = ads.slice(3, 7);

  const renderCard = (ad: Ad | undefined, height: string) => {
    if (!ad) {
      return (
        <div className={`rounded-lg overflow-hidden bg-muted ${height}`} />
      );
    }
    return (
      <a
        href={ad.redirect_link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className={`relative rounded-lg overflow-hidden cursor-pointer group ${height}`}>
          <img
            src={ad.image_url}
            alt="Ad"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </a>
    );
  };

  // Build arrays padded to fixed lengths
  const firstSlots: (Ad | undefined)[] = [0, 1, 2].map(i => firstRow[i]);
  const secondSlots: (Ad | undefined)[] = [0, 1, 2, 3].map(i => secondRow[i]);

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-lg font-extrabold whitespace-nowrap uppercase tracking-wide">
          {language === "kn" ? "ನಮ್ಮ ಜಿಲ್ಲೆಗಳು" : "Our Districts"}
        </h2>
        <div className="flex-1 h-0.5 bg-primary" />
      </div>

      {/* First Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {firstSlots.map((ad, i) => (
          <div key={ad?.id ?? `empty-1-${i}`}>
            {renderCard(ad, "h-[180px]")}
          </div>
        ))}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondSlots.map((ad, i) => (
          <div key={ad?.id ?? `empty-2-${i}`}>
            {renderCard(ad, "h-[100px]")}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialSections;
