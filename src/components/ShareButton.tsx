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
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "bg-[#000000] hover:bg-[#333333]",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "bg-[#0A66C2] hover:bg-[#084e96]",
    getUrl: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0 12 12 0 0011.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    color: "bg-[#0088cc] hover:bg-[#006da3]",
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
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
  const shareUrl = getShareUrl(articleId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: typeof platforms[number]) => {
    window.open(platform.getUrl(shareUrl, title), "_blank", "noopener,noreferrer");
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
        } rounded-full p-2 transition-all duration-200`}
        aria-label={language === "kn" ? "ಹಂಚಿಕೊಳ್ಳಿ" : "Share"}
      >
        <Share2 className={`w-${iconSize / 4} h-${iconSize / 4}`} style={{ width: iconSize, height: iconSize }} />
      </button>

      {open && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="fixed z-[9999] bg-popover border border-border rounded-xl shadow-xl p-3 w-56 animate-in fade-in-0 zoom-in-95"
          style={{
            top: (() => {
              const rect = ref.current?.getBoundingClientRect();
              if (!rect) return 0;
              const popupHeight = 160;
              const bottom = rect.bottom + 8;
              if (bottom + popupHeight > window.innerHeight) {
                return rect.top - popupHeight - 8;
              }
              return bottom;
            })(),
            left: (() => {
              const rect = ref.current?.getBoundingClientRect();
              if (!rect) return 0;
              const popupWidth = 224; // w-56 = 14rem = 224px
              let left = rect.right - popupWidth;
              if (left < 8) left = 8;
              if (left + popupWidth > window.innerWidth - 8) left = window.innerWidth - popupWidth - 8;
              return left;
            })(),
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">
              {language === "kn" ? "ಹಂಚಿಕೊಳ್ಳಿ" : "Share"}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {platforms.map((p) => (
              <button
                key={p.name}
                onClick={() => handleShare(p)}
                className={`${p.color} text-white rounded-lg p-2 flex items-center justify-center transition-transform hover:scale-110`}
                title={p.name}
              >
                {p.icon}
              </button>
            ))}
          </div>
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-2 text-xs bg-muted hover:bg-muted/80 rounded-lg px-3 py-2 text-foreground transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied
              ? language === "kn" ? "ಕಾಪಿ ಆಗಿದೆ!" : "Copied!"
              : language === "kn" ? "ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಿ" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
