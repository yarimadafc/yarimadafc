export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function CalendarPage() {
  // In a real app we'd fetch matches and training schedule
  
  const mockEvents = [
    { type: 'oyun', title: 'Yarımada U-12 vs Neftçi U-12', date: '2026-10-12', time: '14:00', stadium: 'ASK Arena' },
    { type: 'mesq', title: 'U-12 Məşq', date: '2026-10-13', time: '18:00', stadium: 'Akademiya Meydançası' },
    { type: 'oyun', title: 'Sabah U-11 vs Yarımada U-11', date: '2026-10-14', time: '16:30', stadium: 'Bank Respublika Arena' },
    { type: 'mesq', title: 'U-11 və U-10 Məşq', date: '2026-10-15', time: '18:00', stadium: 'Akademiya Meydançası' },
    { type: 'tedbir', title: 'Valideynlərlə Görüş', date: '2026-10-16', time: '19:00', stadium: 'Akademiya Konfrans Zalı' },
  ];

  return (
    <main className="flex-grow bg-[var(--bg)] text-[var(--text)] pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      
      {/* HERO SECTION */}
      <div className="relative rounded-[2rem] overflow-hidden min-h-[30vh] flex flex-col justify-end p-8 md:p-12 bg-[var(--surface-2)] mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-2)] to-transparent z-0" />
        <div className="relative z-10 max-w-4xl">
          <FadeIn>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--accent)] mb-4 font-bold">AKADEMİYA</p>
            <h1 className="text-6xl md:text-8xl font-black font-display uppercase tracking-normal text-white leading-[0.85] drop-shadow-xl">
              TƏQVİM
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* CALENDAR LIST */}
      <FadeIn delay={0.1}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b border-[var(--border)] pb-4">
            <h2 className="text-3xl font-black font-display uppercase">Oktyabr 2026</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-2)] hover:text-white transition-colors">&larr;</button>
              <button className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-2)] hover:text-white transition-colors">&rarr;</button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {mockEvents.map((ev, i) => (
              <div key={i} className="bg-[var(--ks-paper-deep)] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 border border-[var(--border)] hover:border-[var(--surface-2)] transition-colors group">
                <div className="w-full md:w-32 flex flex-col items-center justify-center bg-[var(--surface)] p-4 rounded-xl shrink-0">
                  <span className="text-sm font-bold text-[var(--text-muted)] uppercase">{new Date(ev.date).toLocaleDateString('az-AZ', { month: 'short' })}</span>
                  <span className="text-4xl font-black font-display text-[var(--text)]">{new Date(ev.date).getDate()}</span>
                </div>
                
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--border)] text-[var(--text)] font-mono text-[10px] uppercase tracking-widest rounded-full mb-3 font-bold">
                    {ev.type === 'oyun' ? (
                      <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Oyun</>
                    ) : ev.type === 'mesq' ? (
                      <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Məşq</>
                    ) : (
                      <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Tədbir</>
                    )}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-wide group-hover:text-[var(--accent)] transition-colors mb-2">{ev.title}</h3>
                  <p className="text-[var(--text-muted)] font-mono text-sm uppercase">{ev.time} • {ev.stadium}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
