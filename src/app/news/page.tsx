'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { useLang } from '@/lib/i18n';
import { useFormat } from '@/lib/useFormat';
import { useSyncVersion } from '@/lib/siteSync';

export default function NewsPage() {
  const { loc } = useLang();
  const { ago } = useFormat();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Bütün');

  const sync = useSyncVersion();
  useEffect(() => {
    async function loadNews() {
      const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (data) setNews(data);
      setLoading(false);
    }
    loadNews();
  }, [sync]);

  const categories = ['Bütün', ...Array.from(new Set(news.map(n => n.category).filter(Boolean)))];

  const filteredNews = activeCategory === 'Bütün' ? news : news.filter(n => n.category === activeCategory);

  return (
    <div className="pt-header min-h-screen bg-bg-main pb-20">
      {/* Header */}
      <PageHero title="Xəbərlər" subtitle="Klubdan ən son xəbərlər, oyun icmalları və rəsmi açıqlamalar." />

      {/* Filter Categories */}
      <div className="container mt-4 mb-8">
        <div className="flex flex-wrap items-center gap-4 border-b border-bg-border pb-6">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${activeCategory === cat ? 'text-accent border-b-2 border-accent' : 'text-text-sec hover:text-text-main'} font-medium text-sm pb-1 transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="container">
        {loading ? (
           <div className="text-center py-20 text-accent font-medium text-sm">Yüklənir...</div>
        ) : filteredNews.length === 0 ? (
           <div className="text-center py-20 text-text-sec font-medium text-sm">Bu kateqoriyada xəbər tapılmadı.</div>
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
                <Link href={`/news/${item.id}`} className="group led-border led-hover card-fx flex flex-col h-full bg-bg-sec rounded-xl overflow-hidden hover:bg-bg-card">
                  <div className="w-full aspect-[4/3] bg-bg-deep relative overflow-hidden">
                    <img src={item.image_url || '/Logo.JPG.jpeg'} alt={loc(item, 'title')} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-text-sec border border-bg-border px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase">
                        {item.category || 'Xəbərlər'}
                      </span>
                      <span className="text-text-sec font-medium text-[11px]">
                        {ago(item.created_at)}
                      </span>
                    </div>
                    <h3 className="text-text-main font-bold text-sm leading-snug mb-4 group-hover:text-accent transition-colors">{loc(item, 'title')}</h3>
                    
                    <div className="mt-auto flex justify-between items-center text-text-sec group-hover:text-accent border-t border-bg-border pt-3 pb-1">
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
