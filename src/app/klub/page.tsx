import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// --- MOCK DATA FALLBACKS ---
const MOCK_CLUB_INFO = {
  about: 'Yarımada FK 2026-cı ildə yaranıb. Əsas məqsədimiz yerli gənclərin futbol potensialını üzə çıxarmaqdır.',
  mission: 'Gənc istedadları kəşf edərək onlara peşəkar futbol karyerası qurmaqda dəstək olmaq.',
  vision: 'Azərbaycanın ən güclü futbol akademiyalarından birinə çevrilmək.',
  values: 'İntizam, Əzm, Komanda Ruhu, Peşəkarlıq',
  philosophy: 'Hücum futbolu və gənclərə güvən.'
};

const MOCK_LEADERSHIP = [
  { id: '1', name: 'Rəhbər Adı 1', role: 'Klub Prezidenti' },
  { id: '2', name: 'Rəhbər Adı 2', role: 'İdman Direktoru' },
  { id: '3', name: 'Rəhbər Adı 3', role: 'Baş Məşqçi' },
];

const MOCK_ACHIEVEMENTS = [
  { id: '1', year: '2027', title: 'U-12 Liqa Çempionu' },
  { id: '2', year: '2028', title: 'Gənclər Kuboku Qalibi' },
];

export default async function ClubPage() {
  // --- FETCH DATA ---
  let clubInfo = MOCK_CLUB_INFO;
  let leadership = MOCK_LEADERSHIP;
  let achievements = MOCK_ACHIEVEMENTS;

  try {
    const { data: ci } = await supabase.from('club_info').select('*').single();
    if (ci) clubInfo = ci;
  } catch (e) { /* ignore */ }

  try {
    const { data: l } = await supabase.from('leadership').select('*');
    if (l && l.length) leadership = l;
  } catch (e) { /* ignore */ }

  try {
    const { data: a } = await supabase.from('achievements').select('*').order('year', { ascending: false });
    if (a && a.length) achievements = a;
  } catch (e) { /* ignore */ }

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[400px] bg-[#0a1628] flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-gray-800 opacity-40 z-0"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-[#00e5a0] rounded-full flex items-center justify-center text-[#0a1628] font-black text-2xl mb-4">
            2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-white tracking-widest">
            KLUB
          </h1>
          <p className="text-[#00e5a0] font-mono tracking-widest uppercase font-bold mt-2">
            Tariximiz və Fəlsəfəmiz
          </p>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl font-black uppercase text-[#0a1628] tracking-wider mb-6">
              BİZ KİMİK?
            </h2>
            <div className="text-lg text-gray-700 leading-relaxed mb-8">
              {clubInfo.about}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#f5f5f5] p-6 rounded-2xl border-l-4 border-[#00e5a0]">
                <h3 className="text-xl font-bold uppercase text-[#0a1628] mb-3">Missiyamız</h3>
                <p className="text-gray-600">{clubInfo.mission}</p>
              </div>
              <div className="bg-[#f5f5f5] p-6 rounded-2xl border-l-4 border-[#00e5a0]">
                <h3 className="text-xl font-bold uppercase text-[#0a1628] mb-3">Vizyonumuz</h3>
                <p className="text-gray-600">{clubInfo.vision}</p>
              </div>
              <div className="bg-[#f5f5f5] p-6 rounded-2xl border-l-4 border-[#0a1628] sm:col-span-2">
                <h3 className="text-xl font-bold uppercase text-[#0a1628] mb-3">Fəlsəfəmiz & Dəyərlər</h3>
                <p className="text-gray-600 mb-2"><strong>Dəyərlər:</strong> {clubInfo.values}</p>
                <p className="text-gray-600"><strong>Fəlsəfə:</strong> {clubInfo.philosophy}</p>
              </div>
            </div>
          </div>

          <div className="relative h-[600px] bg-gray-300 rounded-2xl overflow-hidden flex items-center justify-center text-gray-500 font-bold text-2xl">
            TƏRİXİ ŞƏKİL
          </div>
        </div>
      </section>

      {/* 3. LEADERSHIP */}
      <section className="py-20 px-4 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#00e5a0] font-mono font-bold uppercase tracking-widest text-sm">
              BİZİ İDARƏ EDƏNLƏR
            </span>
            <h2 className="text-4xl font-black uppercase text-[#0a1628] tracking-wider mt-2">
              RƏHBƏRLİK
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {leadership.map((person) => (
              <div key={person.id} className="bg-white rounded-2xl overflow-hidden shadow-md text-center">
                <div className="h-64 bg-gray-300 flex items-center justify-center text-gray-500 font-bold">
                  PORTRET
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-[#0a1628] uppercase">{person.name}</h3>
                  <p className="text-[#00e5a0] font-bold mt-1 uppercase text-sm tracking-wide">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ACHIEVEMENTS */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center">
        <span className="text-[#00e5a0] font-mono font-bold uppercase tracking-widest text-sm">
          UĞURLARIMIZ
        </span>
        <h2 className="text-4xl font-black uppercase text-[#0a1628] tracking-wider mt-2 mb-12">
          NAİLİYYƏTLƏR
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((ach) => (
            <div key={ach.id} className="bg-[#0a1628] text-white p-8 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-gray-800">
              <div className="text-[#00e5a0] text-3xl font-black mb-4">{ach.year}</div>
              <h3 className="text-lg font-bold uppercase tracking-wide">{ach.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
