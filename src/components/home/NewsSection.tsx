import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function NewsSection() {
  const dummyNews = [
    {
      id: 1,
      category: 'Klub',
      date: '1 gün əvvəl',
      title: 'YARIMADA FK YENİ MÖVSÜMƏ BÖYÜK ÜMİDLƏRLƏ BAŞLAYIR',
      image: '/placeholder-news-1.jpg',
    },
    {
      id: 2,
      category: 'Akademiya',
      date: '2 gün əvvəl',
      title: 'U-19 KOMANDAMIZ MÜHÜM QƏLƏBƏ QAZANDI',
      image: '/placeholder-news-2.jpg',
    },
    {
      id: 3,
      category: 'Fanat',
      date: '3 gün əvvəl',
      title: 'AZARKEŞLƏR ÜÇÜN YENİ ABONEMENTLƏR SATIŞA ÇIXARILDI',
      image: '/placeholder-news-3.jpg',
    },
    {
      id: 4,
      category: 'Klub',
      date: '4 gün əvvəl',
      title: 'BAŞ MƏŞQÇİ İLƏ YENİ MÜQAVİLƏ İMZALANDI',
      image: '/placeholder-news-4.jpg',
    },
  ];

  return (
    <section className="container mx-auto px-4 lg:px-8 py-20 bg-[#06101e]">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div className="relative">
          <div className="absolute -top-4 left-0 w-8 h-[2px] bg-[#d7bf7b]"></div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Xəbərlər</h2>
        </div>
        <Link 
          href="/preview/news" 
          className="text-white font-bold text-[13px] tracking-widest border-b-2 border-[#d7bf7b] pb-1 hover:text-[#d7bf7b] transition-colors uppercase"
        >
          Bütün xəbərlər
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dummyNews.map((news) => (
          <Link href={`/preview/news/${news.id}`} key={news.id} className="group flex flex-col h-full bg-[#0a1628] rounded-2xl overflow-hidden hover:transform hover:-translate-y-1 transition-all duration-300">
            {/* Image Box */}
            <div className="relative w-full aspect-[4/3] bg-gray-800 overflow-hidden">
               {/* Hələlik şəkillər yoxdur deyə boz fon göstəririk, Image əlavə olunduqda bura çıxacaq */}
               <div className="absolute inset-0 bg-gray-800 group-hover:scale-105 transition-transform duration-500"></div>
            </div>
            
            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-[#d7bf7b] font-bold text-[11px] tracking-widest uppercase">
                  {news.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="text-gray-400 font-medium text-[11px] tracking-wider uppercase">
                  {news.date}
                </span>
              </div>
              
              <h3 className="text-white font-bold text-lg leading-tight mb-6 group-hover:text-[#d7bf7b] transition-colors">
                {news.title}
              </h3>
              
              <div className="mt-auto flex items-center space-x-2 text-[#d7bf7b]">
                <span className="font-bold text-[11px] tracking-widest uppercase">Daha ətraflı</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
