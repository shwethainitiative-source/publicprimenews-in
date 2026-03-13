<?php
// Server-rendered OG meta tags for social sharing.
// Upload this file to your GoDaddy hosting so it is accessible at:
// https://publicprimenews.in/share/article.php?id=<ARTICLE_UUID>

declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');

$SUPABASE_URL = 'https://wytxdmxuhxfdpdqbcrea.supabase.co';
$SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
$SITE_URL = 'https://publicprimenews.in';

function is_bot_user_agent(string $ua): bool {
  return preg_match('/whatsapp|facebookexternalhit|facebot|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|bot|crawler|spider|pinterest|redditbot|googlebot|bingbot/i', $ua) === 1;
}

function e(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function slugify(string $title): string {
  $t = strtolower(trim($title));
  $t = preg_replace('/<[^>]*>/', '', $t);
  $t = preg_replace('/[^a-z0-9\s-]/', '', $t);
  $t = preg_replace('/\s+/', '-', $t);
  $t = preg_replace('/-+/', '-', $t);
  $t = preg_replace('/^-|-$/', '', $t);
  return $t !== '' ? $t : 'article';
}

function sb_get_json(string $url, string $anonKey): array {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'apikey: ' . $anonKey,
    'Authorization: Bearer ' . $anonKey,
    'Accept: application/json',
  ]);

  $body = curl_exec($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($body === false || $status < 200 || $status >= 300) return [];
  $json = json_decode($body, true);
  return is_array($json) ? $json : [];
}

$articleId = isset($_GET['id']) ? trim((string)$_GET['id']) : '';
if ($articleId === '') {
  http_response_code(400);
  echo 'Missing id';
  exit;
}

$ua = isset($_SERVER['HTTP_USER_AGENT']) ? (string)$_SERVER['HTTP_USER_AGENT'] : '';
$isBot = is_bot_user_agent($ua);

$articleArr = sb_get_json(
  $SUPABASE_URL . '/rest/v1/articles?id=eq.' . rawurlencode($articleId) . '&select=id,title,title_en,description,description_en,thumbnail_url',
  $SUPABASE_ANON_KEY
);

$article = (count($articleArr) > 0 && is_array($articleArr[0])) ? $articleArr[0] : null;

if (!$article || !isset($article['id'])) {
  http_response_code(404);
  echo 'Not found';
  exit;
}

$imgArr = sb_get_json(
  $SUPABASE_URL . '/rest/v1/article_images?article_id=eq.' . rawurlencode($articleId) . '&select=image_url&order=sort_order&limit=1',
  $SUPABASE_ANON_KEY
);

$titleRaw = (string)($article['title_en'] ?? $article['title'] ?? '');
$descHtml = (string)($article['description_en'] ?? $article['description'] ?? '');

$descText = preg_replace('/<[^>]*>/', ' ', $descHtml);
$descText = str_replace('&nbsp;', ' ', (string)$descText);
$descText = trim(preg_replace('/\s+/', ' ', (string)$descText));

if (strlen($descText) > 160) {
  $descText = substr($descText, 0, 160);
}

$ogImage = '';

if (count($imgArr) > 0 && is_array($imgArr[0]) && isset($imgArr[0]['image_url'])) {
  $ogImage = (string)$imgArr[0]['image_url'];
} else if (isset($article['thumbnail_url'])) {
  $ogImage = (string)$article['thumbnail_url'];
}

if ($ogImage !== '' && strpos($ogImage, '/storage/v1/object/public/') !== false) {
  $ogImage = str_replace('/storage/v1/object/public/', '/storage/v1/render/image/public/', $ogImage);
  $ogImage = $ogImage . '?width=1200&height=630&resize=cover&quality=80';
}

$slug = slugify($titleRaw);
$articleUrl = $SITE_URL . '/article/' . $slug . '-' . e((string)$article['id']);

if (!$isBot) {
  header('Location: ' . $articleUrl, true, 302);
  exit;
}

echo '<!DOCTYPE html><html><head>';
echo '<meta charset="UTF-8"/>';
echo '<title>' . e($titleRaw) . ' - Public Prime News</title>';
echo '<meta name="description" content="' . e($descText) . '"/>';
echo '<meta property="og:type" content="article"/>';
echo '<meta property="og:title" content="' . e($titleRaw) . '"/>';
echo '<meta property="og:description" content="' . e($descText) . '"/>';
if ($ogImage !== '') {
  echo '<meta property="og:image" content="' . e($ogImage) . '"/>';
  echo '<meta property="og:image:width" content="1200"/>';
  echo '<meta property="og:image:height" content="630"/>';
}
echo '<meta property="og:url" content="' . e($articleUrl) . '"/>';
echo '<meta property="og:site_name" content="Public Prime News"/>';
echo '<meta name="twitter:card" content="summary_large_image"/>';
echo '<meta name="twitter:title" content="' . e($titleRaw) . '"/>';
echo '<meta name="twitter:description" content="' . e($descText) . '"/>';
if ($ogImage !== '') {
  echo '<meta name="twitter:image" content="' . e($ogImage) . '"/>';
}
echo '</head><body><p>Redirecting...</p></body></html>';