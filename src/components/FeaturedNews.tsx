import podcastBanner from "@/assets/podcast-banner.jpg";

const FeaturedNews = () => {
  return (
    <div className="relative rounded-lg overflow-hidden group cursor-pointer">
      {/* LIVE badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-accent/80 px-3 py-1 rounded text-accent-foreground text-xs font-bold">
        LIVE
        <span className="w-2 h-2 rounded-full bg-live animate-live-pulse" />
      </div>

      {/* Podcast label */}
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center gap-1.5">
          <span className="bg-primary rounded-full w-5 h-5 flex items-center justify-center text-primary-foreground text-[10px] font-bold">P</span>
          <span className="text-primary-foreground text-xs font-bold bg-accent/60 px-2 py-0.5 rounded">
            PODCAST <span className="text-primary-foreground/70">EPISODE #64</span>
          </span>
        </div>
      </div>

      <img
        src={podcastBanner}
        alt="Featured podcast episode"
        className="w-full h-[350px] md:h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/40 to-transparent" />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h2 className="text-accent-foreground text-2xl md:text-3xl font-extrabold leading-tight mb-2">
          THE STORY COULD<br />CHANGE YOUR LIFE
        </h2>
        <p className="text-accent-foreground/80 text-sm">
          You must listen to this podcast
        </p>
      </div>
    </div>
  );
};

export default FeaturedNews;
