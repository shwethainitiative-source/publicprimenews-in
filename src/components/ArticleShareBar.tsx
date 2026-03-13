import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { getPublicArticleUrl, getShareUrl } from "@/lib/articleUrl";
import { useLanguage } from "@/contexts/LanguageContext";

interface ArticleShareBarProps {
  articleId: string;
  title: string;
}

const ArticleShareBar = ({ articleId, title }: ArticleShareBarProps) => {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();

  const articleUrl = getPublicArticleUrl(articleId, title);
  const shareUrl = getShareUrl(articleId, title);

  const share = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={() => share(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`)}
        className="w-10 h-10 rounded-lg bg-[#25D366] text-white flex items-center justify-center"
      >
        WhatsApp
      </button>

      <button
        onClick={copyLink}
        className="w-10 h-10 rounded-lg bg-muted text-foreground flex items-center justify-center"
      >
        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default ArticleShareBar;
