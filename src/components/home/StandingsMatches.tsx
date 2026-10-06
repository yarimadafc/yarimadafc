'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StandingsMatches() {
  const standings = [
    { pos: 1, team: 'Qarabağ', p: 6, w: 5, d: 0, l: 1, gf: 18, ga: 5, pts: 15 },
    { pos: 2, team: 'Sabah', p: 5, w: 5, d: 0, l: 0, gf: 14, ga: 1, pts: 15 },
    { pos: 3, team: 'Yarımada', p: 5, w: 4, d: 1, l: 0, gf: 9, ga: 4, pts: 13, highlight: true },
    { pos: 4, team: 'Turan Tovuz', p: 6, w: 3, d: 2, l: 1, gf: 6, ga: 4, pts: 11 },
    { pos: 5, team: 'Zirə', p: 6, w: 3, d: 1, l: 2, gf: 7, ga: 8, pts: 10 },
    { pos: 6, team: 'Şamaxı', p: 6, w: 2, d: 3, l: 1, gf: 8, ga: 6, pts: 9 },
  ];

  const matches = [
    { date: '23.08', time: '20:45', home: 'Yarımada', away: 'Araz-N.', score: '5 - 0', round: 'II', league: 'Premyer Liqa' },
    { date: '30.08', time: '20:15', home: 'Zirə', away: 'Yarımada', score: '1 - 0', round: 'III', league: 'Premyer Liqa' },
    { date: '05.09', time: '20:30', home: 'Yarımada', away: 'Şəfa', score: '4 - 1', round: 'IV', league: 'Premyer Liqa' },
    { date: '11.09', time: '16:30', home: 'İmişli', away: 'Yarımada', score: '2 - 3', round: 'V', league: 'Premyer Liqa' },
    { date: '18.09', time: '17:30', home: 'Qəbələ', away: 'Yarımada', score: '0 - 3', round: 'VI', league: 'Premyer Liqa' },
  ];

  return (
    <section className="bg-[#0d1a2d] py-20 border-b border-gray-800/50 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-12"
        >
          <div className="w-8 h-[2px] bg-[#d7bf7b] mb-6"></div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">Turnir cədvəli</h2>
          <Link href="/standings" className="text-white font-bold text-[13px] tracking-widest border-b-2 border-[#d7bf7b] pb-1 hover:text-[#d7bf7b] transition-colors uppercase">
            Bütün nəticələr
          </Link>
        </motion.div>

        {/* Növbəti Oyun (Mini Format) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12 bg-gradient-to-r from-[#112240] to-[#152741] p-4 rounded-xl border border-gray-800 shadow-xl flex flex-col sm:flex-row items-center justify-between"
        >
          <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
             <span className="text-[#d7bf7b] font-bold tracking-widest text-[10px] uppercase mb-1">Növbəti Oyun</span>
             <span className="text-gray-400 text-xs">15 Oktyabr 2026, 20:00 • Premyer Liqa</span>
          </div>
          <div className="flex items-center space-x-4">
             <span className="font-bold text-white uppercase text-sm">YARIMADA</span>
             <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">VS</div>
             <span className="font-bold text-white uppercase text-sm">NEFTÇİ</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center space-x-6 lg:space-x-12 mb-10 overflow-x-auto pb-4"
        >
          <button className="text-[#d7bf7b] font-bold text-sm tracking-widest uppercase whitespace-nowrap">Əsas Komanda</button>
          <button className="text-gray-400 hover:text-white transition-colors font-bold text-sm tracking-widest uppercase whitespace-nowrap">Yarımada-2</button>
          <button className="text-gray-400 hover:text-white transition-colors font-bold text-sm tracking-widest uppercase whitespace-nowrap">U-19</button>
          <button className="text-gray-400 hover:text-white transition-colors font-bold text-sm tracking-widest uppercase whitespace-nowrap">U-17</button>
          <button className="text-gray-400 hover:text-white transition-colors font-bold text-sm tracking-widest uppercase whitespace-nowrap">U-15</button>
        </motion.div>

        {/* Grid: Standings & Matches */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Table */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-[#152741] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-400 font-bold border-b border-gray-800 bg-[#0d1a2d]">
                  <tr>
                    <th className="px-6 py-4">№</th>
                    <th className="px-6 py-4">Komanda</th>
                    <th className="px-3 py-4 text-center">O</th>
                    <th className="px-3 py-4 text-center">Q</th>
                    <th className="px-3 py-4 text-center">B</th>
                    <th className="px-3 py-4 text-center">M</th>
                    <th className="px-3 py-4 text-center">VQ</th>
                    <th className="px-3 py-4 text-center">BQ</th>
                    <th className="px-6 py-4 text-center">Xal</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row) => (
                    <tr key={row.pos} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${row.highlight ? 'bg-gray-800/40 text-white font-bold' : 'text-gray-300'}`}>
                      <td className="px-6 py-4 font-medium">{row.pos}</td>
                      <td className="px-6 py-4">{row.team}</td>
                      <td className="px-3 py-4 text-center">{row.p}</td>
                      <td className="px-3 py-4 text-center">{row.w}</td>
                      <td className="px-3 py-4 text-center">{row.d}</td>
                      <td className="px-3 py-4 text-center">{row.l}</td>
                      <td className="px-3 py-4 text-center">{row.gf}</td>
                      <td className="px-3 py-4 text-center">{row.ga}</td>
                      <td className="px-6 py-4 text-center text-[#d7bf7b] font-bold">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Matches List */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-[#152741] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-400 font-bold border-b border-gray-800 bg-[#0d1a2d]">
                  <tr>
                    <th className="px-6 py-4">Tarix</th>
                    <th className="px-4 py-4">Saat</th>
                    <th className="px-6 py-4 text-center">Son/Növbəti oyunlar</th>
                    <th className="px-4 py-4 text-center">Tur</th>
                    <th className="px-6 py-4">Turnir</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors text-white font-medium">
                      <td className="px-6 py-4">{match.date}</td>
                      <td className="px-4 py-4 text-gray-400">{match.time}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-3 whitespace-nowrap">
                          <span className="w-24 text-right">{match.home}</span>
                          <div className="w-6 h-6 rounded-full bg-gray-800 flex-shrink-0"></div>
                          <span className="font-bold text-[#d7bf7b] w-12 text-center">{match.score}</span>
                          <div className="w-6 h-6 rounded-full bg-gray-800 flex-shrink-0"></div>
                          <span className="w-24 text-left">{match.away}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-400">{match.round}</td>
                      <td className="px-6 py-4 text-gray-400">{match.league}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
