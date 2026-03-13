<?php

declare(strict_types=1);
header('Content-Type: text/html; charset=utf-8');

$SUPABASE_URL = 'https://wytxdmxuhxfdpdqbcrea.supabase.co';
$SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
$SITE_URL = 'https://publicprimenews.in';

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
  curl_close($ch);

  $json = json_decode($body, true);
  return is_array($json) ? $json : [];
}

$articleId = isset($_GET['id']) ? trim((string)$_GET['id']) : '';

if ($articleId === '') {
  echo 'Missing article id';
  exit;
}

$articleArr = sb_get_json(
  $SUPABASE_URL . '/rest/v1/articles?id=eq.' . rawurlencode($articleId) .
  '&select=id,title,title_en,description,description_en,thumbnail_url',
  $SUPABASE_ANON_KEY
);

$article = $articleArr[0] ?? null;

if (!$article) {
  echo 'Article not found';
  exit;
}

$titleRaw = (string)($article['title_en'] ?? $article['title']);
$descHtml = (string)($article['description_en'] ?? $article['description']);

$descText = preg_replace('/<[^>]*>/', ' ', $descHtml);
$descText = trim(preg_replace('/\s+/', ' ', $descText));
$descText = substr($descText, 0, 160);

$ogImage = $article['thumbnail_url'] ?? '';

$slug = slugify($titleRaw);
$articleUrl = $SITE_URL . '/article/' . $slug . '-' . $article['id'];

?>

<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<title><?= e($titleRaw) ?> - Public Prime News</title>

<meta name="description" content="<?= e($descText) ?>">

<meta property="og:type" content="article">
<meta property="og:title" content="<?= e($titleRaw) ?>">
<meta property="og:description" content="<?= e($descText) ?>">
<meta property="og:image" content="<?= e($ogImage) ?>">
<meta property="og:url" content="<?= e($articleUrl) ?>">
<meta property="og:site_name" content="Public Prime News">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($titleRaw) ?>">
<meta name="twitter:description" content="<?= e($descText) ?>">
<meta name="twitter:image" content="<?= e($ogImage) ?>">

</head>

<body>

<p>Redirecting...</p>

<script>
window.location.href = "<?= $articleUrl ?>";
</script>

</body>
</html>