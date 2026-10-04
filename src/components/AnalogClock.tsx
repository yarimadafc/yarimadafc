'use client';

import React, { useEffect, useState } from 'react';

export default function AnalogClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Initial set
    setTime(new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Baku" })));
    
    const interval = setInterval(() => {
      setTime(new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Baku" })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="w-48 h-48 rounded-full bg-gray-100 animate-pulse border-4 border-gray-200"></div>;

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDegrees = ((seconds / 60) * 360) + 90;
  const minuteDegrees = ((minutes / 60) * 360) + ((seconds/60)*6) + 90;
  const hourDegrees = ((hours / 12) * 360) + ((minutes/60)*30) + 90;

  const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
  const dayNames = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-[var(--ks-ink)]/5 w-full h-full">
      {/* Clock Face */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-8 border-[var(--ks-ink)] bg-white shadow-inner flex items-center justify-center mb-8">
        <div className="absolute w-3 h-3 bg-[var(--ks-kinpaku)] rounded-full z-20"></div>
        
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={`mx-auto bg-gray-300 ${i % 3 === 0 ? 'w-1.5 h-4 bg-[var(--ks-ink)]' : 'w-1 h-2'} mt-1`}></div>
          </div>
        ))}

        {/* Hour Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-[30%] h-1.5 bg-[var(--ks-ink)] rounded-full origin-[0%_50%] transition-transform duration-200"
          style={{ transform: `translate(0, -50%) rotate(${hourDegrees - 90}deg)` }}
        ></div>
        
        {/* Minute Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-[40%] h-1 bg-gray-600 rounded-full origin-[0%_50%] transition-transform duration-200"
          style={{ transform: `translate(0, -50%) rotate(${minuteDegrees - 90}deg)` }}
        ></div>
        
        {/* Second Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-[45%] h-0.5 bg-[var(--ks-kinpaku)] rounded-full origin-[0%_50%] transition-transform duration-75 ease-out z-10"
          style={{ transform: `translate(0, -50%) rotate(${secondDegrees - 90}deg)` }}
        ></div>
      </div>

      {/* Calendar info */}
      <div className="text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-gray-400 mb-1">Bakı vaxtı</p>
        <h3 className="text-4xl font-black text-[var(--ks-ink)] mb-2">
          {time.getDate()} {monthNames[time.getMonth()]}
        </h3>
        <p className="text-lg text-[var(--ks-kinpaku)] font-bold">
          {dayNames[time.getDay()]}
        </p>
      </div>
    </div>
  );
}
