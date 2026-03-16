export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") || "";

    // Simple bot detector (adjust later if needed)
    const botRegex = /WhatsApp|facebookexternalhit|Twitterbot|Slackbot|TelegramBot|LinkedInBot|Discordbot|Pinterest/i;
    const isBot = botRegex.test(ua);

    // Special hard‑wired test route
    if (url.pathname === "/og-test") {
      return new Response(
        JSON.stringify(
          {
            status: "Worker is active on publicprimenews.in",
            path: url.pathname,
            ua,
            isBot,
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
        {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
          },
        },
      );
    }

    // For now: return debug JSON for ALL other paths too,
    // just to prove the Worker is actually in front.
    return new Response(
      JSON.stringify(
        {
          status: "Worker is active (catch-all)",
          path: url.pathname,
          ua,
          isBot,
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      ),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      },
    );
  },
};
