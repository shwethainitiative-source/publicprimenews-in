import { Youtube, Facebook, Instagram } from "lucide-react";
import NavigationBar from "@/components/NavigationBar";
import HeaderBar from "@/components/HeaderBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const commitments = [
  { title: "ರೈತ ಮತ್ತು ಪ್ರಕೃತಿ", desc: "ರೈತನ ಬೆವರು ಮತ್ತು ಪ್ರಕೃತಿಯ ಉಸಿರಿಗೆ ಧ್ವನಿಯಾಗುವುದು." },
  { title: "ನಿರ್ಭೀತ ವರದಿಗಾರಿಕೆ", desc: "ಭ್ರಷ್ಟಾಚಾರದ ವಿರುದ್ಧ ಸಮರ ಸಾರುತ್ತಾ, ಸಮಾಜದಲ್ಲಿ ಶಾಂತಿ ಮತ್ತು ಸಮಾನತೆಗಾಗಿ ಶ್ರಮಿಸುವುದು." },
  { title: "ಸಮಗ್ರ ಮಾಹಿತಿ", desc: "ಹಳ್ಳಿಯಿಂದ ದಿಲ್ಲಿಯವರೆಗೆ – ರಾಜಕೀಯ, ಅಪರಾಧ, ಶಿಕ್ಷಣ, ಉದ್ಯೋಗ ಮತ್ತು ವಿಶೇಷ ಸಂದರ್ಶನಗಳ ಸಂಪೂರ್ಣ ಪ್ಯಾಕೇಜ್." },
  { title: "ನೊಂದವರ ಧ್ವನಿ", desc: "ಸಂವಿಧಾನದ ನಾಲ್ಕನೇ ಅಂಗವಾಗಿ, ಸವಾಲುಗಳನ್ನು ಬೆನ್ನಟ್ಟಿ ನೊಂದವರಿಗೆ ನ್ಯಾಯ ಕೊಡಿಸುವ ಡಿಜಿಟಲ್ ಮಾಧ್ಯಮದ ಹೊಸ ಮುನ್ನುಡಿ." },
];

const socialLinks = [
  { icon: Youtube, label: "YouTube", url: "https://youtube.com", color: "hover:text-red-600" },
  { icon: Facebook, label: "Facebook", url: "https://facebook.com", color: "hover:text-blue-600" },
  { icon: Instagram, label: "Instagram", url: "https://instagram.com", color: "hover:text-pink-500" },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      <NavigationBar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8 border-b-4 border-primary pb-3">
          ನಮ್ಮ ಬಗ್ಗೆ (About Us)
        </h1>

        {/* Intro paragraphs */}
        <div className="space-y-5 text-foreground/90 leading-relaxed text-base md:text-lg">
          <p>
            ಕರಾವಳಿಯ ಕಡಲ ತೀರದ ಸಾಂಸ್ಕೃತಿಕ ವೈಭವದಿಂದ, ಸಿಲಿಕಾನ್ ಸಿಟಿಯ ಆಧುನಿಕತೆಯವರೆಗೆ – ಸಮಸ್ತ ಕನ್ನಡಿಗರ ನಾಡಿಮಿಡಿತವೇ ನಿಮ್ಮ 'ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್ ನ್ಯೂಸ್'.
          </p>
          <p>
            ನಾವು ಕೇವಲ ಸುದ್ದಿಯನ್ನು ನೀಡುವವರಲ್ಲ; ಈ ಮಣ್ಣಿನ ಕಲೆ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಬದುಕಿನ ನೈಜತೆಯನ್ನು ಜಗತ್ತಿಗೆ ಸಾರುವ ಕನ್ನಡಿ. ಹತ್ತು ವರ್ಷಗಳ ಸುಧೀರ್ಘ ಪತ್ರಿಕೋದ್ಯಮದ ಅನುಭವದೊಂದಿಗೆ, ಸ್ವತಂತ್ರ ಪತ್ರಿಕೋದ್ಯಮಕ್ಕೆ ಹೊಸ ಭಾಷ್ಯ ಬರೆಯಲು ನಾವು ಸನ್ನದ್ಧರಾಗಿದ್ದೇವೆ.
          </p>
        </div>

        {/* Commitments */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">ನಮ್ಮ ಬದ್ಧತೆ:</h2>
          <ul className="space-y-4">
            {commitments.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
                <p className="text-foreground/90 text-base md:text-lg leading-relaxed">
                  <strong>{item.title}:</strong> {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Closing paragraph */}
        <p className="mt-8 text-foreground/90 text-base md:text-lg leading-relaxed">
          ಹೊಸ ಕ್ರಾಂತಿಯೊಂದಿಗೆ, ಸಮಾಜದ ಹಿತದೃಷ್ಟಿಯಿಂದ ನಾವು ನಿಮ್ಮ ಮುಂದೆ ಬರುತ್ತಿದ್ದೇವೆ. ನಮ್ಮ ಈ ಪಯಣಕ್ಕೆ ನೀವೂ ಜೊತೆಯಾಗಿ.
        </p>

        {/* Social Media */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">ನಾವು ಲಭ್ಯವಿರುವ ವೇದಿಕೆಗಳು:</h2>
          <div className="flex gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`w-14 h-14 rounded-full bg-muted flex items-center justify-center text-foreground/70 transition-colors ${social.color}`}
              >
                <social.icon className="w-7 h-7" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-10 space-y-2 text-foreground/90 text-base md:text-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಹಾಗೂ ಜಾಹೀರಾತು ನೀಡಲು ಸಂಪರ್ಕಿಸಿ:
          </h2>
          <p><strong>ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್ ನ್ಯೂಸ್ ದೂರವಾಣಿ:</strong> 8105311125 , 9019035870</p>
          <p><strong>ಇಮೇಲ್:</strong> publicprimeofficial@gmail.com</p>
        </div>

        {/* WhatsApp Button */}
        <div className="mt-8 mb-4">
          <a
            href="https://chat.whatsapp.com/YOUR_GROUP_LINK"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-base px-8 py-3 rounded-full gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Join Our WhatsApp Group
            </Button>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
