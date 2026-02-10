import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Video, FolderOpen, Image, Quote } from "lucide-react";

const Dashboard = () => {
  const [counts, setCounts] = useState({ articles: 0, videos: 0, categories: 0, ads: 0, quotes: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [articles, videos, categories, ads, quotes] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("youtube_videos").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("advertisements").select("id", { count: "exact", head: true }),
        supabase.from("quotes").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        articles: articles.count ?? 0,
        videos: videos.count ?? 0,
        categories: categories.count ?? 0,
        ads: ads.count ?? 0,
        quotes: quotes.count ?? 0,
      });
    };
    fetchCounts();
  }, []);

  const cards = [
    { label: "Total News", count: counts.articles, icon: Newspaper, color: "text-primary" },
    { label: "Total Videos", count: counts.videos, icon: Video, color: "text-destructive" },
    { label: "Categories", count: counts.categories, icon: FolderOpen, color: "text-secondary" },
    { label: "Advertisements", count: counts.ads, icon: Image, color: "text-muted-foreground" },
    { label: "Quotes (ಸುಭಾಷಿತ)", count: counts.quotes, icon: Quote, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(c => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{c.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
