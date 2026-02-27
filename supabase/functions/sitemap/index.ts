import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://publicprimenews.in";

const slugify = (title: string) =>
  (title || "")
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "article";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  // Fetch all published articles
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title_en, title, updated_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1000);

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at")
    .not("slug", "is", null);

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "hourly" },
    { loc: "/about", priority: "0.5", changefreq: "monthly" },
    { loc: "/jobs", priority: "0.6", changefreq: "weekly" },
    { loc: "/gallery", priority: "0.5", changefreq: "weekly" },
    { loc: "/feedback", priority: "0.3", changefreq: "monthly" },
    { loc: "/write-for-us", priority: "0.4", changefreq: "monthly" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const p of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
  }

  if (categories) {
    for (const cat of categories) {
      xml += `  <url>
    <loc>${SITE_URL}/category/${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }
  }

  if (articles) {
    for (const a of articles) {
      const slug = slugify(a.title_en || a.title);
      const lastmod = a.updated_at ? new Date(a.updated_at).toISOString().split("T")[0] : "";
      xml += `  <url>
    <loc>${SITE_URL}/article/${slug}-${a.id}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
