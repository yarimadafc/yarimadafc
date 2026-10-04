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

  if (!time) return <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gray-100 animate-pulse border-4 border-[var(--ks-ink)]"></div>;

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDegrees = ((seconds / 60) * 360) + 90;
  const minuteDegrees = ((minutes / 60) * 360) + ((seconds/60)*6) + 90;
  const hourDegrees = ((hours / 12) * 360) + ((minutes/60)*30) + 90;

  const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
  const dayNames = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 w-full h-full">
      {/* Clock Face */}
      <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-4 md:border-8 border-[var(--ks-ink)] bg-white flex items-center justify-center mb-6 md:mb-8">
        <div className="absolute w-3 h-3 bg-[var(--ks-kinpaku)] rounded-full z-20"></div>
        
        {/* Numbers 1-12 */}
        {[...Array(12)].map((_, i) => {
          const num = i === 0 ? 12 : i;
          return (
            <div 
              key={i} 
              className="absolute w-full h-full flex justify-center"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div 
                className="text-[var(--ks-ink)] font-black text-xs md:text-sm pt-1 md:pt-2"
                style={{ transform: `rotate(${-i * 30}deg)` }}
              >
                {num}
              </div>
            </div>
          )
        })}

        {/* Hour Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-[25%] h-1.5 md:h-2 bg-[var(--ks-ink)] rounded-full origin-[0%_50%] transition-transform duration-200"
          style={{ transform: `translate(0, -50%) rotate(${hourDegrees - 90}deg)` }}
        ></div>
        
        {/* Minute Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-[35%] h-1 bg-gray-600 rounded-full origin-[0%_50%] transition-transform duration-200"
          style={{ transform: `translate(0, -50%) rotate(${minuteDegrees - 90}deg)` }}
        ></div>
        
        {/* Second Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-[40%] h-0.5 bg-[var(--ks-kinpaku)] rounded-full origin-[0%_50%] transition-transform duration-75 ease-out z-10"
          style={{ transform: `translate(0, -50%) rotate(${secondDegrees - 90}deg)` }}
        ></div>
      </div>

      {/* Calendar info */}
      <div className="text-center">
        <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-1">Bakı vaxtı</p>
        <h3 className="text-2xl md:text-4xl font-black text-[var(--ks-ink)] mb-1 md:mb-2">
          {time.getDate()} {monthNames[time.getMonth()]}
        </h3>
        <p className="text-base md:text-lg text-[var(--ks-kinpaku)] font-bold">
          {dayNames[time.getDay()]}
        </p>
      </div>
    </div>
  );
}
