"use client";

const tickerItems = [
  "MARKETING STRATEGICALLY DESIGNED TO SELL",
  "PHOENIX, AZ · EST. 2004",
  "1,500+ BUILDS DELIVERED",
  "ONE SUBSCRIPTION",
  "100% ASSET OWNERSHIP",
  "RELAUNCH SOCIAL — AUTOPILOT",
  "AI AUTOMATION & WORKFLOWS",
  "WEB & APP DEVELOPMENT",
  "BRAND STRATEGY & IDENTITY",
  "LOCAL SEO & ADVERTISING",
  "VIDEO & CONTENT PRODUCTION",
  "EMAIL MARKETING ENGINES",
];

export default function TickerBar() {
  return (
    <div className="w-full bg-[#2E8B7A] text-white overflow-hidden py-2 select-none border-b border-[#257567] z-50 relative">
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
        {/* First track */}
        <div className="flex items-center space-x-6 sm:space-x-8 px-4 shrink-0">
          {tickerItems.map((item, idx) => (
            <div key={`track1-${idx}`} className="flex items-center space-x-6 sm:space-x-8">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap opacity-95">
                {item}
              </span>
              <span className="text-[#3AAB97] opacity-60 text-xs">✦</span>
            </div>
          ))}
        </div>

        {/* Second track for seamless infinite scroll */}
        <div className="flex items-center space-x-6 sm:space-x-8 px-4 shrink-0" aria-hidden="true">
          {tickerItems.map((item, idx) => (
            <div key={`track2-${idx}`} className="flex items-center space-x-6 sm:space-x-8">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap opacity-95">
                {item}
              </span>
              <span className="text-[#3AAB97] opacity-60 text-xs">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
