// Make page completely dynamic to prevent static generation timeout build errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  let news = null;
  
  try {
    const res = await supabase.from('news').select('*').eq('slug', params.slug).single();
    if (res.data) news = res.data;
  } catch (e) {
    console.error(e);
  }

  // Fallback mock
  if (!news) {
    news = {
      title_az: 'Xəbər tapılmadı',
      content_az: 'Bu xəbər mövcud deyil və ya silinib.',
      published_at: new Date().toISOString(),
      category: 'Klub xəbərləri',
      author: '',
      image_url: ''
    };
  }

  return (
    <main className="flex-grow pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="inline-block px-3 py-1 bg-[#00e5a0]/10 text-[#00e5a0] font-mono text-sm uppercase tracking-widest rounded-full mb-6">
            {news.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#0a1628] uppercase tracking-wide mb-6">
            {news.title_az}
          </h1>
          <div className="text-gray-500 font-mono">
            {new Date(news.published_at).toLocaleDateString('az-AZ')}
            {news.author && ` • ${news.author}`}
          </div>
        </header>

        {news.image_url ? (
          <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-12">
            <Image src={news.image_url} alt={news.title_az} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-full h-[300px] bg-gray-200 rounded-3xl mb-12 flex items-center justify-center">
            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: news.content_az || '' }} />
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <Link href="/xeberler" className="inline-block px-8 py-4 bg-[#0a1628] text-white rounded-full font-bold hover:bg-[#0a1628]/90 transition-colors">
            Xəbərlərə Qayıt
          </Link>
        </div>
      </article>
    </main>
  );
}
