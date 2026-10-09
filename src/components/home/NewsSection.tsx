'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SectionHeading from '@/components/SectionHeading';
import { timeAgo } from '@/lib/matchUtils';

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
          .limit(7);
        setNews(!error && data ? data : []);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <section className="container mx-auto px-4 lg:px-8 py-14 md:py-20">
      <SectionHeading title="Xəbərlər" href="/news" linkText="Bütün xəbərlər" />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5" aria-hidden>
          {[0, 1, 2, 3].map(i => <div key={i} className={`h-72 rounded-xl bg-bg-sec animate-pulse ${i === 0 ? 'md:col-span-2' : ''}`} />)}
        </div>
      ) : news.length === 0 ? (
        <div className="rounded-xl border border-bg-border bg-bg-sec py-16 text-center text-text-sec">Hələlik xəbər yoxdur.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {news.map((item, i) => {
            const big = i === 0;
            return (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className={`group flex flex-col bg-bg-sec rounded-xl overflow-hidden border border-transparent hover:border-bg-border hover:bg-bg-card transition-colors ${big ? 'md:col-span-2' : ''}`}
              >
                <div className={`relative w-full overflow-hidden bg-bg-card ${big ? 'aspect-[16/9] md:aspect-[2/1]' : 'aspect-[16/10]'}`}>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title_az || ''} loading={i < 2 ? 'eager' : 'lazy'} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="border border-bg-border text-text-main px-3 py-1 rounded-md text-xs font-semibold">{item.category || 'Klub'}</span>
                    <span className="text-text-sec text-sm">{timeAgo(item.created_at)}</span>
                  </div>
                  <h3 className={`text-text-main font-bold leading-snug mb-5 line-clamp-3 ${big ? 'text-xl md:text-2xl' : 'text-lg'}`}>{item.title_az || item.title}</h3>
                  <div className="mt-auto flex justify-between items-center border-t border-bg-border pt-4 text-text-main text-sm font-medium">
                    <span>Daha ətraflı</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
