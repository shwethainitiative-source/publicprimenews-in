/**
 * Extract YouTube video ID from various URL formats
 */
export function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/
  );
  return match?.[1] ?? null;
}

/**
 * Get YouTube thumbnail URL from a video URL
 */
export function getYoutubeThumbnail(url: string): string | null {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/**
 * Get YouTube embed URL from a video URL
 */
export function getYoutubeEmbedUrl(url: string): string | null {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
}
