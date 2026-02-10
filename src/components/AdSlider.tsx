import { useState, useEffect, useCallback } from "react";

const adImages = [
  { src: "/placeholder.svg", alt: "Advertisement 1" },
  { src: "/placeholder.svg", alt: "Advertisement 2" },
  { src: "/placeholder.svg", alt: "Advertisement 3" },
  { src: "/placeholder.svg", alt: "Advertisement 4" },
  { src: "/placeholder.svg", alt: "Advertisement 5" },
];

const AdSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % adImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="w-full rounded-lg border bg-card overflow-hidden">
      <div className="bg-primary text-primary-foreground text-center text-sm font-bold py-2">
        ಜಾಹೀರಾತು (Advertisement)
      </div>
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        {adImages.map((ad, i) => (
          <img
            key={i}
            src={ad.src}
            alt={ad.alt}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

export default AdSlider;
