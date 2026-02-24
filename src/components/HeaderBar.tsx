import { useMemo } from "react";
import logoImage from "@/assets/prime-logo-white.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const HeaderBar = () => {
  const { language, setLanguage } = useLanguage();
  const settings = useSiteSettings();

  const today = useMemo(() => {
    const now = new Date();
    if (language === "kn") {
      const days = ["ಭಾನುವಾರ", "ಸೋಮವಾರ", "ಮಂಗಳವಾರ", "ಬುಧವಾರ", "ಗುರುವಾರ", "ಶುಕ್ರವಾರ", "ಶನಿವಾರ"];
      const day = days[now.getDay()];
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      return `${day}, ${dd}-${mm}-${now.getFullYear()}`;
    }
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = days[now.getDay()];
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    return `${day}, ${dd}-${mm}-${now.getFullYear()}`;
  }, [language]);

  const logoSrc = settings?.website_logo_url || logoImage;

  return (
    <header className="bg-[#000000] text-white border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Date */}
        <div className="border border-white/30 px-3 py-1.5 text-sm font-medium rounded">
          {today}
        </div>

        {/* Logo + Slogan */}
        <div className="text-center flex flex-col items-center">
          <img
            src={logoSrc}
            alt="Public Prime News"
            className="h-12 md:h-16 w-auto object-contain"
          />
          <p className="text-[10px] md:text-xs text-white/70 tracking-[0.2em] mt-1 font-bold">
            Clear Vision, True Mission
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center border border-white/30 rounded-full overflow-hidden text-sm">
          <button
            onClick={() => setLanguage("kn")}
            className={`px-3 py-1.5 font-semibold transition-colors ${
              language === "kn"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-white/10"
            }`}
          >
            ಕನ್ನಡ
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1.5 font-semibold transition-colors ${
              language === "en"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-white/10"
            }`}
          >
            English
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
