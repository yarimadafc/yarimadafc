// Make page completely dynamic to prevent static generation timeout build errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { ClubInfo, Leadership, Achievement } from '@/lib/types';

export default async function ClubPage() {
  // Fetch data
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

  // Fallbacks if data is empty or errored
  const aboutText = clubInfo?.about_az || 'Yarımada FK 2023-cü ildə Bakıda təsis edilmiş peşəkar futbol akademiyasıdır. Əsas məqsədimiz uşaq və gənclər arasında futbolu təbliğ etmək, sağlam həyat tərzini aşılamaq və gələcəyin peşəkar futbolçularını yetişdirməkdir.';
  const missionText = clubInfo?.mission_az || 'Azərbaycan futboluna yeni istedadlar qazandırmaq və uşaqların fiziki, psixoloji inkişafına dəstək olmaq.';
  const visionText = clubInfo?.vision_az || 'Ölkənin ən qabaqcıl və müasir infrastruktura malik futbol akademiyalarından biri olmaq.';
  const foundedYear = clubInfo?.founded_year || 2023;

  const mockLeadership: Leadership[] = leadership;

  return (
    <main className="flex-grow pt-20">
      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[400px] bg-[#0a1628] flex items-center justify-center">
        <div className="absolute inset-0 opacity-40 bg-gradient-to-t from-[#0a1628] to-transparent z-10" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wider mb-4">
            Klub <span className="text-[#c9a84c]">Haqqında</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Tariximiz, fəlsəfəmiz və məqsədlərimiz
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white" id="haqqimizda">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-[#c9a84c]/10 text-[#c9a84c] font-mono text-sm uppercase tracking-widest rounded-full mb-6">
                Tarixçə
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#0a1628] uppercase tracking-wide mb-6">
                Yarımada FK
              </h2>
              <div className="prose prose-lg text-gray-600 mb-8">
                <p>{aboutText}</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-[#f5f5f5] p-6 rounded-2xl flex-1 text-center">
                  <div className="text-4xl font-black text-[#c9a84c] mb-2">{foundedYear}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">Yaranma ili</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#0a1628] text-white p-8 rounded-3xl col-span-1 sm:col-span-2">
                <h3 className="text-[#c9a84c] font-mono uppercase tracking-widest text-sm mb-4">Missiya</h3>
                <p className="text-lg leading-relaxed">{missionText}</p>
              </div>
              <div className="bg-[#f5f5f5] p-8 rounded-3xl">
                <h3 className="text-[#c9a84c] font-mono uppercase tracking-widest text-sm mb-4">Vizyon</h3>
                <p className="text-gray-700">{visionText}</p>
              </div>
              <div className="bg-[#c9a84c] p-8 rounded-3xl">
                <h3 className="text-[#0a1628] font-mono uppercase tracking-widest text-sm mb-4 font-bold">Dəyərlər</h3>
                <ul className="text-[#0a1628] space-y-2 font-medium">
                  <li>• İntizam</li>
                  <li>• Hörmət</li>
                  <li>• Komanda ruhu</li>
                  <li>• İnkişaf</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 md:py-24 bg-[#f5f5f5]" id="rehberlik">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#0a1628] uppercase tracking-wide mb-4">
              Klub Rəhbərliyi
            </h2>
            <div className="w-24 h-1 bg-[#c9a84c] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockLeadership.map((leader) => (
              <div key={leader.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-64 bg-gray-200 relative">
                  {leader.photo_url ? (
                    <Image src={leader.photo_url} alt={leader.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-[#0a1628] mb-1">{leader.name}</h3>
                  <p className="text-[#c9a84c] font-mono text-sm uppercase">{leader.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
