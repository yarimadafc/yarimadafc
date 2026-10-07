'use client';
import { motion } from 'framer-motion';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

import { PlayCircle } from 'lucide-react';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);

  useEffect(() => {
    async function loadCoaches() {
      const { data } = await supabase.from('coaches').select('*, teams(name)').order('created_at', { ascending: false });
      if (data) setCoaches(data);
      
      const { data: cData } = await supabase.from('coach_courses').select('*').order('created_at', { ascending: false }).limit(3);
      if (cData) setRecommendedCourses(cData);
    }
    loadCoaches();
  }, []);

  return (
    <div className="pt-[140px] min-h-screen bg-[#0a1423] pb-20">
      
      {/* Header */}
      <div className="w-full bg-[#152741] py-12 md:py-16 border-b border-gray-800 relative overflow-hidden">
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
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
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

        </div>
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
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
              <Link href={`/coaches/${coach.id}`} className="block w-full h-72 bg-[#0d1a2d] relative overflow-hidden group-hover:opacity-90 transition-opacity">
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#152741] to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {coach.image_url ? (
                    <img src={coach.image_url} alt={coach.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <svg className="w-20 h-20 text-gray-700 relative z-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  )}
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

                </div>
              </Link>
              
              <div className="p-6 relative z-20 -mt-10">
                <Link href={`/coaches/${coach.id}`} className="hover:text-[#d7bf7b] transition-colors"><h3 className="text-xl font-black text-white uppercase tracking-widest mb-1">{coach.name}</h3></Link>
                <p className="text-[#d7bf7b] font-bold text-xs uppercase tracking-widest mb-4">{coach.role}</p>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 h-16 line-clamp-3">
                  {coach.teams ? `Aid olduğu komanda: ${coach.teams.name}` : 'Akademiya və Ümumi Məşqçi'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  
                  
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

                </div>
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

              </div>
            </motion.div>
          ))}
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

        </div>
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

      </div>

      {/* Recommended Courses Section */}
      {recommendedCourses.length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 mt-24">
          <div className="flex items-center space-x-4 mb-10">
            <span className="w-8 h-1 bg-[#d7bf7b]"></span>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Önərilən Məşqçi Kursları</h2>
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedCourses.map((course, i) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/courses/${course.id}`} className="block h-full group cursor-pointer bg-[#152741] rounded-3xl overflow-hidden border border-gray-800 hover:border-[#d7bf7b]/50 transition-colors shadow-xl hover:shadow-2xl flex flex-col">
                  <div className="relative aspect-video overflow-hidden shrink-0">
                    <img 
                      src={course.image_url || '/placeholder-hero.jpg'} 
                      alt={course.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                       {course.video_url && <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-[#d7bf7b] group-hover:scale-110 transition-all duration-300" />}
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

                    </div>
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#d7bf7b] transition-colors">{course.title}</h3>
                    <p className="text-gray-400 text-xs md:text-sm line-clamp-2 mb-6">{course.description}</p>
                    <div className="mt-auto text-[#d7bf7b] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                      Daha Ətraflı &rarr;
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

                    </div>
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

                  </div>
                </Link>
              </motion.div>
            ))}
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

          </div>
          <div className="mt-10 text-center">
            <Link href="/courses" className="inline-block bg-[#152741] text-white border border-gray-700 hover:border-[#d7bf7b] px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">
              Bütün Kurslara Bax
            </Link>
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

          </div>
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

        </div>
      )}
      {/* Recommended Courses Banner */}
      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#0B1221] to-[#152741] border border-[#d7bf7b]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7bf7b]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-gray-400 font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[#d7bf7b] text-[#0a1423] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>
      </div>

    </div>
  );
}
