import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface MenuItem {
  labelKn: string;
  labelEn: string;
  href?: string;
  children?: { labelKn: string; labelEn: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { labelKn: "ಮುಖಪುಟ", labelEn: "Home", href: "/" },
  { labelKn: "ನಮ್ಮ ಬಗ್ಗೆ", labelEn: "About Us", href: "/about" },
  {
    labelKn: "ಕನ್ನಡನಾಡಿ", labelEn: "Kannadanadi",
    children: [
      { labelKn: "ನಮ್ಮೂರ ಸುದ್ದಿ", labelEn: "Local News", href: "/category/nammura-suddi" },
      { labelKn: "ಉಡುಪಿ", labelEn: "Udupi", href: "/category/udupi" },
      { labelKn: "ಕಾರ್ಕಳ", labelEn: "Karkala", href: "/category/karkala" },
    ],
  },
  { labelKn: "ಅಪರಾಧ ಲೋಕ", labelEn: "Crime", href: "/category/crime" },
  { labelKn: "ರಾಜಕೀಯ", labelEn: "Politics", href: "/category/politics" },
  { labelKn: "ಶಿಕ್ಷಣ", labelEn: "Education", href: "/category/education" },
  {
    labelKn: "ವಿಶೇಷ ಲೇಖನಗಳು", labelEn: "Special Articles",
    children: [
      { labelKn: "ಆರೋಗ್ಯವೇ ಭಾಗ್ಯ", labelEn: "Health", href: "/category/health" },
      { labelKn: "ಕೃಷಿ ಮಾಹಿತಿ", labelEn: "Agriculture", href: "/category/agriculture" },
      { labelKn: "ಸೋಷಿಯಲ್ ಮೀಡಿಯಾ ಕಥೆಗಳು", labelEn: "Social Media Stories", href: "/category/social-media" },
      { labelKn: "ಬರಹಗಾರರಾಗಿ, ನೀವು ಬರೆಯಿರಿ ..?", labelEn: "Write for Us", href: "/category/write" },
    ],
  },
  {
    labelKn: "ಸಂದರ್ಶನಗಳು", labelEn: "Interviews",
    children: [
      { labelKn: "ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್ ಸಂದರ್ಶನಗಳು", labelEn: "Interviews", href: "/category/interviews" },
      { labelKn: "ವಾಯ್ಸ್ ಆಫ್ ಪಬ್ಲಿಕ್", labelEn: "Voice of Public", href: "/category/voice-of-public" },
      { labelKn: "ಭ್ರಷ್ಟರ ಬೇಟೆಗೆ ಮೂರನೇ ಕಣ್ಣು..", labelEn: "Third Eye", href: "/category/third-eye" },
      { labelKn: "ಸಾಧಕರ ಚರಿತ್ರೆ..", labelEn: "Achievers", href: "/category/achievers" },
      { labelKn: "ನಮ್ಮೂರ ಹೆಮ್ಮೆಯ ಸಾಧಕರು", labelEn: "Local Achievers", href: "/category/local-achievers" },
    ],
  },
  { labelKn: "ಉದ್ಯೋಗ ಮಾಹಿತಿ", labelEn: "Jobs", href: "/jobs" },
  { labelKn: "ಫೋಟೊ ಗ್ಯಾಲರಿ", labelEn: "Photo Gallery", href: "/gallery" },
  { labelKn: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ", labelEn: "Feedback", href: "/feedback" },
];

const NavigationBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { language } = useLanguage();

  const getLabel = (item: { labelKn: string; labelEn: string }) =>
    language === "en" ? item.labelEn : item.labelKn;

  const toggleMobileDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className="bg-nav text-nav-foreground relative z-50">
      <div className="container mx-auto px-4">
        {/* Mobile toggle */}
        <div className="flex items-center justify-between md:hidden py-2">
          <span className="font-semibold text-sm">{language === "kn" ? "ಮೆನು" : "Menu"}</span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-nav-foreground"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-0 text-sm font-medium">
          {menuItems.map((item) => (
            <li key={item.labelKn} className="relative group">
              {item.children ? (
                <>
                  <button className="flex items-center gap-1 px-3 py-3 hover:bg-primary/20 transition-colors whitespace-nowrap">
                    {getLabel(item)}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <ul className="absolute left-0 top-full bg-nav border border-border/20 rounded-b shadow-lg min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {item.children.map((child) => (
                      <li key={child.labelKn}>
                        <Link
                          to={child.href}
                          className="block px-4 py-2.5 text-sm hover:bg-primary/20 transition-colors whitespace-nowrap"
                        >
                          {getLabel(child)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  to={item.href!}
                  className="block px-3 py-3 hover:bg-primary/20 transition-colors whitespace-nowrap"
                >
                  {getLabel(item)}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile menu */}
        {mobileOpen && (
          <ul className="md:hidden pb-3 space-y-1 text-sm">
            {menuItems.map((item) => (
              <li key={item.labelKn}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(item.labelKn)}
                      className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-primary/20 transition-colors"
                    >
                      {getLabel(item)}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${openDropdown === item.labelKn ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === item.labelKn && (
                      <ul className="pl-4 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.labelKn}>
                            <Link
                              to={child.href}
                              className="block px-3 py-2 hover:bg-primary/20 transition-colors text-nav-foreground/80"
                            >
                              {getLabel(child)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href!}
                    className="block px-3 py-2.5 hover:bg-primary/20 transition-colors"
                  >
                    {getLabel(item)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
