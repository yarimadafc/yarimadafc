import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

const MOCK_ARTICLE = {
  slug: 'yeni-transfer',
  title: 'Yarımada FK yeni transferini təqdim etdi',
  content: 'Klubumuz hücum xəttini gücləndirmək məqsədilə gənc və istedadlı hücumçu ilə müqavilə imzaladı. \n\nYeni oyunçumuz əvvəlki komandasında göstərdiyi yüksək performansla diqqət çəkmişdi. Baş məşqçimiz bu transferin komandaya böyük fayda verəcəyinə inanır. \n\nTərəfdarlarımızı yeni transferimizi salamlamağa və qarşıdan gələn oyunlarda dəstəkləməyə çağırırıq.',
  published_at: '2026-10-02',
  author: 'Klubun Mətbuat Xidməti',
  image_url: null,
  category: 'Transfer'
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Mock metadata, ideally fetch title
  return {
    title: `Xəbər | Yarımada FK`,
  }
}

export default async function XeberDetaliPage({ params }: { params: { slug: string } }) {
  let article = MOCK_ARTICLE;

  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', params.slug)
      .single();
      
    if (data && !error) article = data;
  } catch (error) {
    console.error("Error fetching news article:", error);
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#0a1628] pt-24 pb-12">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-[#00e5a0] text-[#0a1628] px-3 py-1 rounded text-sm font-bold uppercase tracking-wider mb-4">
            {article.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wide mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-500 font-mono text-sm">
            <span>📅 {article.published_at}</span>
            <span>✍️ {article.author}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full h-[400px] md:h-[500px] bg-gray-200 rounded-xl relative mb-12 overflow-hidden shadow-md">
          {article.image_url ? (
            <Image src={article.image_url} alt={article.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <span className="text-6xl mb-4">📸</span>
              <span className="uppercase tracking-widest font-bold">Xəbər Şəkli</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
            {article.content}
          </div>
          
          {/* Share */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4">
            <span className="font-bold uppercase tracking-wider text-sm">Paylaş:</span>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity">f</button>
              <button className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:opacity-80 transition-opacity">t</button>
              <button className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity">w</button>
            </div>
          </div>
        </div>
        
        {/* Back Link */}
        <div className="text-center">
          <Link 
            href="/xeberler"
            className="inline-block bg-[#0a1628] text-white px-8 py-3 rounded-md font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            ← Bütün Xəbərlərə Qayıt
          </Link>
        </div>
      </article>
    </main>
  );
}
