'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import TeamLogo from '@/components/TeamLogo';
import { useFormat } from '@/lib/useFormat';
import { AnyMatch, matchStart, normalizeMatch } from '@/lib/matchUtils';
import { useSyncVersion } from '@/lib/siteSync';

import { CLUB_WHATSAPP } from '@/lib/contact';
import { TICKETS_DEFAULTS, useSiteTexts, waNumber } from '@/lib/siteTexts';

export default function TicketsPage() {
  const { longDate } = useFormat();
  const [matches, setMatches] = useState<AnyMatch[]>([]);
  const [loading, setLoading] = useState(true);
  // page texts, number, price, note and link are edited in admin -> Biletlər
  const texts = useSiteTexts(TICKETS_DEFAULTS);
  const whatsapp = waNumber(texts.tickets_whatsapp) || CLUB_WHATSAPP;

  const sync = useSyncVersion();
  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('matches').select('*').neq('status', 'finished').order('match_date', { ascending: true });
      const now = Date.now();
      setMatches((data || []).map(normalizeMatch).filter(m => m.ticket_enabled !== false && (matchStart(m)?.getTime() ?? now) >= now - 3 * 3600e3));
      setLoading(false);
    }
    load();
  }, [sync]);

  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title={texts.tickets_title} subtitle={texts.tickets_subtitle} />
      <div className="container">
        {loading ? (
          <div className="h-48 rounded-xl bg-bg-sec animate-pulse" aria-hidden />
        ) : matches.length === 0 ? (
          <div className="rounded-xl border border-bg-border bg-bg-sec py-20 text-center text-text-sec">{texts.tickets_empty}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {matches.map((m, i) => {
              const text = `Salam, ${m.home_team} - ${m.away_team} oyunu (${longDate(m.date)} ${m.time}) üçün bilet almaq istəyirəm.`;
              return (
                <Reveal key={m.id} variant="scale" delay={(i % 4) * 0.08}>
                  <div className="led-border led-hover card-fx h-full bg-bg-sec rounded-xl border border-bg-border p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="text-text-sec text-xs font-semibold mb-3">{m.tournament || 'Oyun'}</div>
                      <div className="flex items-center gap-3 mb-3">
                        <TeamLogo name={m.home_team} logo={m.home_logo} size={40} />
                        <span className="font-bold text-text-main truncate">{m.home_team}</span>
                        <span className="text-text-sec">–</span>
                        <span className="font-bold text-text-main truncate">{m.away_team}</span>
                        <TeamLogo name={m.away_team} logo={m.away_logo} size={40} />
                      </div>
                      <div className="text-text-sec text-sm">{longDate(m.date)}{m.time && `, ${m.time}`}{m.stadium && ` · ${m.stadium}`}</div>
                      {(m.ticket_price || m.ticket_note) && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                          {m.ticket_price && <span className="rounded-md bg-bg-card border border-bg-border px-2.5 py-1 font-bold text-text-main">{m.ticket_price}</span>}
                          {m.ticket_note && <span className="text-text-sec">{m.ticket_note}</span>}
                        </div>
                      )}
                    </div>
                    <a href={m.ticket_url || `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className="btn-fx led-border bg-accent text-on-accent font-bold text-sm px-6 py-3 rounded-xl text-center whitespace-nowrap">
                      {m.ticket_url ? 'Bilet al' : 'Bilet sifariş et'}
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
