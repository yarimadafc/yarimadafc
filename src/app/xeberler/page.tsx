export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams.category || 'all';

  let news: any[] = [];
  try {
    let q = supabase.from('news').select('*').eq('published', true).order('published_at', { ascending: false });
    if (activeCategory !== 'all') {
      q = q.eq('category', activeCategory);
    }
    const res = await q;
    if (res.data) news = res.data;
  } catch (error) {
    console.error('Error fetching news:', error);
  }

  // Mock data removed


  const categories = [
    { id: 'all', name: 'Bütün Xəbərlər' },
    { id: 'Klub xəbərləri', name: 'Klub xəbərləri' },
    { id: 'Akademiya', name: 'Akademiya' },
    { id: 'Oyun xəbərləri', name: 'Oyun xəbərləri' },
    { id: 'Turnirlər', name: 'Turnirlər' },
    { id: 'Məşqlər', name: 'Məşqlər' }
  ];

  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)] pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      
      {/* HERO */}
      <div className="relative rounded-[2rem] overflow-hidden min-h-[15vh] flex flex-col justify-end p-6 md:p-8 bg-[#0a1628] mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0" />
        <div className="relative z-10 max-w-4xl">
          <FadeIn>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">MEDİA</p>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black font-condensed uppercase tracking-normal text-white leading-[0.85] drop-shadow-xl">
              XƏBƏRLƏR
            </h1>
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={0.1}>
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* CATEGORIES SIDEBAR */}
          <div className="w-full md:w-64 shrink-0">
            <h3 className="font-black font-condensed text-2xl uppercase tracking-widest mb-6 border-b border-[var(--ks-ink)]/10 pb-4">Kateqoriyalar</h3>
            <ul className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
              {categories.map(cat => (
                <li key={cat.id} className="shrink-0">
                  <Link 
                    href={`/xeberler?category=${cat.id}`}
                    className={`block px-4 py-3 rounded-xl font-bold transition-all ${activeCategory === cat.id ? 'bg-[var(--ks-ink)] text-[var(--ks-kinpaku)]' : 'bg-[var(--ks-paper-deep)] hover:bg-gray-200 text-gray-500 hover:text-[var(--ks-ink)]'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWS GRID */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {news.map((item, idx) => (
                <Link key={idx} href={`/xeberler/${item.slug || item.id}`} className="group flex flex-col bg-[var(--ks-paper-deep)] rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                  <div className="aspect-[16/9] bg-gray-200 overflow-hidden relative">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628]/5 group-hover:bg-[#0a1628]/10 transition-colors">
                        <span className="font-black font-condensed text-3xl text-gray-300 uppercase tracking-widest">YARIMADA FK</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-[var(--ks-kinpaku)] text-[#0a1628] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest shadow-sm">
                      {item.category || 'Xəbər'}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <p className="font-mono text-xs text-gray-400 mb-3">{new Date(item.published_at || Date.now()).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <h2 className="text-2xl font-black font-condensed uppercase leading-tight mb-4 group-hover:text-[var(--ks-kinpaku-rich)] transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-500 mb-6 line-clamp-3 text-sm flex-1">
                      {item.excerpt}
                    </p>
                    <div className="mt-auto">
                      <span className="text-[var(--ks-ink)] font-bold text-sm uppercase tracking-widest border-b-2 border-transparent group-hover:border-[var(--ks-kinpaku-rich)] pb-1 transition-colors">
                        Ətraflı Oxu &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {news.length === 0 && (
              <div className="text-center py-20 text-gray-400 font-bold text-xl uppercase font-condensed tracking-widest">
                Bu kateqoriyada xəbər tapılmadı
              </div>
            )}
          </div>

        </div>
      </FadeIn>

    </main>
  );
}
