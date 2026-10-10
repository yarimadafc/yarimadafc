import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export const revalidate = 0;

export default async function AchievementDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: item } = await supabase.from('achievements').select('*').eq('id', id).maybeSingle();
  
  if (!item) {
    notFound();
  }

  return (
    <div className="bg-bg-deep min-h-screen pt-header pb-24 font-sans text-text-main">
      <div className="container">
        <Link href="/" className="btn-fx inline-flex items-center text-accent font-bold text-xs uppercase tracking-widest hover:text-text-main mb-8">
          &larr; Ana Səhifəyə Qayıt
        </Link>
        
        <div className="led-border bg-bg-sec rounded-3xl p-8 md:p-12 border border-bg-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-bl-full blur-3xl -z-10"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 bg-bg-deep rounded-2xl border-2 border-bg-border flex items-center justify-center p-4 shadow-inner">
              {item.image_url ? (
                 <img src={item.image_url} alt={item.title} className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
              ) : (
                 <Trophy className="w-20 h-20 text-text-sec" />
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="text-text-sec font-bold uppercase tracking-widest text-xs mb-2">Nailiyyət Dəyəri</div>
              <h1 className="text-5xl md:text-6xl font-black text-text-main mb-4 drop-shadow-xl tabular-nums">{item.count}</h1>
              <h2 className="text-2xl md:text-3xl font-black text-accent uppercase tracking-wider mb-6 leading-tight">{item.title}</h2>
              
              <div className="w-16 h-1 bg-bg-border mx-auto md:mx-0 mb-6"></div>
              
              <div className="text-text-sec leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {item.description || 'Bu nailiyyət haqqında əlavə məlumat qeyd edilməyib.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
