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
          .limit(5); // Fetch 5 items (1 big + 4 small)

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
    <section className="container mx-auto px-4 lg:px-8 py-16 bg-transparent overflow-hidden relative z-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex justify-between items-end mb-8 border-b border-[#1f1f1f] pb-4"
      >
        <div className="relative">
          <div className="absolute -top-4 left-0 w-8 h-[2px] bg-[#d7bf7b]"></div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Xəbərlər</h2>
        </div>
        <Link 
          href="/news" 
          className="text-white font-medium text-sm border-b border-transparent hover:border-white transition-colors"
        >
          Bütün xəbərlər
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {news.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className={i === 0 ? "lg:col-span-2" : "col-span-1"}
          >
            <Link href={`/news/${item.id}`} className="group flex flex-col h-full bg-[#141414] rounded-lg overflow-hidden hover:bg-[#1a1a1a] transition-all duration-300">
              {/* Image Box */}
              <div className={`relative w-full overflow-hidden ${i === 0 ? 'aspect-video' : 'aspect-[4/3]'}`}>
                 {item.image_url && item.image_url !== '/placeholder-news-1.jpg' ? (
                   <img src={item.image_url} alt={item.title_az || item.title} className={`absolute inset-0 w-full h-full ${i === 0 ? 'object-cover' : 'object-cover'} group-hover:scale-105 transition-transform duration-700 ease-in-out`} />
                 ) : (
                   <div className="absolute inset-0 bg-[#1a1a1a] group-hover:scale-105 transition-transform duration-700 ease-in-out"></div>
                 )}
              </div>
              
              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-gray-300 border border-gray-600 px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase">
                    {item.category || 'Klub'}
                  </span>
                  <span className="text-gray-500 font-medium text-[11px]">
                    {item.date || (item.created_at ? (new Date(item.created_at).getDate().toString().padStart(2, '0') + '.' + (new Date(item.created_at).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date(item.created_at).getFullYear()) : 'Yeni')}
                  </span>
                </div>
                
                <h3 className={`text-white font-bold leading-snug mb-4 group-hover:text-[#d7bf7b] transition-colors ${i === 0 ? 'text-lg md:text-xl' : 'text-sm'}`}>
                  {item.title_az || item.title}
                </h3>
                
                <div className="mt-auto flex justify-between items-center text-gray-400 group-hover:text-[#d7bf7b] border-t border-[#1f1f1f] pt-3 pb-1">
                  <span className="font-medium text-xs">Daha ətraflı</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
