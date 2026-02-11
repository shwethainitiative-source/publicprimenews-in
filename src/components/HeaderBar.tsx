import { useMemo } from "react";
import logoImage from "@/assets/primenews-logo.jpeg";

const HeaderBar = () => {
  const today = useMemo(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    const day = days[now.getDay()];
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${day}, ${dd}-${mm}-${yyyy}`;
  }, []);

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Date */}
        <div className="border border-border px-3 py-1.5 text-sm font-medium text-foreground rounded">
          {today}
        </div>

        {/* Logo */}
        <div className="text-center flex flex-col items-center">
          <img
            src={logoImage}
            alt="Public Prime News"
            className="h-12 md:h-16 w-auto object-contain"
          />
          <p className="text-[10px] md:text-xs text-muted-foreground tracking-[0.2em] mt-1 font-medium">
            Clear Vision, True Mission
          </p>
        </div>

        {/* Login */}
        <button className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
          Login
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;
