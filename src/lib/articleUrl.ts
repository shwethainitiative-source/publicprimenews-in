const SITE_URL = "https://publicprimenews.in";

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

export const getPublicArticleUrl = (articleId: string, title?: string | null) =>
  `${SITE_URL}${getArticlePath(articleId, title)}`;

export const extractArticleIdFromParam = (param: string) => {
  if (!param) return "";
  if (UUID_EXACT_REGEX.test(param)) return param;
  const match = param.match(UUID_SUFFIX_REGEX);
  return match?.[0] ?? param;
};
