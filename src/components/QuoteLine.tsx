import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "lucide-react";

interface QuoteData {
  id: string;
  quote_text: string;
  author: string;
}

const QuoteLine = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);

  useEffect(() => {
    supabase
      .from("quotes")
      .select("id, quote_text, author")
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setQuote(data[0]);
      });
  }, []);

  if (!quote) return null;

  return (
    <div className="bg-quote text-quote-foreground">
      <div className="container mx-auto px-4 py-2 flex items-center gap-3">
        <Quote className="w-4 h-4 flex-shrink-0 text-primary" />
        <p className="text-sm font-medium italic truncate">
          "{quote.quote_text}" — <span className="font-semibold not-italic">{quote.author || "Unknown"}</span>
        </p>
      </div>
    </div>
  );
};

export default QuoteLine;
