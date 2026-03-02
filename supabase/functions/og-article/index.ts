import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BOT_RE =
  /whatsapp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|bot|crawler|spider/i;

function optimizeImage(url: string): string {
  if (!url || !url.includes("/storage/v1/object/public/")) return url;
  try {
    const u = new URL(url);
    u.pathname = u.pathname.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/"
    );
    u.searchParams.set("width", "1200");
    u.searchParams.set("height", "630");
    u.searchParams.set("resize", "cover");
    u.searchParams.set("quality", "80");
    return u.toString();
  } catch (_e) {
    return url;
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/<[^>]*>/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "article"
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const articleId = url.searchParams.get("id");

    if (!articleId) {
      return new Response("Missing article id", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const [articleRes, imagesRes] = await Promise.all([
      supabase
        .from("articles")
        .select(
          "id, title, title_en, description, description_en, thumbnail_url, categories(name)"
        )
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
      return new Response("Article not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    const title = article.title_en || article.title;
    const rawDesc = article.description_en || article.description || "";
    const description = stripHtml(rawDesc).substring(0, 160);
    const rawImage =
      imagesRes.data?.[0]?.image_url || article.thumbnail_url || "";
    const ogImage = optimizeImage(rawImage);
    const siteUrl = "https://publicprimenews.in";
    const articleUrl = `${siteUrl}/article/${slugify(title)}-${article.id}`;

    const ua = req.headers.get("user-agent") || "";
    if (!BOT_RE.test(ua)) {
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          Location: articleUrl,
          "Cache-Control": "no-store",
        },
      });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${esc(title)} - Public Prime News</title>
<meta name="description" content="${esc(description)}"/>
<meta property="og:type" content="article"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:image" content="${esc(ogImage)}"/>
<meta property="og:image:secure_url" content="${esc(ogImage)}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:url" content="${esc(articleUrl)}"/>
<meta property="og:site_name" content="Public Prime News"/>
<link rel="canonical" href="${esc(articleUrl)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>
<meta name="twitter:image" content="${esc(ogImage)}"/>
<meta http-equiv="refresh" content="0;url=${esc(articleUrl)}"/>
</head>
<body><p>Redirecting to <a href="${esc(articleUrl)}">${esc(title)}</a>...</p></body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error("og-article error:", err);
    return new Response("Internal error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
