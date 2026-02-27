import { Link } from "react-router-dom";
import VideoModal from "@/components/VideoModal";
import { useState, ReactNode } from "react";
import { getArticlePath } from "@/lib/articleUrl";

interface ArticleLinkProps {
  articleId: string;
  youtubeUrl?: string | null;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps article cards. If youtube_url exists, opens video modal on click.
 * Otherwise navigates to normal article page.
 */
const ArticleLink = ({ articleId, youtubeUrl, title, children, className }: ArticleLinkProps) => {
  const [showVideo, setShowVideo] = useState(false);

  if (youtubeUrl) {
    return (
      <>
        <div className={className} onClick={() => setShowVideo(true)} style={{ cursor: "pointer" }}>
          {children}
        </div>
        <VideoModal
          video={showVideo ? { title, youtube_url: youtubeUrl } : null}
          onClose={() => setShowVideo(false)}
        />
      </>
    );
  }

  return (
    <Link to={getArticlePath(articleId, title)} className={className}>
      {children}
    </Link>
  );
};

export default ArticleLink;
