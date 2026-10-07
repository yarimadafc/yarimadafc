'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
    <div className="pt-[140px] min-h-screen bg-[#0a1423] pb-20">
      {/* Header */}
      <div className="w-full bg-[#152741] py-12 md:py-16 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-5 blur-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518605368461-1ee7e1c152d1?auto=format&fit=crop&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
          >
            KLUB <span className="text-[#d7bf7b]">XƏBƏRLƏRİ</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#d7bf7b] mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Klubumuzdakı ən son yeniliklər, oyun nəticələri və akademiya xəbərləri ilə ilk siz tanış olun.
          </p>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="container mx-auto px-4 lg:px-8 mt-12">
        <div className="flex flex-wrap items-center justify-center gap-4 border-b border-gray-800 pb-8">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${activeCategory === cat ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-white hover:text-[#d7bf7b] border border-gray-800'} font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="container mx-auto px-4 lg:px-8 mt-12">
        {loading ? (
           <div className="text-center py-20 text-[#d7bf7b] font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div>
        ) : filteredNews.length === 0 ? (
           <div className="text-center py-20 text-gray-500 font-bold tracking-widest uppercase">Bu kateqoriyada xəbər tapılmadı.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredNews.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/news/${item.id}`} className="group block h-full">
                  <div className="bg-[#152741] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#d7bf7b]/50 transition-all shadow-xl h-full flex flex-col">
                    <div className="w-full aspect-video bg-[#0d1a2d] relative overflow-hidden">
                      <img src={item.image_url || '/placeholder-news-1.jpg'} alt={item.title_az} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#152741] via-transparent to-transparent z-10"></div>
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-[#d7bf7b] text-[#152741] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-lg">
                          {item.category || 'Xəbərlər'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">{(new Date(item.created_at).getDate().toString().padStart(2, '0') + '.' + (new Date(item.created_at).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date(item.created_at).getFullYear())}</span>
                      <h3 className="text-white font-black text-xl leading-tight mb-3 group-hover:text-[#d7bf7b] transition-colors line-clamp-2">{item.title_az}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">{item.content_az}</p>
                      <div className="text-[#d7bf7b] text-[11px] font-black uppercase tracking-widest flex items-center group-hover:translate-x-2 transition-transform">
                        Ətraflı Oxu <span className="ml-2">→</span>
                      </div>
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
