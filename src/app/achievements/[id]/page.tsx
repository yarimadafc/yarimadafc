import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

export default async function AchievementDetail({ params }: { params: { id: string } }) {
  const { data: item } = await supabase.from('achievements').select('*').eq('id', params.id).single();
  
  if (!item) {
    notFound();
  }

  return (
    <div className="bg-[#000000] min-h-screen pt-[140px] pb-24 font-sans text-gray-200">
      <div className="container mx-auto px-4 lg:px-8">
        <Link href="/" className="inline-flex items-center text-[#d7bf7b] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors mb-8">
          &larr; Ana Səhifəyə Qayıt
        </Link>
        
        <div className="max-w-3xl mx-auto bg-[#141414] rounded-3xl p-8 md:p-12 border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/5 rounded-bl-full blur-3xl -z-10"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 bg-[#000000] rounded-2xl border-2 border-gray-700 flex items-center justify-center p-4 shadow-inner">
              {item.image_url ? (
                 <img src={item.image_url} alt={item.title} className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
              ) : (
                 <div className="text-[#d7bf7b] font-black text-6xl">🏆</div>
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Nailiyyət Dəyəri</div>
              <h1 className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-xl tabular-nums">{item.count}</h1>
              <h2 className="text-2xl md:text-3xl font-black text-[#d7bf7b] uppercase tracking-wider mb-6 leading-tight">{item.title}</h2>
              
              <div className="w-16 h-1 bg-gray-700 mx-auto md:mx-0 mb-6"></div>
              
              <div className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {item.description || 'Bu nailiyyət haqqında əlavə məlumat qeyd edilməyib.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
