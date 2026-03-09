/**
 * Cloudflare Worker: OG Meta Proxy for publicprimenews.in
 *
 * SETUP:
 * 1. Go to https://dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. Paste this script → Deploy
 * 3. Go to Workers Routes → Add Route:
 *    Route pattern: publicprimenews.in/*
 *    Worker: (select this worker)
 *    Zone: publicprimenews.in
 * 4. Also add: www.publicprimenews.in/*
 *
 * IMPORTANT: Route must be "publicprimenews.in/*" (with wildcard),
 *            NOT "publicprimenews.in/article/*"
 *
 * TEST: Visit https://publicprimenews.in/og-test to verify the worker is active
 */

const BOT_UA =
  /whatsapp|facebookexternalhit|facebot|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|googlebot|bingbot|yandex|baiduspider|duckduckbot|pinterest|redditbot|applebot|embedly|quora|outbrain|showyoubot|vkshare|tumblr|skypeuripreview|nuzzel|w3c_validator|rogerbot|semrushbot/i;

const SUPABASE_OG_FN = "https://wytxdmxuhxfdpdqbcrea.supabase.co/functions/v1/share-meta";
const SUPABASE_SITEMAP_FN = "https://wytxdmxuhxfdpdqbcrea.supabase.co/functions/v1/sitemap";

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") || "";

    // Test endpoint to verify worker is active
    if (url.pathname === "/og-test") {
      return new Response(
        JSON.stringify({
          status: "Worker is active!",
          timestamp: new Date().toISOString(),
          ua: ua,
          isBot: BOT_UA.test(ua),
          path: url.pathname,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Serve dynamic sitemap.xml
    if (url.pathname === "/sitemap.xml") {
      try {
        const sitemapRes = await fetch(SUPABASE_SITEMAP_FN);
        if (sitemapRes.ok) {
          return new Response(await sitemapRes.text(), {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      } catch (e) {
        // Fall through to origin
      }
    }

    // Only intercept /article/* paths for bots
    if (url.pathname.startsWith("/article/") && BOT_UA.test(ua)) {
      const param = url.pathname.replace("/article/", "");
      const match = param.match(UUID_REGEX);
      const articleId = match ? match[0] : param;

      if (articleId) {
        try {
          const ogUrl = `${SUPABASE_OG_FN}?id=${articleId}`;
          const ogResponse = await fetch(ogUrl, {
            headers: {
              "User-Agent": ua,
            },
          });
          if (ogResponse.ok) {
            const html = await ogResponse.text();
            return new Response(html, {
              headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=300",
              },
            });
          }
        } catch (e) {
          // Fall through to origin on error
        }
      }
    }

    // All other requests → pass through to origin
    return fetch(request);
  },
};
