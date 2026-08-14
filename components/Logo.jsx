const LOGO_URL = "/images/destino-08.png";

export default function Logo({ size = "md", showText = true, collapsed = false }) {
  const imgSizes = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  };

  if (collapsed) {
    return (
      <img src={LOGO_URL} alt="Elite Concierge" className={`${imgSizes[size]} object-contain opacity-90`} />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <img src={LOGO_URL} alt="Elite Concierge" className={`${imgSizes[size]} object-contain flex-shrink-0 opacity-90 blur-[0.3px]`} />
      {showText && (
        <div className="leading-none">
          <p className="font-display text-primary font-bold tracking-[0.14em] text-[10px] uppercase">Elite</p>
          <p className="font-display text-primary/70 font-semibold tracking-[0.2em] text-[8px] uppercase">Concierge</p>
        </div>
      )}
    </div>
  );
}