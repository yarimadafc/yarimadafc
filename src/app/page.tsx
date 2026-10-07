'use client';
import Link from "next/link";


import NewsSection from '@/components/home/NewsSection';
import MatchesAndStandings from '@/components/home/MatchesAndStandings';
import QuickLinks from '@/components/home/QuickLinks';
import VideoSection from '@/components/home/VideoSection';
import Achievements from '@/components/home/Achievements';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { calculateLiveMinute } from '@/lib/matchTimer';

const isTimePassed = (date: string, time: string) => {
  if (!date || !time) return false;
  return new Date(`${date}T${time}`) <= new Date();
};

export default function HomePage() {
  const [heroTexts, setHeroTexts] = useState<Record<string, string>>({
    hero_title_1: 'YENİ MÖVSÜM,',
    hero_title_2: 'YENİ HƏDƏFLƏR',
    hero_subtitle: 'Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!'
  });
  const [heroMatch, setHeroMatch] = useState<any>({ home: 'YARIMADA', away: 'RƏQİB', date: '', time: '', venue: '', league: 'Gənclər Liqası', home_logo: '', away_logo: '' });
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [heroBg, setHeroBg] = useState<string>('/placeholder-hero.jpg');

  useEffect(() => {
    async function loadHeroImage() {
      try {
        const { data } = await supabase.from('site_images').select('image_url').eq('section_key', 'hero_bg').single();
        if (data && data.image_url) {
          setHeroBg(data.image_url);
        }
      } catch (err) {
        console.error('No hero image found, using default');
      }
    }
    loadHeroImage();
    
    async function loadData() {
      const { data: texts } = await supabase.from('site_images').select('section_key, image_url').in('section_key', ['hero_title_1', 'hero_title_2', 'hero_subtitle']);
      if (texts) {
        const map: Record<string, string> = { hero_title_1: 'YENİ MÖVSÜM,', hero_title_2: 'YENİ HƏDƏFLƏR', hero_subtitle: 'Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!' };
        texts.forEach(t => { map[t.section_key] = t.image_url; });
        setHeroTexts(map);
      }
      const { data: hmData } = await supabase
        .from('matches')
        .select('*')
        .eq('is_hero', true)
        .neq('status', 'finished')
        .order('match_date', { ascending: true })
        .limit(1);

      if (hmData && hmData.length > 0) {
        const m = hmData[0];
        setHeroMatch({
          home: m.home_team || 'YARIMADA',
          away: m.away_team || 'RƏQİB',
          date: m.match_date || '',
          time: m.match_time || '',
          venue: m.stadium || '',
          league: m.tournament || 'Yoldaşlıq',
          home_logo: m.home_logo || '',
          away_logo: m.away_logo || '',
          status: m.status || 'upcoming',
          home_score: m.home_score,
          away_score: m.away_score,
          timer_status: m.timer_status || 'stopped',
          timer_started_at: m.timer_started_at || null,
          elapsed_seconds: m.elapsed_seconds || 0,
          half_1_duration: m.half_1_duration || 45,
          half_2_duration: m.half_2_duration || 45,
          extra_time_1: m.extra_time_1 || 0,
          extra_time_2: m.extra_time_2 || 0,
          yarimada_lineup: m.yarimada_lineup || []
        });
      }
    }
    loadData();

    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('az-AZ', { hour12: false }));
      
      // Custom date formatter
      const azMonths = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
      setDate(`${now.getDate()} ${azMonths[now.getMonth()]} ${now.getFullYear()}`);
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 1. Hero / Main Slider placeholder */}
        <section className="relative w-full min-h-screen lg:h-[850px] bg-[#152741] flex items-center justify-center border-b border-gray-800 overflow-hidden pt-28 lg:pt-0 pb-16 lg:pb-0">
          <motion.div 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBg})` }}
          ></motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a2d]/95 via-[#0d1a2d]/70 to-transparent lg:via-[#0d1a2d]/60"></div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full h-full flex items-center">
            <div className="flex flex-col lg:flex-row items-center w-full max-w-7xl mx-auto justify-between">
              
              {/* Sol Tərəf (Mətnlər) */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left z-10">
                 <motion.h1 
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8 }}
                   className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-4 drop-shadow-2xl"
                 >
                   YENİ MÖVSÜM, <br />
                   <span className="text-[#d7bf7b] relative">
                     YENİ ZƏFƏRLƏR
                     <span className="absolute bottom-1 lg:bottom-2 left-0 w-full h-2 bg-[#d7bf7b]/30 -z-10"></span>
                   </span>
                 </motion.h1>
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.8, delay: 0.2 }}
                   className="text-base lg:text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 font-medium"
                 >
                   Yarımada Futbol Klubu olaraq gələcəyin çempionlarını yetişdirir, hər bir oyunçumuzun inkişafı üçün peşəkar mühit yaradırıq. Bizimlə birgə zəfərə doğru addımla!
                 </motion.p>
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8, delay: 0.4 }}
                   className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-10 lg:mb-0"
                 >
                   <Link href="/academy" className="w-full sm:w-auto bg-[#d7bf7b] text-[#152741] px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(215,191,123,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
                     Akademiyaya Qoşul
                   </Link>
                   <Link href="/matches" className="w-full sm:w-auto bg-[#0a1423]/80 backdrop-blur-sm border border-gray-700 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:border-[#d7bf7b] hover:text-[#d7bf7b] transition-all duration-300">
                     Oyunlar Cədvəli
                   </Link>
                 </motion.div>
              </div>

              {/* Sağ Tərəf (Növbəti Oyun və ya Saat) */}
              <div className="w-full lg:w-1/3 flex items-center justify-center lg:justify-end z-10 mt-10 lg:mt-0 lg:pl-10 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#d7bf7b]/20 rounded-full blur-[100px] pointer-events-none"></div>
               
               {heroMatch ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="w-full max-w-sm relative group cursor-pointer"
               >
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d7bf7b] to-transparent rounded-3xl opacity-30 group-hover:opacity-50 transition duration-500 blur"></div>
                 
                 <div className="relative bg-[#112240] backdrop-blur-md rounded-2xl p-6 shadow-2xl overflow-hidden h-full z-10">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#d7bf7b]/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110"></div>
                     
                     <div className="flex justify-between items-center mb-6">
                       <span className="text-[#d7bf7b] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#d7bf7b]/10 rounded border border-[#d7bf7b]/20">
                         Növbəti Oyun
                       </span>
                       <span className="text-gray-400 text-[11px] font-medium tracking-wide">{heroMatch.league}</span>
                     </div>

                     <div className="flex items-center justify-between mb-8 relative">
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
                       
                       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-10px] z-20 flex flex-col items-center">
                         {heroMatch.status === 'live' ? (
                           <div className="flex flex-col items-center animate-pulse">
                             <div className="text-red-500 font-black text-[10px] tracking-widest uppercase mb-1">{calculateLiveMinute(heroMatch.timer_status, heroMatch.timer_started_at, heroMatch.elapsed_seconds, heroMatch.half_1_duration, heroMatch.half_2_duration, heroMatch.extra_time_1, heroMatch.extra_time_2)}</div>
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
                         ) : isTimePassed(heroMatch.date, heroMatch.time) ? (
                           <div className="flex flex-col items-center animate-pulse">
                             <span className="text-red-500 font-black text-[10px] tracking-widest uppercase mb-1 text-center bg-[#0a1423] border border-red-500/30 px-2 py-1 rounded-lg">OYUN BAŞLADI</span>
                           </div>
                         ) : (
                           <div className="w-8 h-8 rounded-full bg-[#0a1423] border border-gray-700 flex items-center justify-center shadow-lg">
                             <span className="text-[#d7bf7b] text-[10px] font-black italic">VS</span>
                           </div>
                         )}
                       </div>

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
                         <span className="text-white text-xs font-bold">{heroMatch.date && heroMatch.time ? `${heroMatch.date} • ${heroMatch.time}` : 'Məlumat Yoxdur'}</span>
                       </div>
                       <Link href="/matches" className="text-[#d7bf7b] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center group-hover:underline underline-offset-4">
                         Ətraflı &rarr;
                       </Link>
                     </div>
                 </div>

                 {heroMatch.yarimada_lineup && heroMatch.yarimada_lineup.length > 0 && (
                   <div className="mt-4 bg-[#152741] border border-gray-800 rounded-3xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm bg-opacity-95">
                     <h4 className="text-[#d7bf7b] font-bold uppercase tracking-widest text-[10px] text-center mb-3 border-b border-gray-800 pb-2">Yarımada FK - Heyət və Hadisələr</h4>
                     <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                       {heroMatch.yarimada_lineup.map((p: any, idx: number) => (
                         <div key={idx} className="flex items-center justify-between text-xs">
                           <div className="flex items-center space-x-2">
                             <span className="text-gray-500 font-black w-4">{p.number}</span>
                             <span className="text-white font-medium">{p.name}</span>
                             {!p.is_starting && <span className="text-[8px] bg-gray-800 text-gray-400 px-1 rounded uppercase">Ehtiyat</span>}
                           </div>
                           <div className="flex space-x-1">
                             {p.events?.includes('goal') && <span title="Qol">⚽</span>}
                             {p.events?.includes('yellow_card') && <span title="Sarı Vərəqə">🟨</span>}
                             {p.events?.includes('red_card') && <span title="Qırmızı Vərəqə">🟥</span>}
                             {p.events?.includes('injury') && <span title="Zədə">🩹</span>}
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </motion.div>
               ) : (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.8, delay: 0.2 }}
                   className="w-full max-w-sm relative group cursor-pointer"
                 >
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d7bf7b] to-transparent rounded-3xl opacity-30 blur"></div>
                   <div className="relative bg-[#112240] backdrop-blur-md rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center h-64 z-10">
                      <div className="text-[#d7bf7b] text-4xl mb-4">⚽</div>
                      <h3 className="text-white font-bold uppercase tracking-widest mb-2">Təqvim Boşdur</h3>
                      <p className="text-gray-500 text-xs">Hazırda təyin olunmuş heç bir oyun yoxdur.</p>
                   </div>
                 </motion.div>
               )}
             </div>
            </div>
          </div>
        </section>

        {/* 2. Sürətli Keçidlər (4-lü Grid) */}
        <QuickLinks />

        {/* 3. Turnir cədvəli & Növbəti oyunlar */}
        <MatchesAndStandings />

        {/* 4. Xəbərlər (News) */}
        <NewsSection />

        {/* 4.5 Oyunlar Təqvimi */}
        
        {/* 5. Yarımada TV */}
        <VideoSection />

        {/* 6. Nailiyyətlər */}
        <Achievements />

      </motion.div>
    </AnimatePresence>
  );
}
