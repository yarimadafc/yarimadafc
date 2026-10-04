export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function NewsDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  let article: any = null;

  try {
    const res = await supabase.from('news').select('*').or(`slug.eq.${params.slug},id.eq.${params.slug}`).single();
    if (res.data) article = res.data;
  } catch (error) {
    console.error('Error fetching article:', error);
  }

  // Mock data removed


  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)] pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      <FadeIn>
        <Link href="/xeberler" className="text-gray-500 hover:text-[var(--ks-ink)] font-bold flex items-center gap-2 transition-colors mb-10">
          &larr; Bütün Xəbərlər
        </Link>

        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
            <span className="bg-[var(--ks-kinpaku)] text-[#0a1628] px-4 py-1 rounded-md text-sm font-bold uppercase tracking-widest shadow-sm">
              {article.category || 'Xəbər'}
            </span>
            <span className="font-mono text-sm text-gray-500">
              {new Date(article.published_at || Date.now()).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black font-condensed uppercase leading-[0.9] mb-6">
            {article.title}
          </h1>
          
          {article.author && (
            <p className="font-mono text-gray-500 uppercase tracking-widest text-sm">
              Müəllif: <span className="font-bold text-[var(--ks-ink)]">{article.author}</span>
            </p>
          )}
        </div>

        {/* MAIN IMAGE */}
        <div className="aspect-[16/9] md:aspect-[2/1] bg-[var(--ks-paper-deep)] rounded-[2rem] overflow-hidden mb-12 shadow-md relative">
          {article.image_url ? (
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628]/5 border border-gray-100 rounded-[2rem]">
              <span className="font-black font-condensed text-5xl text-gray-300 uppercase tracking-widest opacity-50">YARIMADA FK</span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="prose prose-xl max-w-none text-[var(--ks-ink)]/80 leading-relaxed font-medium">
          {article.content.split('\n').map((paragraph: string, i: number) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* SHARE BAR (Mock) */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex items-center gap-4">
          <span className="font-black font-condensed uppercase tracking-widest text-gray-400 text-xl">Paylaş:</span>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors">
            FB
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors">
            WP
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
            X
          </button>
        </div>

      </FadeIn>

    </main>
  );
}
