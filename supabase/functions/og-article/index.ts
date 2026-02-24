import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const articleId = url.searchParams.get("id");

  if (!articleId) {
    return new Response("Missing article id", { status: 400, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch article and its images in parallel
  const [articleRes, imagesRes] = await Promise.all([
    supabase
      .from("articles")
      .select("id, title, title_en, description, description_en, thumbnail_url, categories(name)")
      .eq("id", articleId)
      .single(),
    supabase
      .from("article_images")
      .select("image_url")
      .eq("article_id", articleId)
      .order("sort_order")
      .limit(1),
  ]);

  const article = articleRes.data;
  if (!article) {
    return new Response("Article not found", { status: 404, headers: corsHeaders });
  }

  const title = article.title_en || article.title;
  const description = (article.description_en || article.description || "").substring(0, 160);
  const ogImage = imagesRes.data?.[0]?.image_url || article.thumbnail_url || "";
  const siteUrl = "https://publicprimenews-in.lovable.app";
  const articleUrl = `${siteUrl}/article/${article.id}`;

  const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escHtml(title)} - Public Prime News</title>
  <meta name="description" content="${escHtml(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escHtml(title)}" />
  <meta property="og:description" content="${escHtml(description)}" />
  <meta property="og:image" content="${escHtml(ogImage)}" />
  <meta property="og:url" content="${escHtml(articleUrl)}" />
  <meta property="og:site_name" content="Public Prime News" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(description)}" />
  <meta name="twitter:image" content="${escHtml(ogImage)}" />
  <script>window.location.replace("${articleUrl}");</script>
</head>
<body>
  <p>Redirecting to <a href="${escHtml(articleUrl)}">${escHtml(title)}</a>...</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
});
