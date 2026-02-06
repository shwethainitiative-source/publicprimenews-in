import { useMemo } from "react";

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
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-wide">
            ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್
          </h1>
          <p className="text-xs text-muted-foreground tracking-widest">
            ಸತ್ಯದ ಧ್ವನಿ • ಜನರ ಪರ
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
