import { useState, useRef, useEffect } from "react";
import { Share2, X, Copy, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPublicArticleUrl, getShareableArticleUrl } from "@/lib/articleUrl";

interface ShareButtonProps {
  articleId: string;
  title: string;
  className?: string;
  iconSize?: number;
  variant?: "overlay" | "inline";
}

const ShareButton = ({ articleId, title }: ShareButtonProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const publicUrl = getPublicArticleUrl(articleId, title);
  const shareUrl = getShareableArticleUrl(articleId);

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="bg-muted hover:bg-muted/80 rounded-full p-2">
        <Share2 className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-popover border rounded-lg shadow-lg p-3 w-56 z-50">
          <button onClick={shareWhatsApp} className="bg-[#25D366] text-white rounded-lg p-2">
            WhatsApp
          </button>

          <button
            onClick={copyLink}
            className="w-full flex items-center gap-2 text-xs bg-muted rounded-lg px-3 py-2 mt-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied
              ? language === "kn"
                ? "ಕಾಪಿ ಆಗಿದೆ!"
                : "Copied!"
              : language === "kn"
                ? "ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಿ"
                : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
