'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ClubPage() {
  const leadership = [
    { name: 'Nağı Əliyev', role: 'Klubun Təsisçisi və Rəhbəri', image: '/Logo.JPG.jpeg' },
    { name: 'Əhməd Məmmədov', role: 'İdman Direktoru', image: '/Logo.JPG.jpeg' },
    { name: 'Elvin Qasımov', role: 'Baş Koordinator', image: '/Logo.JPG.jpeg' },
  ];

  const values = [
    { title: 'MİSSİYAMIZ', desc: 'Uşaq və gənclərə sağlam həyat tərzini aşılamaq, onlarda daxili intizam, liderlik və kollektivdə işləmək bacarıqlarını inkişaf etdirmək.' },
    { title: 'VİZYONUMUZ', desc: 'Azərbaycanın ən böyük və peşəkar uşaq futbol akademiyalarından birinə çevrilərək, milli komandalara və peşəkar klublara davamlı oyunçu yetişdirmək.' },
    { title: 'DƏYƏRLƏRİMİZ', desc: 'Hörmət, Dürüstlük, Əzmkarlıq və Sağlam Rəqabət. Biz təkcə yaxşı futbolçu deyil, həm də layiqli vətəndaş yetişdiririk.' }
  ];

  return (
    <div className="pt-24 min-h-screen bg-[#0a1423] pb-20">
      
      {/* 1. Page Header */}
      <div className="w-full bg-[#152741] py-16 md:py-24 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder-hero.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
          >
            Yarımada <span className="text-[#d7bf7b]">FK</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#d7bf7b] mx-auto"
          ></motion.div>
        </div>
      </div>

      {/* 2. Haqqımızda & Tarix */}
      <div className="container mx-auto px-4 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-[#d7bf7b] font-bold tracking-widest text-sm uppercase">Haqqımızda</span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
              Gələcəyin Çempionları <br /> Burada Yetişir
            </h2>
            <p className="text-gray-400 leading-relaxed font-medium">
              Yarımada Futbol Klubu uşaq və gənclər futbolunun inkişafı, onlarda idmana sevgi yaratmaq məqsədilə təsis edilmişdir. Yarandığı gündən etibarən klubumuz qısa zamanda böyük uğurlara imza atmış və bir çox istedadlı gəncləri üzə çıxarmışdır. 
            </p>
            <p className="text-gray-400 leading-relaxed font-medium">
              Bizim üçün hər bir uşaq gələcəyin ulduzudur. Mütəxəssis məşqçilərimiz tərəfindən tətbiq olunan xüsusi inkişaf proqramları ilə futbolçularımızın həm fiziki, həm də psixoloji cəhətdən tam hazırlıqlı olmasını təmin edirik.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[#152741] flex items-center justify-center">
               <span className="text-gray-600 font-bold uppercase tracking-widest text-sm">Klub Şəkli</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. Missiya, Vizyon, Dəyərlər */}
      <div className="container mx-auto px-4 lg:px-8 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div 
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-[#152741] p-8 rounded-2xl border border-gray-800 hover:border-[#d7bf7b]/50 transition-colors shadow-xl group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0a1423] border border-[#d7bf7b]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="w-4 h-4 bg-[#d7bf7b] rounded-sm transform rotate-45"></div>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">{v.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Rəhbərlik */}
      <div className="container mx-auto px-4 lg:px-8 mt-32">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#d7bf7b] font-bold tracking-widest text-sm uppercase mb-2 block">İdarə Heyəti</span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Klub Rəhbərliyi</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {leadership.map((person, i) => (
            <motion.div 
              key={person.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-[#152741] rounded-2xl overflow-hidden border border-gray-800 flex flex-col items-center text-center shadow-2xl group"
            >
              <div className="w-full h-64 bg-[#0a1423] relative overflow-hidden border-b border-gray-800">
                <Image src={person.image} alt={person.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
              </div>
              <div className="p-8 w-full">
                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-1">{person.name}</h3>
                <p className="text-[#d7bf7b] font-bold text-xs uppercase tracking-widest">{person.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. Nailiyyətlər (Achievements module reused or custom) */}
      <div className="container mx-auto px-4 lg:px-8 mt-32 bg-[#112240] rounded-3xl p-8 md:p-16 border border-[#d7bf7b]/20 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#d7bf7b]/5 rounded-full blur-3xl"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">Uğurlarımız & Nailiyyətlər</h2>
          <p className="text-gray-300 max-w-2xl font-medium leading-relaxed mb-8">
            Kısa zaman ərzində qazandığımız medallar, kuboklar və çempionluqlar klubumuzun inkişafının və məşqçilərimizin zəhmətinin bariz nümunəsidir. Uşaq futbolunda yeni standartlar müəyyən etməkdə davam edirik.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#0a1423] border border-gray-800 p-6 rounded-xl text-center">
              <div className="text-4xl font-black text-[#d7bf7b] mb-2">15+</div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Kubok</div>
            </div>
            <div className="bg-[#0a1423] border border-gray-800 p-6 rounded-xl text-center">
              <div className="text-4xl font-black text-[#d7bf7b] mb-2">200+</div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Oyunçu</div>
            </div>
            <div className="bg-[#0a1423] border border-gray-800 p-6 rounded-xl text-center">
              <div className="text-4xl font-black text-[#d7bf7b] mb-2">5</div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Yaş Qrupu</div>
            </div>
            <div className="bg-[#0a1423] border border-gray-800 p-6 rounded-xl text-center">
              <div className="text-4xl font-black text-[#d7bf7b] mb-2">8+</div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Məşqçi</div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
