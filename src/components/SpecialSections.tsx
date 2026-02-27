import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { getArticlePath } from "@/lib/articleUrl";

interface CardItem {
  id: string;
  type: "ad" | "article";
  image_url: string;
  link: string | null;
  title?: string;
}

const SpecialSections = () => {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<CardItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await (supabase
          .from("articles")
          .select("id, title, title_en, thumbnail_url") as any)
          .eq("home_position", "main")
          .order("created_at", { ascending: false })
          .limit(7);

        const articleItems: CardItem[] = (data ?? [])
          .filter((a: any) => a.thumbnail_url)
          .map((a: any) => ({
            id: a.id, type: "article" as const, image_url: a.thumbnail_url!,
            link: getArticlePath(a.id, a.title_en || a.title),
            title: language === "kn" ? a.title : (a.title_en || a.title),
          }));

        setItems(articleItems.slice(0, 7));
      } catch (err) {
        console.error("Failed to fetch special sections:", err);
      }
    };
    fetchItems();
  }, [language]);

  const firstRow = items.slice(0, 3);
  const secondRow = items.slice(3, 7);

  const renderCard = (item: CardItem | undefined, height: string) => {
    if (!item) {
      return <div className={`rounded-lg overflow-hidden bg-muted ${height}`} />;
    }
    const inner = (
      <div className={`relative rounded-lg overflow-hidden cursor-pointer group ${height}`}>
        <img src={item.image_url} alt={item.title || "Ad"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        {item.title && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" >
            <span className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold line-clamp-2">{item.title}</span>
          </div>
        )}
      </div>
    );
    if (item.type === "article") {
      return <Link to={item.link || "#"} className="block">{inner}</Link>;
    }
    return <a href={item.link || "#"} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>;
  };

  const firstSlots: (CardItem | undefined)[] = [0, 1, 2].map(i => firstRow[i]);
  const secondSlots: (CardItem | undefined)[] = [0, 1, 2, 3].map(i => secondRow[i]);

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
        {firstSlots.map((item, i) => (
          <div key={item?.id ?? `empty-1-${i}`}>
            {renderCard(item, "h-[180px]")}
          </div>
        ))}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondSlots.map((item, i) => (
          <div key={item?.id ?? `empty-2-${i}`}>
            {renderCard(item, "h-[100px]")}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialSections;
