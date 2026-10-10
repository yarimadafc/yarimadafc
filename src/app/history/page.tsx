'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLang } from '@/lib/i18n';
import { useSyncVersion } from '@/lib/siteSync';
import { useFormat } from '@/lib/useFormat';
import { CalendarDays } from 'lucide-react';

const ABOUT_1 = 'Yarımada Futbol Klubu uşaq və gənclər futbolunun inkişafı, onlarda idmana sevgi yaratmaq məqsədilə təsis edilmişdir. Yarandığı gündən etibarən klubumuz qısa zamanda böyük uğurlara imza atmış və bir çox istedadlı gəncləri üzə çıxarmışdır.';
// admin -> Klub (Haqqımızda) -> Klubun yaranma tarixi
const CLUB_FOUNDED = '2023-02-23';
const ABOUT_2 = 'Bizim üçün hər bir uşaq gələcəyin ulduzudur. Mütəxəssis məşqçilərimiz tərəfindən tətbiq olunan xüsusi inkişaf proqramları ilə futbolçularımızın həm fiziki, həm də psixoloji cəhətdən tam hazırlıqlı olmasını təmin edirik.';

export default function HistoryPage() {
  const { loc, t: tr } = useLang();
  const { longDate } = useFormat();
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [achievements, setAchievements] = useState<any[]>([]);

  const sync = useSyncVersion();
  useEffect(() => {
    async function load() {
      const [{ data: t }, { data: a }] = await Promise.all([
        supabase.from('site_images').select('section_key, image_url').in('section_key', ['club_about_1', 'club_about_2', 'about_bg', 'club_founded']),
        supabase.from('achievements').select('*').order('order_num', { ascending: true }),
      ]);
      const map: Record<string, string> = {};
      (t || []).forEach((r: any) => { map[r.section_key] = r.image_url; });
      setTexts(map);
      setAchievements(a || []);
    }
    load();
  }, [sync]);

  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title="Klubun tarixi" subtitle="Yarımada FK-nın yaranması, inkişafı və qazandığı uğurlar." bg={texts.about_bg} />
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <Reveal variant="left" className="space-y-5 text-text-sec text-base md:text-lg leading-relaxed">
          <div className="led-border inline-flex items-center gap-4 bg-bg-sec border border-bg-border rounded-2xl px-5 py-4">
            <span className="w-11 h-11 rounded-full bg-bg-card flex items-center justify-center shrink-0"><CalendarDays className="w-5 h-5 text-accent" /></span>
            <span>
              <span className="block text-xs uppercase tracking-widest text-text-sec">{tr('Yaranma tarixi')}</span>
              <span className="block text-xl md:text-2xl font-extrabold text-text-main">{longDate(texts.club_founded || CLUB_FOUNDED)}</span>
            </span>
          </div>
          <p>{texts.club_about_1 || ABOUT_1}</p>
          <p>{texts.club_about_2 || ABOUT_2}</p>
          <Link href="/club" className="btn-fx inline-block border border-bg-border rounded-xl px-6 py-3 text-text-main font-semibold hover:border-accent">Klub haqqında ətraflı</Link>
        </Reveal>
        <Reveal variant="right">
          <ol className="relative border-l-2 border-bg-border pl-8 space-y-8">
            {/* the club's founding is always the first step of the timeline */}
            <li className="relative">
              <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-accent led-glow" />
              <div className="text-4xl font-extrabold text-text-main led-text leading-none mb-2">{(texts.club_founded || CLUB_FOUNDED).slice(0, 4)}</div>
              <h3 className="text-text-main font-bold">{tr('Klub yaradıldı')}</h3>
              <p className="text-text-sec text-sm mt-1">{longDate(texts.club_founded || CLUB_FOUNDED)}</p>
            </li>
            {achievements.map(a => (
              <li key={a.id} className="relative">
                <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-accent led-glow" />
                <div className="text-4xl font-extrabold text-text-main led-text leading-none mb-2">{a.count}</div>
                <h3 className="text-text-main font-bold">{loc(a, 'title')}</h3>
                {a.description && <p className="text-text-sec text-sm mt-1">{a.description}</p>}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </div>
  );
}
