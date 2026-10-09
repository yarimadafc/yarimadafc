import MatchesShell from '@/components/MatchesShell';
import StandingsBoard from '@/components/StandingsBoard';

export const metadata = { title: 'Turnir cədvəli | Yarımada FK' };

export default function StandingsPage() {
  return (
    <MatchesShell active="standings">
      <StandingsBoard matchLimit={12} />
    </MatchesShell>
  );
}
