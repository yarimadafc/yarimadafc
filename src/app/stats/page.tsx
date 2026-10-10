'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Goal, Footprints, Users, Timer, ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import TeamLogo from '@/components/TeamLogo';
import { useLang } from '@/lib/i18n';
import { formatShortDate } from '@/lib/matchUtils';
import { buildPlayerStats, byAssists, byGoals, seasonOf, PlayerStat } from '@/lib/playerStats';
import { PlayerInfo, usePlayerStatsData } from '@/lib/usePlayerStats';
import { useOrderedTeams } from '@/lib/teamOrder';

type Tab = 'goals' | 'assists' | 'all';
type SortKey = 'games' | 'starts' | 'goals' | 'assists' | 'minutes';

const TABS: { id: Tab; label: string }[] = [
  { id: 'goals', label: 'Ən çox qol vuranlar' },
  { id: 'assists', label: 'Ən çox assist edənlər' },
  { id: 'all', label: 'Bütün futbolçular' },
];

function Avatar({ stat, info, size = 44 }: { stat: PlayerStat; info?: PlayerInfo; size?: number }) {
  const [broken, setBroken] = useState(false);
  const src = info?.image_url && !broken ? info.image_url : null;
  return (
    <span data-no-fallback style={{ width: size, height: size }} className="relative shrink-0 rounded-full overflow-hidden bg-bg-card ring-2 ring-bg-border inline-flex items-center justify-center">
      {src ? (
        <img src={src} alt={stat.name} loading="lazy" onError={() => setBroken(true)} className="w-full h-full object-cover object-top" />
      ) : (
        <span className="font-bold text-text-sec" style={{ fontSize: size / 2.8 }}>{stat.number || stat.name.slice(0, 1)}</span>
      )}
    </span>
  );
}

function MatchLines({ stat }: { stat: PlayerStat }) {
  const { t } = useLang();
  return (
    <div className="px-4 pb-4 pt-1 animate-[fade-in_.25s_ease-out_both]">
      <div className="rounded-lg border border-bg-border overflow-hidden">
        <div className="grid grid-cols-[4.5rem_1fr_3.5rem_2.5rem_2.5rem_3rem] gap-2 px-3 py-2 text-[11px] uppercase tracking-wider text-text-sec bg-bg-main">
          <span>{t('Tarix')}</span><span>{t('Rəqib')}</span><span className="text-center">{t('Hesab')}</span>
          <span className="text-center">{t('Q')}</span><span className="text-center">{t('A')}</span><span className="text-center">{t('Dəq.')}</span>
        </div>
        {stat.matches.map(m => (
          <div key={m.matchId} className="grid grid-cols-[4.5rem_1fr_3.5rem_2.5rem_2.5rem_3rem] gap-2 items-center px-3 py-2 border-t border-bg-border text-sm">
            <span className="text-text-sec text-xs">{formatShortDate(m.date) || '—'}</span>
            <span className="flex items-center gap-2 min-w-0"><TeamLogo name={m.opponent} logo={m.opponentLogo} size={20} /><span className="truncate">{m.opponent}</span></span>
            <span className="text-center font-semibold tabular-nums">{m.score}</span>
            <span className={`text-center tabular-nums ${m.goals ? 'font-extrabold text-text-main' : 'text-text-sec'}`}>{m.goals || '–'}</span>
            <span className={`text-center tabular-nums ${m.assists ? 'font-extrabold text-text-main' : 'text-text-sec'}`}>{m.assists || '–'}</span>
            <span className="text-center tabular-nums text-text-sec">{m.minutes || '–'}</span>
          </div>
        ))}
      </div>
      {stat.playerId && (
        <Link href={`/players/${stat.playerId}`} className="btn-fx mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          {t('Futbolçunun profili')} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

function StatsView() {
  const { t } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab = (TABS.some(x => x.id === params.get('tab')) ? params.get('tab') : 'goals') as Tab;
  const { matches, players, playerList, loading } = usePlayerStatsData();
  const { compareNames } = useOrderedTeams('id, name, sort_order');
  const [team, setTeam] = useState('');
  const [season, setSeason] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('goals');

  // team filter in the admin's team order (U-13 first by default)
  const teams = useMemo(() => [...new Set([
    ...matches.map(m => m.tournament),
    ...playerList.filter(p => p.teams?.name && Object.keys(p).some(k => k.startsWith('stat_') && Number(p[k]) > 0)).map(p => p.teams!.name),
  ].filter(Boolean))].sort(compareNames) as string[], [matches, playerList, compareNames]);
  const seasons = useMemo(() => [...new Set(matches.map(m => seasonOf(m.match_date || m.date)).filter(Boolean))].sort().reverse() as string[], [matches]);
  const stats = useMemo(() => buildPlayerStats(matches, { team: team || undefined, season: season || undefined }, playerList), [matches, team, season, playerList]);

  const list = useMemo(() => {
    if (tab === 'goals') return stats.filter(s => s.goals > 0).sort(byGoals);
    if (tab === 'assists') return stats.filter(s => s.assists > 0).sort(byAssists);
    return [...stats].sort((a, b) => b[sort] - a[sort] || byGoals(a, b));
  }, [stats, tab, sort]);

  const totals = useMemo(() => ({
    goals: stats.reduce((n, s) => n + s.goals, 0),
    assists: stats.reduce((n, s) => n + s.assists, 0),
    players: stats.length,
    // played matches, or the largest per-player game count when admin-entered games exceed them
    games: Math.max(new Set(stats.flatMap(s => s.matches.map(m => m.matchId))).size, ...stats.map(s => s.games), 0),
  }), [stats]);

  const setTab = (id: Tab) => { setOpen(null); router.replace(`${pathname}?tab=${id}`, { scroll: false }); };
  const metric = (s: PlayerStat) => (tab === 'assists' ? s.assists : s.goals);
  const pill = (active: boolean) => `shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${active ? 'bg-accent text-on-accent border-accent' : 'border-bg-border text-text-sec hover:text-text-main hover:border-text-sec'}`;
  const headCell = (key: SortKey, label: string) => (
    <button onClick={() => setSort(key)} className={`w-full text-center uppercase tracking-wider ${sort === key ? 'text-text-main font-bold' : ''}`} aria-pressed={sort === key}>{label}</button>
  );

  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title={t('Futbolçu Statistikası')} subtitle={t('Akademiya futbolçularının oyun, qol, assist və dəqiqə göstəriciləri. Statistika keçirilmiş oyunların heyət məlumatlarından avtomatik hesablanır.')} />
      <div className="container">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 flex-1">
            <button onClick={() => setTeam('')} className={pill(team === '')}>{t('Bütün komandalar')}</button>
            {teams.map(x => <button key={x} onClick={() => setTeam(x)} className={pill(team === x)}>{x}</button>)}
          </div>
          {seasons.length > 0 && (
            <label className="relative shrink-0">
              <span className="sr-only">{t('Mövsüm')}</span>
              <select value={season} onChange={e => setSeason(e.target.value)} className="appearance-none bg-bg-sec border border-bg-border rounded-full pl-4 pr-10 py-2 text-sm font-semibold text-text-main focus:outline-none focus:border-accent">
                <option value="">{t('Bütün mövsümlər')}</option>
                {seasons.map(x => <option key={x} value={x}>{t('Mövsüm')} {x}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-sec" />
            </label>
          )}
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { icon: Goal, label: 'Qol', value: totals.goals },
            { icon: Footprints, label: 'Assist', value: totals.assists },
            { icon: Timer, label: 'Oyun', value: totals.games },
            { icon: Users, label: 'Futbolçu', value: totals.players },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="led-border bg-bg-sec rounded-xl p-4 md:p-5 flex items-center gap-4">
              <span className="w-11 h-11 rounded-full bg-bg-card flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-accent" /></span>
              <span>
                <span className="block text-2xl md:text-3xl font-extrabold tabular-nums text-text-main leading-none">{loading ? '–' : value}</span>
                <span className="block mt-1 text-xs uppercase tracking-wider text-text-sec">{t(label)}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar border-b border-bg-border mb-6" role="tablist">
          {TABS.map(x => (
            <button key={x.id} role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)}
              className={`shrink-0 pb-3 -mb-px text-sm md:text-base font-semibold border-b-2 transition-colors ${tab === x.id ? 'text-text-main border-accent' : 'text-text-sec border-transparent hover:text-text-main'}`}>
              {t(x.label)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-72 rounded-xl bg-bg-sec animate-pulse" aria-hidden />
        ) : list.length === 0 ? (
          <div className="rounded-xl border border-bg-border bg-bg-sec py-16 px-6 text-center text-text-sec">
            {t('Seçilmiş filtr üzrə statistika hələ yoxdur. Oyunlar bitdikdən sonra heyət məlumatları əsasında burada görünəcək.')}
          </div>
        ) : tab !== 'all' ? (
          <>
            {/* Podium */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {list.slice(0, 3).map((s, i) => (
                <Reveal key={s.key} delay={i * 0.08} variant="scale">
                  <button onClick={() => setOpen(open === s.key ? null : s.key)} className={`led-border led-hover card-fx w-full text-left bg-bg-sec rounded-xl p-5 flex items-center gap-4 ${i === 0 ? 'sm:ring-1 sm:ring-accent/40' : ''}`}>
                    <span className="text-4xl font-extrabold text-text-sec/40 tabular-nums w-8">{i + 1}</span>
                    <Avatar stat={s} info={s.playerId ? players[s.playerId] : undefined} size={56} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-text-main truncate">{s.name}</span>
                      <span className="block text-xs text-text-sec truncate">{s.teams.join(', ')}{s.number ? ` · №${s.number}` : ''}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-3xl font-extrabold tabular-nums text-text-main leading-none">{metric(s)}</span>
                      <span className="block text-[11px] uppercase tracking-wider text-text-sec mt-1">{tab === 'goals' ? t('qol') : t('assist')}</span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>

            {/* Ranking */}
            <div className="bg-bg-sec rounded-xl border border-bg-border overflow-hidden">
              {list.map((s, i) => (
                <div key={s.key} className="border-t border-bg-border first:border-t-0">
                  <button onClick={() => setOpen(open === s.key ? null : s.key)} className="w-full flex items-center gap-3 md:gap-4 px-4 py-3 text-left hover:bg-bg-card transition-colors" aria-expanded={open === s.key}>
                    <span className="w-6 text-center font-bold text-text-sec tabular-nums">{i + 1}</span>
                    <Avatar stat={s} info={s.playerId ? players[s.playerId] : undefined} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-text-main truncate">{s.name}</span>
                      <span className="block text-xs text-text-sec truncate">{s.teams.join(', ')} · {s.games} {t('oyun')}</span>
                    </span>
                    <span className="hidden sm:block text-xs text-text-sec tabular-nums w-24 text-right">{tab === 'goals' ? `${s.assists} ${t('assist')}` : `${s.goals} ${t('qol')}`}</span>
                    <span className="text-xl font-extrabold tabular-nums text-text-main w-10 text-right">{metric(s)}</span>
                    <ChevronDown className={`w-4 h-4 text-text-sec transition-transform ${open === s.key ? 'rotate-180' : ''}`} />
                  </button>
                  {open === s.key && <MatchLines stat={s} />}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-bg-sec rounded-xl border border-bg-border overflow-hidden">
            <div className="grid grid-cols-[1fr_repeat(3,2.75rem)] sm:grid-cols-[1fr_repeat(5,4rem)] gap-1 px-4 py-3 text-[11px] text-text-sec">
              <span className="uppercase tracking-wider">{t('Futbolçu')}</span>
              {headCell('games', t('Oyun'))}
              <span className="hidden sm:block">{headCell('starts', t('İlk 11'))}</span>
              {headCell('goals', t('Qol'))}
              {headCell('assists', t('Assist'))}
              <span className="hidden sm:block">{headCell('minutes', t('Dəq.'))}</span>
            </div>
            {list.map(s => (
              <div key={s.key} className="border-t border-bg-border">
                <button onClick={() => setOpen(open === s.key ? null : s.key)} className="w-full grid grid-cols-[1fr_repeat(3,2.75rem)] sm:grid-cols-[1fr_repeat(5,4rem)] gap-1 items-center px-4 py-3 text-left hover:bg-bg-card transition-colors" aria-expanded={open === s.key}>
                  <span className="flex items-center gap-3 min-w-0">
                    <Avatar stat={s} info={s.playerId ? players[s.playerId] : undefined} size={36} />
                    <span className="min-w-0">
                      <span className="block font-semibold text-text-main truncate">{s.name}</span>
                      <span className="block text-xs text-text-sec truncate">{s.teams.join(', ')}{s.position ? ` · ${s.position}` : ''}</span>
                    </span>
                  </span>
                  <span className="text-center tabular-nums">{s.games}</span>
                  <span className="hidden sm:block text-center tabular-nums">{s.starts}</span>
                  <span className="text-center tabular-nums font-bold">{s.goals}</span>
                  <span className="text-center tabular-nums font-bold">{s.assists}</span>
                  <span className="hidden sm:block text-center tabular-nums text-text-sec">{s.minutes || '–'}</span>
                </button>
                {open === s.key && <MatchLines stat={s} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <Suspense fallback={<div className="pt-header min-h-screen" />}>
      <StatsView />
    </Suspense>
  );
}
