const BOT_REGEX =
  /WhatsApp|facebookexternalhit|Twitterbot|Slackbot|TelegramBot|LinkedInBot|Discordbot|Pinterest|bot|crawler|spider/i;
const ARTICLE_PATH_REGEX = /^\/article\/(.+)$/i;
const UUID_SUFFIX_REGEX =
  /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;

const SUPABASE_URL = "https://wytxdmxuhxfdpdqbcrea.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHhkbXh1aHhmZHBkcWJjcmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjI5NzcsImV4cCI6MjA4NjI5ODk3N30.WZaVQE2C-AA91Gv4Gplx4_jT7-mtSjzpgf_gYJiRs3I";
const SITE_URL = "https://publicprimenews.in";

function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(title) {
  return (
    (title || "")
      .toLowerCase()
      .replace(/<[^>]*>/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "article"
  );
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  const isBot = BOT_REGEX.test(userAgent);
  const articleMatch = url.pathname.match(ARTICLE_PATH_REGEX);

  if (isBot && articleMatch) {
    const articleParam = articleMatch[1];
    const articleId =
      articleParam.match(UUID_SUFFIX_REGEX)?.[1] ?? articleParam;

    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    };

    // Fetch article + first image in parallel
    const [artRes, imgRes] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/articles?id=eq.${articleId}&select=id,title,title_en,description,description_en,thumbnail_url`,
        { headers }
      ),
      fetch(
        `${SUPABASE_URL}/rest/v1/article_images?article_id=eq.${articleId}&select=image_url&order=sort_order&limit=1`,
        { headers }
      ),
    ]);

    const articles = await artRes.json();
    const imgs = await imgRes.json();
    const article = articles?.[0];

    if (!article) {
      // Article not found — pass through to origin
      return fetch(request);
    }

    const title = escapeHtml(article.title_en || article.title);
    const rawDesc = (article.description_en || article.description || "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 160);
    const description = escapeHtml(rawDesc);

    let ogImage = imgs?.[0]?.image_url || article.thumbnail_url || "";
    if (ogImage.includes("/storage/v1/object/public/")) {
      ogImage =
        ogImage.replace(
          "/storage/v1/object/public/",
          "/storage/v1/render/image/public/"
        ) + "?width=1200&height=630&resize=cover&quality=80";
    }

    const slug = slugify(article.title_en || article.title);
    const canonicalUrl = `${SITE_URL}/article/${slug}-${article.id}`;

    const html = `<!DOCTYPE html>
<html lang="kn">
<head>
<meta charset="UTF-8"/>
<title>${title} - Public Prime News</title>
<meta name="description" content="${description}"/>
<link rel="canonical" href="${canonicalUrl}"/>
<meta property="og:type" content="article"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${description}"/>
<meta property="og:image" content="${ogImage}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:url" content="${canonicalUrl}"/>
<meta property="og:site_name" content="Public Prime News"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${title}"/>
<meta name="twitter:description" content="${description}"/>
<meta name="twitter:image" content="${ogImage}"/>
</head>
<body><p>Redirecting to <a href="${canonicalUrl}">${title}</a>...</p></body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  // Non-bot or non-article path — pass through to origin
  return fetch(request);
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
