const breakingItems = [
  "ಕರ್ನಾಟಕ ಬಜೆಟ್ 2026: ಪ್ರಮುಖ ಘೋಷಣೆಗಳು ಬಿಡುಗಡೆ",
  "ಉಡುಪಿ ಜಿಲ್ಲೆಯಲ್ಲಿ ಭಾರೀ ಮಳೆ ಎಚ್ಚರಿಕೆ",
  "ರಾಜ್ಯ ಸರ್ಕಾರದ ಹೊಸ ಯೋಜನೆ ಪ್ರಕಟ",
  "ಕನ್ನಡ ಚಿತ್ರರಂಗದ ನಟರಿಗೆ ರಾಷ್ಟ್ರ ಪ್ರಶಸ್ತಿ",
  "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಮೆಟ್ರೋ ವಿಸ್ತರಣೆ ಕಾಮಗಾರಿ ಆರಂಭ",
];

const BreakingNewsTicker = () => {
  const repeatedItems = [...breakingItems, ...breakingItems];

  return (
    <div className="bg-ticker text-ticker-foreground flex items-center overflow-hidden">
      <div className="bg-primary px-4 py-2 font-bold text-sm whitespace-nowrap shrink-0 z-10">
        Breaking News
      </div>
      <div className="overflow-hidden flex-1">
        <div className="animate-ticker flex whitespace-nowrap">
          {repeatedItems.map((item, i) => (
            <span key={i} className="px-8 py-2 text-sm inline-block">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;
