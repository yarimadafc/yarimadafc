'use client';

import React, { useEffect, useState } from 'react';

export default function AnalogClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Baku" })));
    const interval = setInterval(() => {
      setTime(new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Baku" })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="w-full h-40 md:h-56 rounded-2xl bg-[#f8fafc] animate-pulse border border-[#e2e8f0]"></div>;

  const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
  const dayNames = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10 w-full h-full bg-[white] border border-[#e2e8f0] rounded-3xl shadow-2xl relative overflow-hidden group">
      {/* Glow background effect */}
      <div className="absolute inset-0 bg-[rgba(215, 191, 123, 0.2)] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 ease-out blur-3xl"></div>
      
      {/* Digital Time Display */}
      <div className="relative z-10 flex items-baseline justify-center mb-6 text-[var(--ks-ink)] font-mono drop-shadow-lg">
        <span className="text-6xl md:text-8xl font-black tracking-tighter">
          {time.getHours().toString().padStart(2, '0')}
        </span>
        <span className="text-5xl md:text-7xl mx-1 md:mx-2 animate-pulse text-[var(--ks-kinpaku)]">:</span>
        <span className="text-6xl md:text-8xl font-black tracking-tighter">
          {time.getMinutes().toString().padStart(2, '0')}
        </span>
        <div className="flex flex-col items-start ml-3">
          <span className="text-2xl md:text-3xl font-bold text-[var(--ks-kinpaku-deep)]">
            {time.getSeconds().toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-[rgb(156 163 175)] mt-1">Bakı</span>
        </div>
      </div>

      {/* Calendar info */}
      <div className="text-center relative z-10">
        <h3 className="text-xl md:text-2xl font-black text-[var(--ks-ink)] uppercase tracking-wider mb-1">
          {time.getDate()} {monthNames[time.getMonth()]}
        </h3>
        <p className="text-sm md:text-base text-[var(--ks-kinpaku)] font-bold tracking-widest uppercase">
          {dayNames[time.getDay()]}
        </p>
      </div>
    </div>
  );
}
