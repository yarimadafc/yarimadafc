'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (!error && data && data.length > 0) {
          setNews(data);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) return null;

  return (
    <section className="container mx-auto px-4 lg:px-8 py-20 bg-[#0d1a2d] overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex justify-between items-end mb-12"
      >
        <div className="relative">
          <div className="absolute -top-4 left-0 w-8 h-[2px] bg-[#d7bf7b]"></div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Xəbərlər</h2>
        </div>
        <Link 
          href="/news" 
          className="text-white font-bold text-[13px] tracking-widest border-b-2 border-[#d7bf7b] pb-1 hover:text-[#d7bf7b] transition-colors uppercase"
        >
          Bütün xəbərlər
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <Link href={`/news/${item.id}`} className="group flex flex-col h-full bg-[#152741] rounded-2xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-black/20">
              {/* Image Box */}
              <div className="relative w-full aspect-video bg-gray-800 overflow-hidden">
                 {item.image_url && item.image_url !== '/placeholder-news-1.jpg' ? (
                   <img src={item.image_url} alt={item.title_az || item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                 ) : (
                   <div className="absolute inset-0 bg-gray-800 group-hover:scale-110 transition-transform duration-700 ease-in-out"></div>
                 )}
              </div>
              
              {/* Content */}
              <div className="p-4 md:p-5 flex flex-col flex-grow">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-[#d7bf7b] font-bold text-[11px] tracking-widest uppercase">
                    {item.category || 'Xəbər'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span className="text-gray-400 font-medium text-[11px] tracking-wider uppercase">
                    {item.date || (item.created_at ? (new Date(item.created_at).getDate().toString().padStart(2, '0') + '.' + (new Date(item.created_at).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date(item.created_at).getFullYear()) : 'Yeni')}
                  </span>
                </div>
                
                <h3 className="text-white font-bold text-sm md:text-base leading-snug line-clamp-2 mb-4 group-hover:text-[#d7bf7b] transition-colors">
                  {item.title_az || item.title}
                </h3>
                
                <div className="mt-auto flex items-center space-x-2 text-[#d7bf7b]">
                  <span className="font-bold text-[11px] tracking-widest uppercase">Daha ətraflı</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
