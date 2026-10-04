import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// --- MOCK DATA FALLBACKS ---
const MOCK_NEXT_MATCH = {
  id: '1',
  home_team: 'Yarımada FK',
  away_team: 'Qarabağ FK',
  date: '2026-10-15',
  time: '19:00',
  stadium: 'Zirə İdman Kompleksi',
  status: 'upcoming'
};

const MOCK_LAST_RESULT = {
  id: '2',
  home_team: 'Yarımada FK',
  away_team: 'Neftçi PFK',
  home_score: 3,
  away_score: 1,
  date: '2026-10-08',
  status: 'completed'
};

const MOCK_NEWS = [
  { id: '1', title: 'YENİ MÖVSÜMƏ HAZIRLIQ BAŞLADI', excerpt: 'Komandamız yeni mövsüm hazırlıqlarına start verdi...', published_at: '2026-10-01' },
  { id: '2', title: 'AKADEMİYA SEÇİMLƏRİ DAVAM EDİR', excerpt: 'Gənc istedadların axtarışı üçün növbəti seçim turu keçiriləcək.', published_at: '2026-09-28' },
  { id: '3', title: 'YENİ TRANSFERİMİZ', excerpt: 'Komandamıza yeni hücumçu qatıldı.', published_at: '2026-09-25' },
];

const MOCK_TEAMS = [
  { id: '1', name: 'U-12', age_group: '12' },
  { id: '2', name: 'U-11', age_group: '11' },
  { id: '3', name: 'U-10', age_group: '10' },
  { id: '4', name: 'U-9', age_group: '9' },
];

const MOCK_VIDEOS = [
  { id: '1', title: 'Maçın İcmalı: Yarımada FK 3 - 1 Neftçi', url: '#' },
  { id: '2', title: 'Məşq Prosesi - 2026', url: '#' },
  { id: '3', title: 'Baş Məşqçinin Müsahibəsi', url: '#' },
];

const MOCK_SPONSORS = [
  { id: '1', name: 'Sponsor 1' },
  { id: '2', name: 'Sponsor 2' },
  { id: '3', name: 'Sponsor 3' },
  { id: '4', name: 'Sponsor 4' },
];

export default async function HomePage() {
  // --- FETCH DATA ---
  let nextMatch = MOCK_NEXT_MATCH;
  let lastResult = MOCK_LAST_RESULT;
  let news = MOCK_NEWS;
  let teams = MOCK_TEAMS;
  let videos = MOCK_VIDEOS;
  let sponsors = MOCK_SPONSORS;

  try {
    const { data: nm } = await supabase.from('matches').select('*').eq('status', 'upcoming').order('date', { ascending: true }).limit(1).single();
    if (nm) nextMatch = nm;
  } catch (e) { /* ignore */ }

  try {
    const { data: lr } = await supabase.from('matches').select('*').eq('status', 'completed').order('date', { ascending: false }).limit(1).single();
    if (lr) lastResult = lr;
  } catch (e) { /* ignore */ }

  try {
    const { data: n } = await supabase.from('news').select('*').eq('published', true).order('published_at', { ascending: false }).limit(3);
    if (n && n.length) news = n;
  } catch (e) { /* ignore */ }

  try {
    const { data: t } = await supabase.from('teams').select('*').order('name');
    if (t && t.length) teams = t;
  } catch (e) { /* ignore */ }

  try {
    const { data: v } = await supabase.from('media_videos').select('*').limit(3);
    if (v && v.length) videos = v;
  } catch (e) { /* ignore */ }

  try {
    const { data: s } = await supabase.from('sponsors').select('*');
    if (s && s.length) sponsors = s;
  } catch (e) { /* ignore */ }

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[600px] bg-[#0a1628] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 mt-16">
          <span className="text-[#00e5a0] font-mono uppercase tracking-widest text-sm md:text-base font-bold">
            2026/27 MÖVSÜM
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-white tracking-wider leading-tight">
            BU YARIMADA FK.
          </h1>
          <p className="text-gray-300 max-w-2xl text-lg md:text-xl">
            Gələcəyin çempionlarını yetişdirən klub. İnamla, əzmlə və peşəkarlıqla irəli!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/akademiya" className="bg-[#00e5a0] text-[#0a1628] font-bold px-8 py-4 rounded-full uppercase tracking-wider hover:bg-[#00c98b] transition-colors">
              Akademiyaya Qoşul
            </Link>
            <Link href="/oyunlar" className="border-2 border-white text-white font-bold px-8 py-4 rounded-full uppercase tracking-wider hover:bg-white hover:text-[#0a1628] transition-colors">
              Oyunlara Bax
            </Link>
          </div>
        </div>
      </section>

      {/* MATCH DASHBOARD AREA (Next Match & Last Result) */}
      <section className="relative z-20 px-4 -mt-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        
        {/* 2. NEXT MATCH CARD */}
        <div className="bg-[#f5f5f5] rounded-2xl p-8 shadow-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <span className="text-[#00e5a0] font-mono font-bold uppercase tracking-widest text-sm bg-[#0a1628] px-3 py-1 rounded">
              NÖVBƏTİ OYUN
            </span>
            <div className="mt-8 flex justify-between items-center text-[#0a1628]">
              <div className="text-center w-1/3">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center text-xs font-bold">LİQO</div>
                <h3 className="font-bold text-lg">{nextMatch.home_team}</h3>
              </div>
              <div className="text-center w-1/3">
                <div className="text-3xl font-black mb-1">VS</div>
                <div className="text-sm font-bold text-gray-500">{nextMatch.date}</div>
                <div className="text-sm font-bold text-gray-500">{nextMatch.time}</div>
              </div>
              <div className="text-center w-1/3">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center text-xs font-bold">LİQO</div>
                <h3 className="font-bold text-lg">{nextMatch.away_team}</h3>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm font-bold text-gray-600 uppercase">
            🏟 {nextMatch.stadium}
          </div>
        </div>

        {/* 3. LAST RESULT CARD */}
        <div className="bg-[#0a1628] text-white rounded-2xl p-8 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[#0a1628] bg-[#00e5a0] font-mono font-bold uppercase tracking-widest text-sm px-3 py-1 rounded">
              SON NƏTİCƏ
            </span>
            <div className="mt-8 flex justify-between items-center">
              <div className="text-center w-1/3">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center text-xs font-bold">LİQO</div>
                <h3 className="font-bold text-lg">{lastResult.home_team}</h3>
              </div>
              <div className="text-center w-1/3">
                <div className="text-5xl font-black text-[#00e5a0] tracking-widest">
                  {lastResult.home_score} - {lastResult.away_score}
                </div>
                <div className="text-sm font-bold text-gray-400 mt-2">{lastResult.date}</div>
              </div>
              <div className="text-center w-1/3">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center text-xs font-bold">LİQO</div>
                <h3 className="font-bold text-lg">{lastResult.away_team}</h3>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center">
            <Link href="/oyunlar" className="text-[#00e5a0] font-bold uppercase hover:underline">
              BÜTÜN NƏTİCƏLƏR ➔
            </Link>
          </div>
        </div>
      </section>

      {/* 4. LATEST NEWS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <span className="text-[#00e5a0] font-mono font-bold uppercase tracking-widest text-sm">
              SON XƏBƏRLƏR
            </span>
            <h2 className="text-4xl font-black uppercase text-[#0a1628] tracking-wider mt-2">
              YARIMADA FK-DAN XƏBƏRLƏR
            </h2>
          </div>
          <Link href="/xeberler" className="border-2 border-[#0a1628] text-[#0a1628] font-bold px-6 py-3 rounded-full uppercase tracking-wider hover:bg-[#0a1628] hover:text-white transition-colors">
            Bütün Xəbərlər
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item.id} className="bg-[#f5f5f5] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-300 w-full flex items-center justify-center text-gray-500 font-bold">
                ŞƏKİL (XƏBƏR)
              </div>
              <div className="p-6">
                <div className="text-gray-500 font-mono text-sm mb-3 font-bold">{item.published_at}</div>
                <h3 className="text-xl font-bold text-[#0a1628] mb-3 leading-tight uppercase">{item.title}</h3>
                <p className="text-gray-600 line-clamp-3">{item.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TEAMS SECTION */}
      <section className="py-16 px-4 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[#00e5a0] font-mono font-bold uppercase tracking-widest text-sm">
            BİZİM GƏLƏCƏYİMİZ
          </span>
          <h2 className="text-4xl font-black uppercase text-[#0a1628] tracking-wider mt-2 mb-10">
            KOMANDALARIMIZ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.map((team) => (
              <Link key={team.id} href={`/komandalar?age=${team.age_group}`} className="group relative block overflow-hidden rounded-2xl bg-[#0a1628] aspect-square">
                <div className="absolute inset-0 bg-gray-400 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-gray-600 font-bold text-xl">
                  ŞƏKİL (KOMANDA)
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                  <h3 className="text-3xl font-black text-white group-hover:text-[#00e5a0] transition-colors">{team.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VIDEOS SECTION */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#00e5a0] font-mono font-bold uppercase tracking-widest text-sm">
            MULTİMEDİYA
          </span>
          <h2 className="text-4xl font-black uppercase text-[#0a1628] tracking-wider mt-2">
            SON VİDEOLAR
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div key={vid.id} className="relative aspect-video bg-gray-300 rounded-2xl overflow-hidden flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              <div className="w-16 h-16 bg-[#00e5a0] rounded-full flex items-center justify-center text-[#0a1628] z-10 pl-1 shadow-lg group-hover:scale-110 transition-transform">
                ▶
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white font-bold z-10 truncate drop-shadow-md">
                {vid.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. ABOUT SECTION */}
      <section className="relative py-24 px-4 bg-[#0a1628] overflow-hidden text-center flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gray-800 opacity-30 z-0"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="text-[#00e5a0] font-mono font-bold uppercase tracking-widest text-sm bg-black/30 px-3 py-1 rounded">
            KLUB HAQQINDA
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-wider mt-6 mb-6">
            BİZ KİMİK?
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-10">
            Yarımada FK sadəcə bir futbol klubu deyil. Biz gənc istedadları kəşf edir, 
            onları peşəkar futbola hazırlayır və milli futbolumuzun inkişafına töhfə veririk.
          </p>
          <Link href="/klub" className="bg-[#00e5a0] text-[#0a1628] font-bold px-8 py-4 rounded-full uppercase tracking-wider hover:bg-[#00c98b] transition-colors inline-block">
            Ətraflı Oxu
          </Link>
        </div>
      </section>

      {/* 8. SPONSORS */}
      <section className="py-12 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[#0a1628] font-mono font-bold uppercase tracking-widest text-sm mb-6 block">
            TƏRƏFDAŞLARIMIZ
          </span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
            {sponsors.map((sp) => (
              <div key={sp.id} className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-500">
                {sp.name} LOGO
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
