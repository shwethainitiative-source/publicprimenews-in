import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface MenuItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { label: "ಮುಖಪುಟ", href: "/" },
  { label: "ನಮ್ಮ ಬಗ್ಗೆ", href: "/about" },
  {
    label: "ಕನ್ನಡನಾಡಿ",
    children: [
      { label: "ನಮ್ಮೂರ ಸುದ್ದಿ", href: "/nammura-suddi" },
      { label: "ಉಡುಪಿ", href: "/udupi" },
      { label: "ಕಾರ್ಕಳ", href: "/karkala" },
    ],
  },
  { label: "ಅಪರಾಧ ಲೋಕ", href: "/crime" },
  { label: "ರಾಜಕೀಯ", href: "/politics" },
  { label: "ಶಿಕ್ಷಣ", href: "/education" },
  {
    label: "ವಿಶೇಷ ಲೇಖನಗಳು",
    children: [
      { label: "ಆರೋಗ್ಯವೇ ಭಾಗ್ಯ", href: "/health" },
      { label: "ಕೃಷಿ ಮಾಹಿತಿ", href: "/agriculture" },
      { label: "ಸೋಷಿಯಲ್ ಮೀಡಿಯಾ ಕಥೆಗಳು", href: "/social-media" },
      { label: "ಬರಹಗಾರರಾಗಿ, ನೀವು ಬರೆಯಿರಿ ..?", href: "/write" },
    ],
  },
  {
    label: "ಸಂದರ್ಶನಗಳು",
    children: [
      { label: "ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್ ಸಂದರ್ಶನಗಳು", href: "/interviews" },
      { label: "ವಾಯ್ಸ್ ಆಫ್ ಪಬ್ಲಿಕ್", href: "/voice-of-public" },
      { label: "ಭ್ರಷ್ಟರ ಬೇಟೆಗೆ ಮೂರನೇ ಕಣ್ಣು..", href: "/third-eye" },
      { label: "ಸಾಧಕರ ಚರಿತ್ರೆ..", href: "/achievers" },
      { label: "ನಮ್ಮೂರ ಹೆಮ್ಮೆಯ ಸಾಧಕರು", href: "/local-achievers" },
    ],
  },
  { label: "ಉದ್ಯೋಗ ಮಾಹಿತಿ", href: "/jobs" },
  { label: "ಫೋಟೊ ಗ್ಯಾಲರಿ", href: "/gallery" },
  { label: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ", href: "/feedback" },
];

const NavigationBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleMobileDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className="bg-nav text-nav-foreground relative z-50">
      <div className="container mx-auto px-4">
        {/* Mobile toggle */}
        <div className="flex items-center justify-between md:hidden py-2">
          <span className="font-semibold text-sm">ಮೆನು</span>
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
            <li key={item.label} className="relative group">
              {item.children ? (
                <>
                  <button className="flex items-center gap-1 px-3 py-3 hover:bg-primary/20 transition-colors whitespace-nowrap">
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <ul className="absolute left-0 top-full bg-nav border border-border/20 rounded-b shadow-lg min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          className="block px-4 py-2.5 text-sm hover:bg-primary/20 transition-colors whitespace-nowrap"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <a
                  href={item.href}
                  className="block px-3 py-3 hover:bg-primary/20 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile menu */}
        {mobileOpen && (
          <ul className="md:hidden pb-3 space-y-1 text-sm">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(item.label)}
                      className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-primary/20 transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <ul className="pl-4 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <a
                              href={child.href}
                              className="block px-3 py-2 hover:bg-primary/20 transition-colors text-nav-foreground/80"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="block px-3 py-2.5 hover:bg-primary/20 transition-colors"
                  >
                    {item.label}
                  </a>
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
