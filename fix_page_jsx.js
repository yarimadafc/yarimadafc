const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// The messed up part starts around <div className="bg-[#152741] border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm bg-opacity-95">
// and ends with </section> for the hero.
// I will replace the entire hero section content just to be absolutely sure.

content = content.replace(
  /<div className="w-full lg:w-1\/3 flex items-center justify-center lg:justify-end z-10 mt-10 lg:mt-0 lg:pl-10 relative">[\s\S]*?<\/section>/,
  `<div className="w-full lg:w-1/3 flex items-center justify-center lg:justify-end z-10 mt-10 lg:mt-0 lg:pl-10 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#d7bf7b]/20 rounded-full blur-[100px] pointer-events-none"></div>
               
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="w-full max-w-sm relative group cursor-pointer"
               >
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d7bf7b] to-transparent rounded-3xl opacity-30 group-hover:opacity-50 transition duration-500 blur"></div>
                 
                 <div className="bg-[#152741] border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm bg-opacity-95">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d7bf7b] to-transparent opacity-50"></div>
                     
                     <div className="flex justify-between items-center mb-6">
                       <span className="text-[#d7bf7b] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#d7bf7b]/10 rounded border border-[#d7bf7b]/20">
                         Növbəti Oyun
                       </span>
                       <span className="text-gray-400 text-[11px] font-medium tracking-wide">{heroMatch.league}</span>
                     </div>

                     <div className="flex items-center justify-between mb-8 relative">
                       {/* Team 1 */}
                       <div className="flex flex-col items-center space-y-3 w-[35%] z-10">
                         <div className="w-14 h-14 rounded-full border border-gray-700 bg-[#0d1a2d] flex items-center justify-center p-1 shadow-inner overflow-hidden">
                           {heroMatch.home_logo ? (
                             <img src={heroMatch.home_logo} alt={heroMatch.home} className="w-full h-full object-contain bg-white rounded-full p-1" />
                           ) : heroMatch.home?.includes('Yarımada') ? (
                             <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                           ) : (
                             <div className="w-full h-full bg-gray-600 rounded-full"></div>
                           )}
                         </div>
                         <span className="font-black text-white tracking-widest text-[10px] uppercase text-center line-clamp-2">{heroMatch.home}</span>
                       </div>
                       
                       {/* VS or Score */}
                       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-10px] z-20 flex flex-col items-center">
                         {heroMatch.status === 'live' ? (
                           <div className="flex flex-col items-center animate-pulse">
                             <div className="text-red-500 font-black text-[10px] tracking-widest uppercase mb-1">{heroMatch.live_minute || "CANLI"} {heroMatch.added_time ? \`\${heroMatch.added_time}\` : ''}</div>
                             <div className="flex items-center space-x-2 bg-[#0a1423] border border-gray-700 px-3 py-1 rounded-lg">
                               <span className="text-white font-black text-xl">{heroMatch.home_score !== null ? heroMatch.home_score : '-'}</span>
                               <span className="text-gray-500 font-bold">:</span>
                               <span className="text-white font-black text-xl">{heroMatch.away_score !== null ? heroMatch.away_score : '-'}</span>
                             </div>
                           </div>
                         ) : heroMatch.status === 'finished' ? (
                           <div className="flex flex-col items-center">
                             <div className="text-gray-500 font-black text-[10px] tracking-widest uppercase mb-1">NƏTİCƏ</div>
                             <div className="flex items-center space-x-2 bg-[#0a1423] border border-gray-700 px-3 py-1 rounded-lg">
                               <span className="text-white font-black text-xl">{heroMatch.home_score !== null ? heroMatch.home_score : '-'}</span>
                               <span className="text-gray-500 font-bold">:</span>
                               <span className="text-white font-black text-xl">{heroMatch.away_score !== null ? heroMatch.away_score : '-'}</span>
                             </div>
                           </div>
                         ) : (
                           <div className="w-8 h-8 rounded-full bg-[#0a1423] border border-gray-700 flex items-center justify-center shadow-lg">
                             <span className="text-[#d7bf7b] text-[10px] font-black italic">VS</span>
                           </div>
                         )}
                       </div>

                       {/* Team 2 */}
                       <div className="flex flex-col items-center space-y-3 w-[35%] z-10">
                         <div className="w-14 h-14 rounded-full border border-gray-700 bg-[#0d1a2d] flex items-center justify-center p-1 shadow-inner overflow-hidden">
                           {heroMatch.away_logo ? (
                             <img src={heroMatch.away_logo} alt={heroMatch.away} className="w-full h-full object-contain bg-white rounded-full p-1" />
                           ) : heroMatch.away?.includes('Yarımada') ? (
                             <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                           ) : (
                             <div className="w-full h-full bg-gray-600 rounded-full"></div>
                           )}
                         </div>
                         <span className="font-black text-white tracking-widest text-[10px] uppercase text-center line-clamp-2">{heroMatch.away}</span>
                       </div>
                     </div>

                     <div className="w-full bg-[#0a1423] rounded-lg p-3 flex justify-between items-center border border-gray-800">
                       <div className="flex flex-col">
                         <span className="text-gray-500 text-[10px] uppercase tracking-widest mb-0.5">Tarix / Saat</span>
                         <span className="text-white text-xs font-bold">{heroMatch.date && heroMatch.time ? \`\${heroMatch.date} • \${heroMatch.time}\` : 'Məlumat Yoxdur'}</span>
                       </div>
                       <Link href="/matches" className="text-[#d7bf7b] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center group-hover:underline underline-offset-4">
                         Ətraflı &rarr;
                       </Link>
                     </div>
                 </div>
               </motion.div>
             </div>
          </div>
        </section>`
);

fs.writeFileSync('src/app/page.tsx', content);
