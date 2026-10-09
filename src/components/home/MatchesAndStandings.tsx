'use client';
import SectionHeading from '@/components/SectionHeading';
import StandingsBoard from '@/components/StandingsBoard';

export default function MatchesAndStandings() {
  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <SectionHeading title="Turnir cədvəli" href="/standings" linkText="Bütün nəticələr" center />
        <StandingsBoard matchLimit={8} />
      </div>
    </section>
  );
}
