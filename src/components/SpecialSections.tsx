const firstRow = [
  { id: "1", title: "VOICE OF PUBLIC", titleKn: "ಜನರ ಧ್ವನಿ" },
  { id: "2", title: "360° EYE ON CORRUPTION", titleKn: "ಭ್ರಷ್ಟಾಚಾರದ ಮೇಲೆ ಕಣ್ಣು" },
  { id: "3", title: "SPECIAL FEATURE", titleKn: "ವಿಶೇಷ ವರದಿ" },
];

const secondRow = [
  { id: "4", title: "VOICE OF PUBLIC", titleKn: "ಜನರ ಧ್ವನಿ", color: "bg-red-700" },
  { id: "5", title: "360° EYE", titleKn: "360° ಕಣ್ಣು", color: "bg-red-800" },
  { id: "6", title: "PHOTO GALLERY", titleKn: "ಫೋಟೊ ಗ್ಯಾಲರಿ", color: "bg-blue-900" },
  { id: "7", title: "VIDEO GALLERY", titleKn: "ವೀಡಿಯೊ ಗ್ಯಾಲರಿ", color: "bg-blue-800" },
];

const SpecialSections = () => {
  return (
    <section className="container mx-auto px-4 py-6">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-lg font-extrabold whitespace-nowrap uppercase tracking-wide">
          Our Districts
        </h2>
        <div className="flex-1 h-0.5 bg-primary" />
      </div>

      {/* First Row - 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {firstRow.map((item) => (
          <div
            key={item.id}
            className="relative rounded-lg overflow-hidden cursor-pointer group h-[180px]"
          >
            <img
              src="/placeholder.svg"
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-accent-foreground text-lg font-extrabold leading-tight">
                {item.title}
              </h3>
              <p className="text-accent-foreground/70 text-xs mt-1">{item.titleKn}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row - 4 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondRow.map((item) => (
          <div
            key={item.id}
            className="relative rounded-lg overflow-hidden cursor-pointer group h-[100px]"
          >
            <img
              src="/placeholder.svg"
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className={`absolute inset-0 ${item.color}/70`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-extrabold tracking-wide text-center px-2">
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialSections;
