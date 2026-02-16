import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryCard {
  slug: string;
  name: string;
  thumbnail_url: string | null;
}

const slugMap: Record<string, { en: string; kn: string }> = {
  "voice-of-public": { en: "VOICE OF PUBLIC", kn: "ಜನರ ಧ್ವನಿ" },
  "third-eye": { en: "360° EYE ON CORRUPTION", kn: "ಭ್ರಷ್ಟಾಚಾರದ ಮೇಲೆ ಕಣ್ಣು" },
  "achievers": { en: "SPECIAL FEATURE", kn: "ವಿಶೇಷ ವರದಿ" },
};

const secondRowSlugs = [
  { slug: "voice-of-public", en: "VOICE OF PUBLIC", kn: "ಜನರ ಧ್ವನಿ", color: "bg-red-700" },
  { slug: "third-eye", en: "360° EYE", kn: "360° ಕಣ್ಣು", color: "bg-red-800" },
  { slug: "local-achievers", en: "PHOTO GALLERY", kn: "ಫೋಟೊ ಗ್ಯಾಲರಿ", color: "bg-blue-900" },
  { slug: "interviews", en: "VIDEO GALLERY", kn: "ವೀಡಿಯೊ ಗ್ಯಾಲರಿ", color: "bg-blue-800" },
];

const SpecialSections = () => {
  const { language } = useLanguage();
  const [firstRowCards, setFirstRowCards] = useState<CategoryCard[]>([]);
  const [secondRowCards, setSecondRowCards] = useState<CategoryCard[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      // First row
      const firstSlugs = Object.keys(slugMap);
      const firstResults: CategoryCard[] = [];
      for (const slug of firstSlugs) {
        const { data: cats } = await supabase.from("categories").select("id, name, slug").eq("slug", slug).limit(1);
        if (cats?.[0]) {
          const { data: articles } = await supabase
            .from("articles")
            .select("thumbnail_url")
            .eq("category_id", cats[0].id)
            .order("created_at", { ascending: false })
            .limit(1);
          firstResults.push({ slug, name: cats[0].name, thumbnail_url: articles?.[0]?.thumbnail_url ?? null });
        } else {
          firstResults.push({ slug, name: slugMap[slug].kn, thumbnail_url: null });
        }
      }
      setFirstRowCards(firstResults);

      // Second row
      const secResults: CategoryCard[] = [];
      for (const item of secondRowSlugs) {
        const { data: cats } = await supabase.from("categories").select("id, name, slug").eq("slug", item.slug).limit(1);
        if (cats?.[0]) {
          const { data: articles } = await supabase
            .from("articles")
            .select("thumbnail_url")
            .eq("category_id", cats[0].id)
            .order("created_at", { ascending: false })
            .limit(1);
          secResults.push({ slug: item.slug, name: cats[0].name, thumbnail_url: articles?.[0]?.thumbnail_url ?? null });
        } else {
          secResults.push({ slug: item.slug, name: item.kn, thumbnail_url: null });
        }
      }
      setSecondRowCards(secResults);
    };
    fetchCards();
  }, []);

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
        {firstRowCards.map((item) => (
          <Link to={`/category/${item.slug}`} key={item.slug}>
            <div className="relative rounded-lg overflow-hidden cursor-pointer group h-[180px]">
              <img
                src={item.thumbnail_url || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-accent-foreground text-lg font-extrabold leading-tight">
                  {slugMap[item.slug]?.en ?? item.name}
                </h3>
                <p className="text-accent-foreground/70 text-xs mt-1">
                  {slugMap[item.slug]?.kn ?? item.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {firstRowCards.length === 0 && Object.entries(slugMap).map(([slug, info]) => (
          <div key={slug} className="relative rounded-lg overflow-hidden bg-muted h-[180px] flex items-center justify-center">
            <span className="text-muted-foreground">{info.en}</span>
          </div>
        ))}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondRowCards.map((item, i) => (
          <Link to={`/category/${item.slug}`} key={item.slug}>
            <div className="relative rounded-lg overflow-hidden cursor-pointer group h-[100px]">
              <img
                src={item.thumbnail_url || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className={`absolute inset-0 ${secondRowSlugs[i]?.color ?? "bg-primary"}/70`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm font-extrabold tracking-wide text-center px-2">
                  {secondRowSlugs[i]?.en ?? item.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {secondRowCards.length === 0 && secondRowSlugs.map((item) => (
          <div key={item.slug} className="relative rounded-lg overflow-hidden bg-muted h-[100px] flex items-center justify-center">
            <span className="text-muted-foreground text-sm">{item.en}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialSections;
