'use client';
import { motion } from 'framer-motion';

export default function CoachesPage() {
  const coaches = [
    { id: 1, name: 'Elnur Cəlilov', role: 'Baş Məşqçi (U-12)', license: 'UEFA B', experience: '10 İl', bio: 'Gənc istedadların kəşfi və inkişafında böyük rolu var.', image: '/placeholder-coach.jpg' },
    { id: 2, name: 'Ramil Həsənov', role: 'Məşqçi (U-11)', license: 'UEFA C', experience: '6 İl', bio: 'Taktiki analiz və uşaq psixologiyası üzrə mütəxəssis.', image: '/placeholder-coach.jpg' },
    { id: 3, name: 'Cavid Quliyev', role: 'Məşqçi (U-10)', license: 'UEFA C', experience: '5 İl', bio: 'Texniki bacarıqların formalaşmasına xüsusi diqqət ayırır.', image: '/placeholder-coach.jpg' },
    { id: 4, name: 'Emin Kərimov', role: 'Məşqçi (U-9)', license: 'AFFA C', experience: '3 İl', bio: 'Yeni başlayan uşaqlara futbolu sevdirən təcrübəli kadr.', image: '/placeholder-coach.jpg' },
  ];

  return (
    <div className="pt-24 min-h-screen bg-[#0a1423] pb-20">
      
      {/* Header */}
      <div className="w-full bg-[#152741] py-16 md:py-24 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
          >
            MƏŞQÇİLƏR <span className="text-[#d7bf7b]">HEYƏTİ</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#d7bf7b] mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Gələcəyin ulduzlarını yetişdirən, yüksək lisenziyalı və təcrübəli məşqçi heyətimizlə tanış olun.
          </p>
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="container mx-auto px-4 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {coaches.map((coach, i) => (
            <motion.div 
              key={coach.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#152741] border border-gray-800 rounded-3xl overflow-hidden hover:border-[#d7bf7b]/50 transition-all duration-300 shadow-xl group"
            >
              <div className="w-full h-72 bg-[#0d1a2d] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#152741] to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </div>
              </div>
              
              <div className="p-6 relative z-20 -mt-10">
                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-1">{coach.name}</h3>
                <p className="text-[#d7bf7b] font-bold text-xs uppercase tracking-widest mb-4">{coach.role}</p>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 h-16 line-clamp-3">
                  {coach.bio}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Lisenziya</span>
                    <span className="text-white text-sm font-bold">{coach.license}</span>
                  </div>
                  <div className="w-[1px] h-8 bg-gray-800"></div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Təcrübə</span>
                    <span className="text-white text-sm font-bold">{coach.experience}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
