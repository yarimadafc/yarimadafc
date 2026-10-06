'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TeamsPage() {
  const teams = [
    { id: 'u-12', name: 'U-12', coach: 'Elnur Cəlilov', playersCount: 22, league: 'AFFA U-12 Premyer Liqa' },
    { id: 'u-11', name: 'U-11', coach: 'Ramil Həsənov', playersCount: 18, league: 'AFFA U-11 Liqa' },
    { id: 'u-10', name: 'U-10', coach: 'Cavid Quliyev', playersCount: 20, league: 'AFFA U-10 Liqa' },
    { id: 'u-9', name: 'U-9', coach: 'Emin Kərimov', playersCount: 16, league: 'Gənclər Liqası' },
  ];

  return (
    <div className="pt-24 min-h-screen bg-[#0a1423] pb-20">
      
      {/* Header */}
      <div className="w-full bg-[#152741] py-16 md:py-24 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
          >
            Yarımada <span className="text-[#d7bf7b]">Komandaları</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#d7bf7b] mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Klubumuzun bütün yaş qrupları üzrə komandaları və onların liqalardakı iştirakı ilə yaxından tanış olun. Gələcəyin ulduzları məhz burada formalaşır.
          </p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="container mx-auto px-4 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {teams.map((team, i) => (
            <motion.div 
              key={team.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={`/teams/${team.id}`} className="block group">
                <div className="bg-[#152741] border border-gray-800 rounded-3xl p-8 hover:border-[#d7bf7b]/50 transition-all duration-300 shadow-xl hover:shadow-[#d7bf7b]/5 relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d7bf7b]/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125"></div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{team.name}</h2>
                      <div className="w-12 h-12 rounded-full border-2 border-[#d7bf7b] p-1 flex items-center justify-center">
                        <div className="w-full h-full bg-[#0a1423] rounded-full flex items-center justify-center relative overflow-hidden">
                          <img src="/Logo.JPG.jpeg" alt="Yarımada FK" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col border-b border-gray-800 pb-3">
                        <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Turnir / Liqa</span>
                        <span className="text-white text-sm font-medium">{team.league}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Baş Məşqçi</span>
                          <span className="text-white text-sm font-medium">{team.coach}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Oyunçu Sayı</span>
                          <span className="text-[#d7bf7b] text-lg font-black">{team.playersCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between w-full">
                    <span className="text-[#d7bf7b] text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                      Komanda Haqqında
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#0a1423] border border-gray-700 flex items-center justify-center group-hover:bg-[#d7bf7b] group-hover:border-[#d7bf7b] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-hover:text-[#152741] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
