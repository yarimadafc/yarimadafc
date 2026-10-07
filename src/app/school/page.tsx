import PageTransition from '@/components/PageTransition';

export default function Page() {
  return (
    <PageTransition title="FUTBOL MƏKTƏBİ">
      <div className="h-96 border-2 border-dashed border-bg-border flex items-center justify-center rounded-2xl">
        <p className="text-text-sec font-bold text-xl uppercase tracking-widest">FUTBOL MƏKTƏBİ modulu tezliklə...</p>
      </div>
    </PageTransition>
  );
}
