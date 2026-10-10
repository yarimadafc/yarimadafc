'use client';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import { useLang } from '@/lib/i18n';
import { useSyncVersion } from '@/lib/siteSync';

export default function Achievements() {
  const { t, loc } = useLang();
  const [achievements, setAchievements] = useState<any[]>([]);

  const sync = useSyncVersion();
  useEffect(() => {
    async function fetchAchievements() {
      const { data } = await supabase.from('achievements').select('*').order('order_num', { ascending: true }).limit(4);
      if (data) setAchievements(data);
    }
    fetchAchievements();
  }, [sync]);

  return (
    <section className="py-14 md:py-24">
      <div className="container">
        <SectionHeading title="Nailiyyətlər" center />

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:divide-x-0 lg:divide-x divide-bg-border">
            {achievements.map((item, i) => (
              <Reveal key={item.id} variant="scale" delay={i * 0.1} className="flex flex-col items-center text-center px-4 group">
                <div className="h-20 mb-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 float-y">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} loading="lazy" className="max-h-20 w-auto object-contain" />
                  ) : (
                    <Trophy className="w-16 h-16 text-text-sec" />
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-4xl md:text-5xl font-extrabold text-text-main leading-none led-text">{item.count}</span>
                  <span className="text-sm text-text-main text-left leading-snug max-w-[130px]">{loc(item, 'title') || item.title}</span>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-text-sec py-8">{t('Tezliklə yeni nailiyyətlər əlavə olunacaq...')}</p>
        )}
      </div>
    </section>
  );
}
