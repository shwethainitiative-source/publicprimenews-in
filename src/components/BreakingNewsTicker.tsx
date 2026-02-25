import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const BreakingNewsTicker = () => {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("articles")
      .select("title, title_en")
      .eq("is_breaking", true)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setItems(data.map((a) => (language === "en" ? a.title_en || a.title : a.title)));
        } else {
          setItems([
            language === "kn" ? "ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್ ಲಭ್ಯವಿಲ್ಲ" : "No breaking news",
          ]);
        }
      });
  }, [language]);

  const repeatedItems = [...items, ...items, ...items];

  return (
    <div className="bg-ticker text-ticker-foreground flex items-center overflow-hidden">
      <div className="bg-primary px-4 py-2 font-bold text-sm whitespace-nowrap shrink-0 z-10">
        Breaking News
      </div>
      <div className="overflow-hidden flex-1">
        <div className="animate-ticker flex whitespace-nowrap">
          {repeatedItems.map((item, i) => (
            <span key={i} className="px-8 py-2 text-sm inline-block">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;
