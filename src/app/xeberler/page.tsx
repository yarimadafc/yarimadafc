import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'



export default async function XeberlerPage({
  searchParams
}: {
  searchParams: { cat?: string }
}) {
  const currentCategory = searchParams.cat || 'all';
  let news = [];

  try {
    let query = supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });
      
    if (currentCategory !== 'all') {
      query = query.eq('category', currentCategory);
    }
      
    const { data, error } = await query;
    if (data && !error && data.length > 0) news = data;
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  const categories = ['Transfer', 'Əsas Komanda', 'Akademiya', 'Klub'];

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#0a1628] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-center mb-12">
          Xəbərlər
        </h1>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Link 
            href="/xeberler"
            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${
              currentCategory === 'all' 
                ? 'bg-[#0a1628] text-[#c9a84c]' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Bütün Xəbərlər
          </Link>
          {categories.map(cat => (
            <Link 
              key={cat}
              href={`/xeberler?cat=${cat}`}
              className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${
                currentCategory === cat 
                  ? 'bg-[#0a1628] text-[#c9a84c]' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
              <div className="h-48 bg-gray-200 relative">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                    <span className="uppercase tracking-widest text-sm font-bold">Şəkil yoxdur</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-[#c9a84c] text-[#0a1628] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                  {item.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="font-mono text-sm text-gray-500 mb-2">{item.published_at}</span>
                <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-[#0a1628]/80 transition-colors">
                  <Link href={`/xeberler/${item.slug}`}>
                    {item.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-grow">
                  {item.excerpt}
                </p>
                <Link 
                  href={`/xeberler/${item.slug}`}
                  className="inline-block border-b-2 border-[#c9a84c] text-[#0a1628] font-bold uppercase tracking-wider text-sm pb-1 w-max hover:text-[#c9a84c] transition-colors"
                >
                  Ətraflı Oxu →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
