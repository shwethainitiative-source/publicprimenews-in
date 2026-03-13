```tsx
import { useState, useRef, useEffect } from "react";
import { Share2, X, Copy, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPublicArticleUrl, getShareUrl } from "@/lib/articleUrl";

interface ShareButtonProps {
  articleId: string;
  title: string;
  className?: string;
  iconSize?: number;
  variant?: "overlay" | "inline";
}

const platforms = [
  {
    name: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
      </svg>
    ),
    color: "bg-[#25D366] hover:bg-[#1da851]",
    getUrl: (url: string) =>
      `https://wa.me/?text=${encodeURIComponent(url)}`,
  },

  {
    name: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: "bg-[#1877F2] hover:bg-[#0d65d9]",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
  },

  {
    name: "X",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
      </svg>
    ),
    color: "bg-black hover:bg-gray-800",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
  },

  {
    name: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" />
      </svg>
    ),
    color: "bg-[#0A66C2] hover:bg-[#084e96]",
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
  },

  {
    name: "Telegram",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0z" />
      </svg>
    ),
    color: "bg-[#0088cc] hover:bg-[#006da3]",
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
  },
];

const ShareButton = ({
  articleId,
  title,
  className = "",
  iconSize = 16,
  variant = "overlay",
}: ShareButtonProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const articleUrl = getPublicArticleUrl(articleId, title);
  const shareUrl = getShareUrl(articleId, title);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handler);
    }

    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: (typeof platforms)[number]) => {
    window.open(
      platform.getUrl(shareUrl, title),
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  };

  const isOverlay = variant === "overlay";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className={`${
          isOverlay
            ? "bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
            : "bg-muted hover:bg-muted/80 text-foreground"
        } rounded-full p-2 transition-all`}
        aria-label={language === "kn" ? "ಹಂಚಿಕೊಳ್ಳಿ" : "Share"}
      >
        <Share2 style={{ width: iconSize, height: iconSize }} />
      </button>

      {open && (
        <div className="fixed z-[9999] bg-popover border border-border rounded-xl shadow-xl p-3 w-56">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">
              {language === "kn" ? "ಹಂಚಿಕೊಳ್ಳಿ" : "Share"}
            </span>

            <button onClick={() => setOpen(false)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-2">
            {platforms.map((p) => (
              <button
                key={p.name}
                onClick={() => handleShare(p)}
                className={`${p.color} text-white rounded-lg p-2 flex items-center justify-center`}
              >
                {p.icon}
              </button>
            ))}
          </div>

          <button
            onClick={copyLink}
            className="w-full flex items-center gap-2 text-xs bg-muted rounded-lg px-3 py-2"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}

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
```
