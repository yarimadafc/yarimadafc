import PageTransition from '@/components/PageTransition';

export default function VideoDetailPage() {
  return (
    <PageTransition title="VİDEO İZLƏ">
      <div className="h-[600px] bg-black flex items-center justify-center rounded-2xl">
        <p className="text-white font-bold text-xl uppercase tracking-widest">Video pleyeri yüklənir...</p>
      </div>
    </PageTransition>
  );
}
