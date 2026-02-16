import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const quickLinks = [
  "ಮುಖಪುಟ", "ನಮ್ಮ ಬಗ್ಗೆ", "ಕನ್ನಡನಾಡಿ", "ಅಪರಾಧ ಲೋಕ", "ರಾಜಕೀಯ",
  "ಶಿಕ್ಷಣ", "ವಿಶೇಷ ಲೇಖನಗಳು", "ಸಂದರ್ಶನಗಳು", "ಉದ್ಯೋಗ ಮಾಹಿತಿ", "ಫೋಟೊ ಗ್ಯಾಲರಿ",
];

const Footer = () => {
  const settings = useSiteSettings();

  const socialLinks = [
    { icon: Instagram, label: "Instagram", url: settings?.instagram_link || "#" },
    { icon: Facebook, label: "Facebook", url: settings?.facebook_link || "#" },
    { icon: Youtube, label: "YouTube", url: settings?.youtube_link || "#" },
  ];

  return (
    <footer className="bg-nav text-nav-foreground mt-8">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-extrabold mb-3">ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್</h3>
            <p className="text-nav-foreground/70 text-sm leading-relaxed">
              ಕರ್ನಾಟಕದ ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಸುದ್ದಿ ಮಾಧ್ಯಮ. ನಿಮ್ಮ ಸುತ್ತಮುತ್ತಲಿನ ಎಲ್ಲಾ ಸುದ್ದಿಗಳನ್ನು ನಿಮಗೆ ತಲುಪಿಸುವ ನಂಬಿಕೆಯ ಪೋರ್ಟಲ್.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು</h3>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-nav-foreground/70 text-sm hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-3">ಸೋಷಿಯಲ್ ಮೀಡಿಯಾ</h3>
            <div className="flex gap-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-nav-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            {settings?.whatsapp_group_link && (
              <a
                href={settings.whatsapp_group_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1da851] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Group
              </a>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-3">ಸಂಪರ್ಕಿಸಿ</h3>
            <ul className="space-y-2 text-sm text-nav-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{settings?.email || "—"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{settings?.contact_number || "—"}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>ಉಡುಪಿ, ಕರ್ನಾಟಕ, ಭಾರತ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <Separator className="bg-nav-foreground/20" />
      <div className="container mx-auto px-4 py-4 text-center text-xs text-nav-foreground/50">
        © {new Date().getFullYear()} ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.
      </div>
    </footer>
  );
};

export default Footer;
