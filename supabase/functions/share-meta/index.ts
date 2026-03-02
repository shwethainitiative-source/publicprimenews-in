Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const articleId = url.searchParams.get("id");
    if (!articleId) {
      return new Response("Missing id", { status: 400, headers: corsHeaders });
    }

    const sbUrl = Deno.env.get("SUPABASE_URL")!;
    const sbKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const artRes = await fetch(
      `${sbUrl}/rest/v1/articles?id=eq.${articleId}&select=id,title,title_en,description,description_en,thumbnail_url`,
      { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` } }
    );
    const articles = await artRes.json();
    const article = articles?.[0];
    if (!article) {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    const imgRes = await fetch(
      `${sbUrl}/rest/v1/article_images?article_id=eq.${articleId}&select=image_url&order=sort_order&limit=1`,
      { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` } }
    );
    const imgs = await imgRes.json();

    const title = (article.title_en || article.title || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");

    const rawDesc = article.description_en || article.description || "";
    const description = rawDesc
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 160)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;");

    let ogImage = imgs?.[0]?.image_url || article.thumbnail_url || "";
    if (ogImage.includes("/storage/v1/object/public/")) {
      ogImage =
        ogImage.replace(
          "/storage/v1/object/public/",
          "/storage/v1/render/image/public/"
        ) + "?width=1200&height=630&resize=cover&quality=80";
    }

    const slug =
      (article.title_en || article.title || "article")
        .toLowerCase()
        .replace(/<[^>]*>/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "article";

    const articleUrl = `https://publicprimenews.in/article/${slug}-${article.id}`;

    const ua = req.headers.get("user-agent") || "";
    const isBot =
      /whatsapp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|bot|crawler|spider/i.test(
        ua
      );

    if (!isBot) {
      return new Response(null, {
        status: 302,
        headers: { Location: articleUrl, ...corsHeaders },
      });
    }

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>${title} - Public Prime News</title>
<meta name="description" content="${description}"/>
<meta property="og:type" content="article"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${description}"/>
<meta property="og:image" content="${ogImage}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:url" content="${articleUrl}"/>
<meta property="og:site_name" content="Public Prime News"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${title}"/>
<meta name="twitter:description" content="${description}"/>
<meta name="twitter:image" content="${ogImage}"/>
</head>
<body><p>Redirecting...</p></body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.error("og-article error:", err);
    return new Response("Error", { status: 500 });
  }
});
