import PageTransition from '@/components/PageTransition';

export default function NewsDetailPage() {
  return (
    <PageTransition title="XƏBƏR DETALI">
      <div className="h-96 border-2 border-dashed border-gray-800 flex items-center justify-center rounded-2xl">
        <p className="text-gray-500 font-bold text-xl uppercase tracking-widest">Xəbər məzmunu yüklənir...</p>
      </div>
    </PageTransition>
  );
}
