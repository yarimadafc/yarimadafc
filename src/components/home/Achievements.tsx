'use client';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SectionHeading from '@/components/SectionHeading';

export default function Achievements() {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAchievements() {
      const { data } = await supabase.from('achievements').select('*').order('order_num', { ascending: true }).limit(4);
      if (data) setAchievements(data);
    }
    fetchAchievements();
  }, []);

  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Nailiyyətlər" center />

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:divide-x-0 lg:divide-x divide-bg-border">
            {achievements.map(item => (
              <div key={item.id} className="flex flex-col items-center text-center px-4">
                <div className="h-24 mb-6 flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} loading="lazy" className="max-h-24 w-auto object-contain" />
                  ) : (
                    <Trophy className="w-16 h-16 text-text-sec" />
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-extrabold text-text-main leading-none">{item.count}</span>
                  <span className="text-sm text-text-main text-left leading-snug max-w-[130px]">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-text-sec py-8">Tezliklə yeni nailiyyətlər əlavə olunacaq...</p>
        )}
      </div>
    </section>
  );
}
