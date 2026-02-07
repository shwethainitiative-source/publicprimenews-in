import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  "ಮುಖಪುಟ", "ನಮ್ಮ ಬಗ್ಗೆ", "ಕನ್ನಡನಾಡಿ", "ಅಪರಾಧ ಲೋಕ", "ರಾಜಕೀಯ",
  "ಶಿಕ್ಷಣ", "ವಿಶೇಷ ಲೇಖನಗಳು", "ಸಂದರ್ಶನಗಳು", "ಉದ್ಯೋಗ ಮಾಹಿತಿ", "ಫೋಟೊ ಗ್ಯಾಲರಿ",
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", url: "#" },
  { icon: Facebook, label: "Facebook", url: "#" },
  { icon: Youtube, label: "YouTube", url: "#" },
];

const Footer = () => {
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
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-3">ಸಂಪರ್ಕಿಸಿ</h3>
            <ul className="space-y-2 text-sm text-nav-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@publicprime.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 98765 43210</span>
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
