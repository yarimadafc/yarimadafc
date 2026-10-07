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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      if (!id) return;
      const { data } = await supabase.from('news').select('*').eq('id', id).single();
      if (data) setNews(data);
      setLoading(false);
    }
    loadNews();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-[#0a1423] pb-20 flex justify-center">
        <div className="text-[#d7bf7b] font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="pt-32 min-h-screen bg-[#0a1423] pb-20 flex justify-center">
        <div className="text-red-400 font-bold tracking-widest uppercase">Xəbər tapılmadı</div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#0a1423] pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        
        <Link href="/news" className="text-[#d7bf7b] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors mb-8 inline-flex items-center">
          ← Geri Qayıt
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#152741] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl"
        >
          {/* Article Header Image */}
          <div className="w-full h-[300px] md:h-[450px] bg-[#0d1a2d] relative">
            <img src={news.image_url || '/placeholder-news-1.jpg'} alt={news.title_az} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#152741] via-[#152741]/20 to-transparent z-10"></div>
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20">
              <span className="bg-[#d7bf7b] text-[#152741] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-sm shadow-lg mb-4 inline-block">
                {news.category || 'Xəbərlər'}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-12">
            <div className="flex items-center space-x-4 mb-6 border-b border-gray-800 pb-6">
              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">{new Date(news.created_at).toLocaleDateString('az-AZ')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d7bf7b]"></span>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Müəllif: Mətbuat Xidməti</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
              {news.title_az}
            </h1>

            <div className="prose prose-invert max-w-none text-gray-300">
              {news.content_az?.split('\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="leading-relaxed mb-6 font-medium text-gray-200">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Share & Tags */}
            <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
              <div className="flex space-x-3 mb-4 md:mb-0">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mr-2 flex items-center">Teqlər:</span>
                <span className="bg-[#0a1423] border border-gray-800 text-gray-400 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full">#{news.category?.replace(/\s+/g, '') || 'Klub'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Paylaş:</span>
                {/* Social icons */}
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#0a1423] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#d7bf7b] transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#0a1423] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#d7bf7b] transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.889v1.111h3l-.238 3h-2.762v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
