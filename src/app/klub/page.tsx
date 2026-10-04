export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { ClubInfo, Leadership, Achievement } from '@/lib/types';
import FadeIn from '@/components/FadeIn';

export default async function ClubPage() {
  let clubInfo: ClubInfo | null = null;
  let leadership: Leadership[] = [];
  let achievements: Achievement[] = [];

  try {
    const clubRes = await supabase.from('club_info').select('*').single();
    if (clubRes.data) clubInfo = clubRes.data;

    const leadRes = await supabase.from('leadership').select('*').order('sort_order', { ascending: true });
    if (leadRes.data) leadership = leadRes.data;

    const achRes = await supabase.from('achievements').select('*').order('year', { ascending: false });
    if (achRes.data) achievements = achRes.data;
  } catch (error) {
    console.error('Error fetching club data:', error);
  }

  const aboutText = clubInfo?.about_az || 'Yarımada FK 2023-cü ildə Bakıda təsis edilmiş peşəkar futbol akademiyasıdır. Əsas məqsədimiz uşaq və gənclər arasında futbolu təbliğ etmək, sağlam həyat tərzini aşılamaq və gələcəyin peşəkar futbolçularını yetişdirməkdir.';
  const missionText = clubInfo?.mission_az || 'Azərbaycan futboluna yeni istedadlar qazandırmaq və uşaqların fiziki, psixoloji inkişafına dəstək olmaq.';
  const visionText = clubInfo?.vision_az || 'Ölkənin ən qabaqcıl və müasir infrastruktura malik futbol akademiyalarından biri olmaq.';

  return (
    <main className="flex-grow bg-[var(--bg)] text-[var(--text)]">
      {/* 1. HERO SECTION */}
      <section className="pt-40 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[60vh] flex flex-col justify-end p-8 md:p-16">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-[var(--surface-2)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-2)] via-[var(--surface-2)]/60 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-4xl">
            <FadeIn>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--accent)] mb-4 font-bold">Klub</p>
              <h1 className="text-7xl md:text-9xl font-black font-display uppercase tracking-normal text-white mb-6 leading-[0.85] drop-shadow-xl">
                BİZ KİMİK?
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-4 max-w-2xl leading-relaxed">
                Tariximiz, fəlsəfəmiz və məqsədlərimiz.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto" id="haqqimizda">
        <div className="bg-[var(--ks-paper-deep)] rounded-[2rem] p-8 md:p-16">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--surface-2)]/60 mb-4 font-bold">HAQQIMIZDA</p>
                <h2 className="text-5xl md:text-7xl font-black font-display uppercase text-[var(--text)] mb-8 leading-[0.9]">
                  YARIMADA FK
                </h2>
                <div className="text-xl text-[var(--text)]/70 mb-8 leading-relaxed">
                  {aboutText}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[var(--surface-2)] text-white p-8 rounded-[2rem] col-span-1 sm:col-span-2 shadow-lg">
                  <h3 className="text-[var(--accent)] font-black font-display text-3xl uppercase tracking-widest mb-4">Missiya</h3>
                  <p className="text-lg leading-relaxed">{missionText}</p>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-[2rem] shadow-sm">
                  <h3 className="text-[var(--accent)] font-black font-display text-3xl uppercase tracking-widest mb-4">Vizyon</h3>
                  <p className="text-[var(--text)]">{visionText}</p>
                </div>
                <div className="bg-[var(--accent)] p-8 rounded-[2rem] shadow-sm">
                  <h3 className="text-[var(--text)] font-black font-display text-3xl uppercase tracking-widest mb-4">Dəyərlər</h3>
                  <ul className="text-[var(--text)] space-y-2 font-bold text-lg">
                    <li>İntizam</li>
                    <li>Hörmət</li>
                    <li>Komanda ruhu</li>
                    <li>İnkişaf</li>
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. LEADERSHIP SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto" id="rehberlik">
        <FadeIn>
          <div className="mb-10">
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--surface-2)]/60 mb-4 font-bold">RƏHBƏRLİK</p>
            <h2 className="text-6xl md:text-7xl font-black font-display uppercase text-[var(--text)] leading-[0.9]">
              KLUB NÜMAYƏNDƏLƏRİ
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.length > 0 ? (
              leadership.map((leader) => (
                <div key={leader.id} className="bg-[var(--ks-paper-deep)] rounded-[2rem] overflow-hidden group">
                  <div className="aspect-[3/4] bg-[var(--border)] relative overflow-hidden">
                    {leader.photo_url ? (
                      <img src={leader.photo_url} alt={leader.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-2)]">
                        <span className="text-[var(--surface-2)]/20 font-bold font-display text-4xl uppercase">FK</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black font-display uppercase tracking-wide text-[var(--text)] mb-1">{leader.name}</h3>
                    <p className="text-[var(--accent)] font-bold text-sm uppercase tracking-wider">{leader.role}</p>
                  </div>
                </div>
              ))
            ) : (
              // Mock items if empty
              Array(4).fill(null).map((_, i) => (
                <div key={i} className="bg-[var(--ks-paper-deep)] rounded-[2rem] overflow-hidden group">
                  <div className="aspect-[3/4] bg-[var(--border)]"></div>
                  <div className="p-8">
                    <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-[var(--border)] rounded"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </FadeIn>
      </section>
      
    </main>
  );
}
