/**
 * Cloudflare Worker: OG Meta Proxy for publicprimenews.in
 *
 * This worker intercepts crawler/bot requests to article pages and
 * proxies them to the og-article edge function so that WhatsApp,
 * Facebook, Twitter etc. see article-specific title, description,
 * and thumbnail — while real users get the normal SPA.
 *
 * SETUP:
 * 1. Go to https://dash.cloudflare.com → add publicprimenews.in
 * 2. Change DNS nameservers to Cloudflare's (keep A record → 185.158.133.1)
 * 3. Workers & Pages → Create Worker → paste this script → Deploy
 * 4. Add route: publicprimenews.in/article/* → this worker
 *
 * HOW IT WORKS:
 * - Bot/crawler request → fetches og-article edge function HTML (with OG tags)
 * - Normal user request → passes through to Lovable hosting (SPA)
 */

const BOT_UA =
  /(whatsapp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|bot|crawler|spider|preview)/i;

const SUPABASE_OG_FN = "https://wytxdmxuhxfdpdqbcrea.supabase.co/functions/v1/share-meta";
const SUPABASE_SITEMAP_FN = "https://wytxdmxuhxfdpdqbcrea.supabase.co/functions/v1/sitemap";

// Extract UUID from /article/slug-uuid pattern
const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") || "";

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
          const ogResponse = await fetch(`${SUPABASE_OG_FN}?id=${articleId}`, {
            headers: {
              "User-Agent": ua, // pass bot UA so edge function returns HTML
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

    // All other requests → pass through to Lovable hosting
    return fetch(request);
  },
};
