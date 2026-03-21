const BOT_REGEX =
  /WhatsApp|facebookexternalhit|Twitterbot|Slackbot|TelegramBot|LinkedInBot|Discordbot|Pinterest|bot|crawler|spider/i;
const ARTICLE_PATH_REGEX = /^\/article\/(.+)$/i;
const UUID_SUFFIX_REGEX =
  /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;
const EDGE_FUNCTION_BASE_URL =
  "https://wytxdmxuhxfdpdqbcrea.supabase.co/functions/v1/share-meta";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHhkbXh1aHhmZHBkcWJjcmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjI5NzcsImV4cCI6MjA4NjI5ODk3N30.WZaVQE2C-AA91Gv4Gplx4_jT7-mtSjzpgf_gYJiRs3I";

async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  const isBot = BOT_REGEX.test(userAgent);
  const articleMatch = url.pathname.match(ARTICLE_PATH_REGEX);

  if (isBot && articleMatch) {
    const articleParam = articleMatch[1];
    const articleId = articleParam.match(UUID_SUFFIX_REGEX)?.[1] ?? articleParam;
    const edgeFnUrl = `${EDGE_FUNCTION_BASE_URL}?id=${encodeURIComponent(articleId)}`;

    const metaRes = await fetch(edgeFnUrl, {
      headers: {
        "User-Agent": userAgent,
        Accept: "text/html,application/xhtml+xml",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    return new Response(await metaRes.text(), {
      status: metaRes.status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  return fetch(request);
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});