import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BOT_UA_REGEX = /(whatsapp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|bot|crawler|spider)/i;

const toOptimizedOgImage = (imageUrl: string) => {
  if (!imageUrl.includes("/storage/v1/object/public/")) return imageUrl;

  try {
    const parsed = new URL(imageUrl);
    parsed.pathname = parsed.pathname.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/",
    );
    parsed.searchParams.set("width", "1200");
    parsed.searchParams.set("height", "630");
    parsed.searchParams.set("resize", "cover");
    parsed.searchParams.set("quality", "80");
    return parsed.toString();
  } catch {
    return imageUrl;
  }
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
  const rawDesc = article.description_en || article.description || "";
  // Strip HTML tags and decode entities, then truncate
  const description = rawDesc
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);
  const rawOgImage = article.thumbnail_url || imagesRes.data?.[0]?.image_url || "";
  const ogImage = toOptimizedOgImage(rawOgImage);
  const siteUrl = "https://publicprimenews.in";
  const slugTitle = (title || "")
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "article";
  const articleUrl = `${siteUrl}/article/${slugTitle}-${article.id}`;
  const userAgent = req.headers.get("user-agent") || "";
  const isCrawlerRequest = BOT_UA_REGEX.test(userAgent);

  if (!isCrawlerRequest) {
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: articleUrl,
        "Cache-Control": "no-store",
      },
    });
  }

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
  <meta property="og:image:secure_url" content="${escHtml(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escHtml(articleUrl)}" />
  <meta property="og:site_name" content="Public Prime News" />
  <link rel="canonical" href="${escHtml(articleUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(description)}" />
  <meta name="twitter:image" content="${escHtml(ogImage)}" />
  <meta http-equiv="refresh" content="0;url=${escHtml(articleUrl)}" />
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
