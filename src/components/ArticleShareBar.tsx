import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { getPublicArticleUrl } from "@/lib/articleUrl";
import { useLanguage } from "@/contexts/LanguageContext";

interface ArticleShareBarProps {
  articleId: string;
  title: string;
}

const ArticleShareBar = ({ articleId, title }: ArticleShareBarProps) => {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();

  const articleUrl = getPublicArticleUrl(articleId, title);

  // IMPORTANT: Use PHP share endpoint so WhatsApp/Facebook read OG meta tags
  const shareUrl = `https://publicprimenews.in/share/article.php?id=${articleId}`;

  const share = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      {/* WhatsApp */}
      <button
        onClick={() => share(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`)}
        className="w-10 h-10 rounded-lg bg-[#25D366] hover:bg-[#1da851] text-white flex items-center justify-center transition-transform hover:scale-110"
        aria-label="Share on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
        </svg>
      </button>

      {/* Facebook */}
      <button
        onClick={() => share(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}
        className="w-10 h-10 rounded-lg bg-[#1877F2] hover:bg-[#0d65d9] text-white flex items-center justify-center transition-transform hover:scale-110"
        aria-label="Share on Facebook"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => share(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)}
        className="w-10 h-10 rounded-lg bg-[#0A66C2] hover:bg-[#084e96] text-white flex items-center justify-center transition-transform hover:scale-110"
        aria-label="Share on LinkedIn"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" />
        </svg>
      </button>

      {/* Copy link */}
      <button
        onClick={copyLink}
        className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition-transform hover:scale-110"
        aria-label={copied ? "Copied" : "Copy link"}
      >
        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
      </button>

      {copied && (
        <span className="text-xs text-green-600 font-medium">{language === "kn" ? "ಕಾಪಿ ಆಗಿದೆ!" : "Copied!"}</span>
      )}
    </div>
  );
};

export default ArticleShareBar;
