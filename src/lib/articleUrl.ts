const SITE_URL = "https://publicprimenews.in";
const SHARE_META_FN = `https://wytxdmxuhxfdpdqbcrea.supabase.co/functions/v1/share-meta`;

const UUID_EXACT_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_SUFFIX_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const slugifyArticleTitle = (title: string) =>
  (title || "")
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const getArticlePath = (articleId: string, title?: string | null) => {
  const slug = slugifyArticleTitle(title || "") || "article";
  return `/article/${slug}-${articleId}`;
};

/** Use current origin so shared links work on any hosting domain */
export const getPublicArticleUrl = (articleId: string, title?: string | null) => {
  const origin = typeof window !== "undefined" ? window.location.origin : SITE_URL;
  return `${origin}${getArticlePath(articleId, title)}`;
};

/** URL for social sharing — goes through the edge function so crawlers get
 *  article-specific OG tags. The og:url in the response points to publicprimenews.in
 *  so WhatsApp displays the correct domain. Real users get 302-redirected to the article. */
export const getShareUrl = (articleId: string, _title?: string | null) =>
  `${SHARE_META_FN}?id=${articleId}`;

export const extractArticleIdFromParam = (param: string) => {
  if (!param) return "";
  if (UUID_EXACT_REGEX.test(param)) return param;
  const match = param.match(UUID_SUFFIX_REGEX);
  return match?.[0] ?? param;
};
