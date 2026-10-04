export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function TeamsPage(props: { searchParams: Promise<{ age?: string }> }) {
  const searchParams = await props.searchParams;
  const activeAge = searchParams.age || 'all';

  let teams: any[] = [];
  try {
    const res = await supabase.from('teams').select('*').order('age_group', { ascending: false });
    if (res.data) teams = res.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
  }

  // Mock data removed as per user request

  if (activeAge !== 'all') {
    teams = teams.filter(t => t.age_group === activeAge);
  }

  const filters = ['all', 'U-12', 'U-11', 'U-10', 'U-9'];

  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)] pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      
      {/* HERO SECTION */}
      <div className="relative rounded-[2rem] overflow-hidden min-h-[30vh] flex flex-col justify-end p-8 md:p-12 bg-[#0a1628] mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0" />
        <div className="relative z-10 max-w-4xl">
          <FadeIn>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">AKADEMİYA</p>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black font-condensed uppercase tracking-normal text-white leading-[0.85] drop-shadow-xl">
              KOMANDALARIMIZ
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* FILTERS */}
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-200 pb-6">
          {filters.map(f => (
            <Link 
              key={f}
              href={`/komandalar${f === 'all' ? '' : `?age=${f}`}`}
              className={`font-black font-condensed text-2xl md:text-3xl uppercase tracking-widest transition-colors ${activeAge === f ? 'text-[var(--ks-ink)] border-b-4 border-[var(--ks-kinpaku)] pb-2' : 'text-gray-400 hover:text-[var(--ks-ink)]'}`}
            >
              {f === 'all' ? 'Bütün Komandalar' : f}
            </Link>
          ))}
        </div>
      </FadeIn>

      {/* GRID */}
      <FadeIn delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team, idx) => (
            <Link key={idx} href={`/komandalar/${team.id}`} className="group relative bg-[#0a1628] rounded-[2rem] overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 min-h-[300px] flex flex-col justify-end p-8">
              <div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700 bg-cover bg-center" style={{ backgroundImage: "url('/IMG_7966.JPG.jpeg')" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 to-[#0a1628]/20" />
              </div>
              <div className="relative z-10">
                <div className="bg-[var(--ks-kinpaku)] text-[#0a1628] text-xs font-bold font-mono px-3 py-1 rounded-md uppercase tracking-widest inline-flex items-center gap-2 mb-4 shadow-sm">
                  {/* Symbol instead of Emoji */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-8m0 0V5a2 2 0 012-2h4a2 2 0 012 2v11m0 0h2a2 2 0 012 2v3m-10-5V5m0 0H6a2 2 0 00-2 2v11m0 0h2" /></svg>
                  {team.age_group}
                </div>
                <h2 className="text-4xl font-black font-condensed uppercase tracking-wide text-white group-hover:text-[var(--ks-kinpaku)] transition-colors mb-2">
                  {team.name}
                </h2>
                <div className="flex justify-between items-end mt-4">
                  <div className="text-gray-400 font-mono text-sm uppercase">
                    <p>Baş Məşqçi: <span className="text-white font-bold">{team.coach}</span></p>
                    <p className="mt-1">Heyət: <span className="text-white font-bold">{team.players_count} nəfər</span></p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[var(--ks-kinpaku)] group-hover:text-[#0a1628] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {teams.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-bold text-2xl uppercase font-condensed tracking-widest">
            Komanda tapılmadı.
          </div>
        )}
      </FadeIn>

    </main>
  );
}
