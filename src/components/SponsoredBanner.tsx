import sponsoredBanner from "@/assets/sponsored-banner.jpg";

const SponsoredBanner = () => {
  return (
    <div className="relative">
      <div className="absolute top-2 left-2 bg-sponsored text-sponsored-foreground text-xs font-bold px-3 py-1 rounded z-10">
        Sponsored
      </div>
      <img
        src={sponsoredBanner}
        alt="Sponsored advertisement"
        className="w-full h-auto max-h-24 object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default SponsoredBanner;
