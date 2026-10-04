export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function TeamsPage(props: { searchParams: Promise<{ age?: string }> }) {
  const searchParams = await props.searchParams;
  const ageFilter = searchParams.age;
  
  let teams: any[] = [];
  try {
    let query = supabase.from('teams').select('*').order('created_at', { ascending: true });
    if (ageFilter) {
      query = query.eq('age_group', ageFilter);
    }
    const res = await query;
    if (res.data) teams = res.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
  }

  // Fallback data for the UI if database is empty
  const mockTeams = [
    { id: '1', name: 'Yarımada U-12', age_group: 'U-12', coach: 'Əhməd Məmmədov', players: 18 },
    { id: '2', name: 'Yarımada U-11', age_group: 'U-11', coach: 'Emin Quliyev', players: 16 },
    { id: '3', name: 'Yarımada U-10', age_group: 'U-10', coach: 'Rəşad Əliyev', players: 20 },
    { id: '4', name: 'Yarımada U-9', age_group: 'U-9', coach: 'Vüsal Həsənov', players: 22 },
  ];

  const displayTeams = teams.length > 0 ? teams : (ageFilter ? mockTeams.filter(t => t.age_group === ageFilter) : mockTeams);

  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)]">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[40vh] flex flex-col justify-end p-8 md:p-16 bg-[#0a1628]">
          <div className="relative z-10 max-w-4xl">
            <FadeIn>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">AKADEMİYA</p>
              <h1 className="text-7xl md:text-9xl font-black font-condensed uppercase tracking-normal text-white mb-6 leading-[0.85] drop-shadow-xl">
                KOMANDALAR
              </h1>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. FILTER & LIST */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link 
              href="/komandalar" 
              className={`ks-button !rounded-full !px-6 !py-3 font-bold ${!ageFilter ? '!bg-[var(--ks-ink)] !text-white' : '!bg-white !text-[var(--ks-ink)] !border-gray-200 hover:!border-[var(--ks-ink)]'}`}
            >
              Bütün komandalar
            </Link>
            {['U-12', 'U-11', 'U-10', 'U-9'].map(age => (
              <Link 
                key={age}
                href={`/komandalar?age=${age}`} 
                className={`ks-button !rounded-full !px-6 !py-3 font-bold ${ageFilter === age ? '!bg-[var(--ks-ink)] !text-white' : '!bg-white !text-[var(--ks-ink)] !border-gray-200 hover:!border-[var(--ks-ink)]'}`}
              >
                {age}
              </Link>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayTeams.map((team, idx) => (
              <Link key={team.id || idx} href={`/komandalar/${team.id}`} className="group block bg-[var(--ks-paper-deep)] rounded-[2rem] p-8 hover:bg-[#0a1628] hover:text-white transition-colors duration-500">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-[var(--ks-paper-deep)] group-hover:border-[#0a1628] transition-colors shadow-sm">
                    <span className="text-2xl font-black text-[var(--ks-ink)]">{team.age_group}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-gray-300 group-hover:border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-[var(--ks-ink)] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-black font-condensed uppercase tracking-wide mb-2 group-hover:text-[var(--ks-kinpaku)] transition-colors">
                  {team.name}
                </h3>
                
                <div className="flex flex-wrap gap-6 mt-6">
                  <div>
                    <p className="text-xs font-mono uppercase text-gray-500 group-hover:text-white/50 mb-1">Baş Məşqçi</p>
                    <p className="font-bold">{team.coach || 'Təyin edilməyib'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase text-gray-500 group-hover:text-white/50 mb-1">Heyət</p>
                    <p className="font-bold">{team.players || 0} Futbolçu</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>
      </section>

    </main>
  );
}
