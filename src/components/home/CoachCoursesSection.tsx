'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function CoachCoursesSection() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      const { data } = await supabase.from('coach_courses').select('*').order('created_at', { ascending: false }).limit(3);
      if (data) setCourses(data);
    }
    fetchCourses();
  }, []);

  if (courses.length === 0) return null;

  return (
    <section className="bg-[#0a1423] py-24 border-b border-gray-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d7bf7b]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center mb-16"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
              Məşqçi <span className="text-[#d7bf7b]">Kursu</span>
            </h2>
            <p className="text-gray-400 font-medium max-w-2xl">
              Praktiki dərslər və peşəkar təlimatlar vasitəsilə futbol biliklərinizi artırın.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer bg-[#152741] rounded-3xl overflow-hidden border border-gray-800 hover:border-[#d7bf7b]/50 transition-colors shadow-xl hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={course.image_url || '/placeholder-hero.jpg'} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                   <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-[#d7bf7b] group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d7bf7b] transition-colors">{course.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                {course.video_url && (
                  <a href={course.video_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#d7bf7b] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                    İzləməyə Başla &rarr;
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
