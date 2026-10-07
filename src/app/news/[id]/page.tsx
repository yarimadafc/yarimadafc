'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewsArticlePage() {
  const params = useParams();
  const id = params.id;
  const [news, setNews] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      if (!id) return;
      const { data } = await supabase.from('news').select('*').eq('id', id).single();
      if (data) {
        setNews(data);
        // Fetch recommended
        const { data: recData } = await supabase.from('news').select('*').neq('id', id).limit(3).order('created_at', { ascending: false });
        if (recData) setRecommended(recData);
      }
      setLoading(false);
    }
    loadNews();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-[140px] min-h-screen bg-[#000000] pb-20 flex justify-center">
        <div className="text-[#d7bf7b] font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="pt-[140px] min-h-screen bg-[#000000] pb-20 flex justify-center">
        <div className="text-red-400 font-bold tracking-widest uppercase">Xəbər tapılmadı</div>
      </div>
    );
  }

  return (
    <div className="pt-[140px] min-h-screen bg-[#000000] pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        
        <Link href="/news" className="text-[#d7bf7b] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors mb-8 inline-flex items-center">
          ← Bütün Xəbərlər
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#141414] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl p-6 md:p-12"
        >
          <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-6">
            <div className="flex items-center space-x-4">
              <span className="text-[#d7bf7b] text-sm font-bold uppercase tracking-widest">{news.category || 'Xəbərlər'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">{(new Date(news.created_at).getDate().toString().padStart(2, '0') + '.' + (new Date(news.created_at).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date(news.created_at).getFullYear())}</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-8">
            {news.title_az}
          </h1>

          {/* Small Image */}
          <div className="w-full max-w-3xl mx-auto aspect-video md:h-[400px] bg-black rounded-2xl overflow-hidden mb-10 shadow-lg relative">
            <img src={news.image_url || '/placeholder-news-1.jpg'} alt={news.title_az} className="absolute inset-0 w-full h-full object-cover" />
          </div>

          <div className="prose prose-invert max-w-none text-gray-300">
            {news.content_az?.split('\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="leading-relaxed mb-6 text-lg font-medium text-gray-200">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Recommended News */}
        {recommended.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-8 border-l-4 border-[#d7bf7b] pl-4">Önərilən Xəbərlər</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommended.map(item => (
                <Link href={"/news/" + item.id} key={item.id} className="group bg-[#141414] border border-gray-800 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform">
                  <div className="h-40 bg-black relative">
                     <img src={item.image_url} alt={item.title_az} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-bold text-sm line-clamp-2 group-hover:text-[#d7bf7b] transition-colors">{item.title_az}</h4>
                    <span className="text-gray-500 text-[10px] uppercase font-bold mt-2 block">{(new Date(item.created_at).getDate().toString().padStart(2, '0') + '.' + (new Date(item.created_at).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date(item.created_at).getFullYear())}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
