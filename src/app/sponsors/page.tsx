'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useSyncVersion } from '@/lib/siteSync';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sync = useSyncVersion();
  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('sponsors').select('*').order('created_at', { ascending: true });
      setSponsors(data || []);
      setLoading(false);
    }
    load();
  }, [sync]);

  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title="Sponsorlar" subtitle="Klubumuzun inkişafına dəstək olan rəsmi tərəfdaşlarımız." />
      <div className="container">
        {loading ? (
          <div className="h-48 rounded-xl bg-bg-sec animate-pulse" aria-hidden />
        ) : sponsors.length === 0 ? (
          <div className="rounded-xl border border-bg-border bg-bg-sec py-20 text-center text-text-sec">Sponsor məlumatı tezliklə əlavə olunacaq.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {sponsors.map((s, i) => (
              <Reveal key={s.id} variant="scale" delay={(i % 5) * 0.06}>
                <div className="led-border led-hover card-fx h-full min-h-40 bg-bg-sec rounded-xl border border-bg-border p-6 flex flex-col items-center justify-center gap-4 text-center">
                  {s.logo_url ? (
                    <img src={s.logo_url} alt={s.name} loading="lazy" className="max-h-20 w-auto max-w-full object-contain" />
                  ) : (
                    <span className="w-16 h-16 rounded-full bg-bg-card flex items-center justify-center text-xl font-bold text-text-sec uppercase">{(s.name || '?').slice(0, 2)}</span>
                  )}
                  <span className="text-text-main font-semibold text-sm">{s.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
