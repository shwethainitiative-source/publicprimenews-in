export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") || "";

    const botRegex =
      /WhatsApp|facebookexternalhit|Twitterbot|Slackbot|TelegramBot|LinkedInBot|Discordbot|Pinterest|bot|crawler|spider/i;
    const isBot = botRegex.test(ua);

    // Only intercept article paths for bots
    const articleMatch = url.pathname.match(/^\/article\/(.+)$/);

    if (isBot && articleMatch) {
      // Extract the UUID from the slug-id pattern
      const param = articleMatch[1];
      const uuidMatch = param.match(
        /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i
      );
      const articleId = uuidMatch ? uuidMatch[1] : param;

      const edgeFnUrl = `https://wytxdmxuhxfdpdqbcrea.supabase.co/functions/v1/share-meta?id=${encodeURIComponent(articleId)}`;

      const metaRes = await fetch(edgeFnUrl, {
        headers: { "User-Agent": ua },
      });

      return new Response(metaRes.body, {
        status: metaRes.status,
        headers: {
          "Content-Type": metaRes.headers.get("Content-Type") || "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    // All other requests (normal users + non-article bot hits) pass through to origin
    return fetch(request);
  },
};
