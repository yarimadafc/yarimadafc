export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function CoachesPage() {
  let coaches: any[] = [];

  try {
    const res = await supabase.from('coaches').select('*, teams(name)');
    if (res.data) coaches = res.data;
  } catch (error) {
    console.error('Error fetching coaches:', error);
  }

  if (true) {
    coaches = coaches.map(c => ({...c, team_name: c.teams?.name}));
  }

  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)]">
      
      {/* 1. HERO SECTION */}
      <section className="pt-40 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[20vh] flex flex-col justify-end p-8 md:p-16 bg-[#0a1628]">
          <div className="relative z-10 max-w-4xl">
            <FadeIn>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">AKADEMİYA</p>
              <h1 className="text-5xl md:text-7xl font-black font-condensed uppercase tracking-normal text-white mb-6 leading-[0.85] drop-shadow-xl">
                MƏŞQÇİLƏRİMİZ
              </h1>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. GRID LIST */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coaches.map((coach) => (
              <Link key={coach.id} href={`/mesqciler/${coach.id}`} className="bg-[var(--ks-paper-deep)] rounded-[2rem] overflow-hidden group">
                <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                  {coach.photo_url ? (
                    <img src={coach.photo_url} alt={coach.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628]/5 text-gray-400">
                      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-sm text-xs font-bold font-mono text-[var(--ks-ink)]">
                    {coach.license || 'Lisenziya'}
                  </div>
                </div>
                <div className="p-8 border-t-4 border-transparent group-hover:border-[var(--ks-kinpaku)] transition-colors">
                  <h3 className="text-2xl font-black font-condensed uppercase tracking-wide text-[var(--ks-ink)] mb-1">{coach.name}</h3>
                  <p className="text-[var(--ks-kinpaku-rich)] font-bold text-sm uppercase tracking-wider mb-3">{coach.role}</p>
                  <p className="text-xs font-mono text-gray-500 uppercase">{coach.team_name || 'Komandasız'}</p>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>
      </section>

    </main>
  );
}
