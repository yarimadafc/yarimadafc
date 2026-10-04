export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function CoachProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let coach: any = null;

  try {
    const res = await supabase.from('coaches').select('*, teams(name)').eq('id', params.id).single();
    if (res.data) coach = res.data;
  } catch (error) {
    console.error('Error fetching coach details:', error);
  }

  // Mock data removed


  return (
    <main className="flex-grow bg-[var(--bg)] text-[var(--text)] pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <Link href="/mesqciler" className="text-[var(--text-muted)] hover:text-[var(--text)] font-bold flex items-center gap-2 transition-colors mb-8">
        &larr; Məşqçilərə qayıt
      </Link>
      
      <FadeIn>
        <div className="bg-[var(--ks-paper-deep)] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-sm">
          {/* Coach Photo Section */}
          <div className="w-full md:w-1/3 bg-[var(--surface-2)] flex items-center justify-center relative min-h-[400px]">
            {coach.photo_url ? (
              <img src={coach.photo_url} alt={coach.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-2)] to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 text-center z-10">
              <h1 className="text-4xl font-black font-display uppercase text-white mb-1">{coach.name}</h1>
              <p className="text-[var(--accent)] font-mono uppercase tracking-widest text-sm">{coach.role}</p>
            </div>
          </div>

          {/* Coach Info Section */}
          <div className="flex-1 p-8 md:p-16">
            <h2 className="text-2xl font-black font-display uppercase mb-8 text-[var(--text-muted)]">MƏŞQÇİ MƏLUMATLARI</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)]">
                <p className="text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Komanda</p>
                <p className="font-bold text-lg">{coach.teams?.name || 'Komandasız'}</p>
              </div>
              <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)]">
                <p className="text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Təcrübə</p>
                <p className="font-bold text-lg">{coach.experience || '-'}</p>
              </div>
              <div className="bg-[var(--text)] text-[var(--accent)] p-6 rounded-2xl">
                <p className="text-xs font-mono uppercase mb-2 opacity-70">Lisenziya</p>
                <p className="font-black font-display text-3xl uppercase">{coach.license || '-'}</p>
              </div>
            </div>

            <h2 className="text-2xl font-black font-display uppercase mb-6 text-[var(--text-muted)]">QISA BİOQRAFİYA</h2>
            <div className="prose prose-lg text-[var(--text)]/80 leading-relaxed">
              <p>{coach.bio || 'Bioqrafiya əlavə edilməyib.'}</p>
            </div>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
