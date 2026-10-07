'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowRight } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Bütün');

  useEffect(() => {
    async function loadNews() {
      const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (data) setNews(data);
      setLoading(false);
    }
    loadNews();
  }, []);

  const categories = ['Bütün', 'Əsas Komanda', 'Akademiya', 'Rəsmi'];

  const filteredNews = activeCategory === 'Bütün' ? news : news.filter(n => n.category === activeCategory);

  return (
    <div className="pt-[140px] min-h-screen bg-[#0d1a2d] pb-20">
      {/* Header */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-white tracking-tight mb-8 border-b border-[#1c2d47] pb-4"
        >
          <div className="relative inline-block">
            <div className="absolute -top-4 left-0 w-8 h-[2px] bg-[#d7bf7b]"></div>
            Xəbərlər
          </div>
        </motion.h1>
      </div>

      {/* Filter Categories */}
      <div className="container mx-auto px-4 lg:px-8 mt-4 mb-8">
        <div className="flex flex-wrap items-center gap-4 border-b border-[#1c2d47] pb-6">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${activeCategory === cat ? 'text-[#d7bf7b] border-b-2 border-[#d7bf7b]' : 'text-gray-400 hover:text-white'} font-medium text-sm pb-1 transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="container mx-auto px-4 lg:px-8">
        {loading ? (
           <div className="text-center py-20 text-[#d7bf7b] font-medium text-sm">Yüklənir...</div>
        ) : filteredNews.length === 0 ? (
           <div className="text-center py-20 text-gray-500 font-medium text-sm">Bu kateqoriyada xəbər tapılmadı.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredNews.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/news/${item.id}`} className="group flex flex-col h-full bg-[#152741] rounded-lg overflow-hidden hover:bg-[#1a2e4c] transition-all duration-300">
                  <div className="w-full aspect-[4/3] bg-[#0a1423] relative overflow-hidden">
                    <img src={item.image_url || '/placeholder-news-1.jpg'} alt={item.title_az} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-gray-300 border border-gray-600 px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase">
                        {item.category || 'Xəbərlər'}
                      </span>
                      <span className="text-gray-500 font-medium text-[11px]">
                        {item.date || (new Date(item.created_at).getDate().toString().padStart(2, '0') + '.' + (new Date(item.created_at).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date(item.created_at).getFullYear())}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-sm leading-snug mb-4 group-hover:text-[#d7bf7b] transition-colors">{item.title_az}</h3>
                    
                    <div className="mt-auto flex justify-between items-center text-gray-400 group-hover:text-[#d7bf7b] border-t border-[#1c2d47] pt-3 pb-1">
                      <span className="font-medium text-xs">Daha ətraflı</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
