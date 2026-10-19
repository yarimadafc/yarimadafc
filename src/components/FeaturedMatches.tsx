'use client';
import { useEffect, useState } from 'react';
import NextMatchCard from '@/components/NextMatchCard';
import LastResultCard from '@/components/LastResultCard';
import { useFeaturedMatches } from '@/lib/useNextMatch';
import { useLang } from '@/lib/i18n';

const ROTATE_MS = 8000;

// Home page: next match + last result of each featured team (U-13, U-12). The teams switch by themselves
// every few seconds; picking a team with the buttons stops the rotation.
export default function FeaturedMatches({ layout = 'stack' }: { layout?: 'stack' | 'grid' }) {
  const { teams, loading } = useFeaturedMatches();
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const count = teams.length;
  const index = count ? active % count : 0;
  const team = teams[index];

  useEffect(() => {
    if (pinned || count < 2) return;
    const id = setInterval(() => setActive(a => (a + 1) % count), ROTATE_MS);
    return () => clearInterval(id);
  }, [pinned, count]);

  const label = (name: string, age: number | null) => (age ? `U-${age}` : name || t('Oyunlar'));

  return (
    <div className="w-full">
      {count > 1 && (
        <div className="flex justify-center lg:justify-end gap-2 mb-3" role="tablist" aria-label={t('Komandalar')}>
          {teams.map((tm, i) => (
            <button
              key={tm.key}
              role="tab"
              aria-selected={i === index}
              onClick={() => { setActive(i); setPinned(true); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest border transition-colors ${i === index ? 'bg-accent text-on-accent border-accent' : 'bg-bg-deep/70 backdrop-blur text-text-sec border-bg-border hover:text-text-main'}`}
            >
              {label(tm.name, tm.age)}
            </button>
          ))}
        </div>
      )}
      <div key={team?.key ?? 'none'} className={`animate-[fade-in_.4s_ease-out_both] ${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'flex flex-col gap-3'}`}>
        <NextMatchCard match={team?.next ?? null} loading={loading} compact={layout === 'stack'} />
        <LastResultCard match={team?.last ?? null} loading={loading} />
      </div>
    </div>
  );
}
