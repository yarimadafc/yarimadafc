'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NewsPage() {
  const news = [
    { id: 1, title: 'Yarımada U-12 komandası çempion oldu!', date: '05 Oktyabr 2026', image: '/placeholder-news.jpg', excerpt: 'Gərgin keçən mövsümün sonunda U-12 komandamız Neftçi ilə qarşılaşmada 3-1 qalib gələrək kuboku qaldırdı.', category: 'Klub Xəbərləri' },
    { id: 2, title: 'Yeni məşqçi heyəti təqdim olundu', date: '01 Oktyabr 2026', image: '/placeholder-news.jpg', excerpt: 'Akademiyamızın inkişaf planı çərçivəsində daha 2 UEFA lisenziyalı məşqçi ilə müqavilə imzalandı.', category: 'Rəsmi' },
    { id: 3, title: 'Akademiyaya yeni qəbul başlayır', date: '28 Sentyabr 2026', image: '/placeholder-news.jpg', excerpt: '2016-2018 təvəllüdlü uşaqlar üçün seçimlər gələn həftə start götürəcək. İştirak üçün qeydiyyatdan keçməyi unutmayın.', category: 'Akademiya' },
  ];

  return (
    <div className="pt-24 min-h-screen bg-[#0a1423] pb-20">
      {/* Header */}
      <div className="w-full bg-[#152741] py-16 md:py-24 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder-hero.jpg')] bg-cover bg-center opacity-5 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
          >
            KLUB <span className="text-[#d7bf7b]">XƏBƏRLƏRİ</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#d7bf7b] mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Klubumuzdakı ən son yeniliklər, oyun nəticələri və akademiya xəbərləri ilə ilk siz tanış olun.
          </p>
        </div>
      </div>

      {/* Filter / Categories (Visual only for now) */}
      <div className="container mx-auto px-4 lg:px-8 mt-12">
        <div className="flex flex-wrap items-center justify-center gap-4 border-b border-gray-800 pb-8">
          <button className="bg-[#d7bf7b] text-[#152741] font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full">Bütün Xəbərlər</button>
          <button className="bg-[#152741] text-white hover:text-[#d7bf7b] border border-gray-800 font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors">Əsas Komanda</button>
          <button className="bg-[#152741] text-white hover:text-[#d7bf7b] border border-gray-800 font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors">Akademiya</button>
          <button className="bg-[#152741] text-white hover:text-[#d7bf7b] border border-gray-800 font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors">Rəsmi</button>
        </div>
      </div>

      {/* News Grid */}
      <div className="container mx-auto px-4 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/news/${item.id}`} className="group block h-full">
                <div className="bg-[#152741] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#d7bf7b]/50 transition-all shadow-xl h-full flex flex-col">
                  <div className="w-full h-56 bg-[#0d1a2d] relative overflow-hidden">
                    {/* Placeholder for image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#152741] to-transparent z-10"></div>
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-[#d7bf7b] text-[#152741] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-lg">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">{item.date}</span>
                    <h3 className="text-white font-black text-xl leading-tight mb-3 group-hover:text-[#d7bf7b] transition-colors">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{item.excerpt}</p>
                    <div className="text-[#d7bf7b] text-[11px] font-black uppercase tracking-widest flex items-center group-hover:translate-x-2 transition-transform">
                      Ətraflı Oxu <span className="ml-2">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
