'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      const { data } = await supabase.from('coach_courses').select('*').order('created_at', { ascending: false });
      if (data) setCourses(data);
      setLoading(false);
    }
    loadCourses();
  }, []);

  return (
    <div className="pt-[180px] min-h-screen bg-bg-deep pb-20">
      <div className="w-full bg-bg-sec py-12 md:py-16 border-b border-bg-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl font-black text-text-main uppercase tracking-tighter mb-4 drop-shadow-lg"
          >
            MƏŞQÇİ <span className="text-accent">KURSLARI VƏ PRAKTİKİ DƏRSLƏR</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-accent mx-auto mb-6"
          ></motion.div>
          <p className="text-text-sec max-w-2xl mx-auto text-sm md:text-base font-medium">
            Klubumuzun məşqçilər və futbol sevərlər üçün hazırladığı peşəkar kurslar, praktiki videolar və tədris materialları.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-16">
        {loading ? (
          <div className="text-center py-20 text-accent font-bold uppercase tracking-widest animate-pulse">Yüklənir...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-text-sec font-medium">Heç bir kurs tapılmadı.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course, i) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/courses/${course.id}`} className="block h-full group cursor-pointer bg-bg-sec rounded-3xl overflow-hidden border border-bg-border hover:border-accent/50 transition-colors shadow-xl hover:shadow-2xl flex flex-col">
                  <div className="relative aspect-video overflow-hidden shrink-0">
                    <img 
                      src={course.image_url || '/placeholder-hero.jpg'} 
                      alt={course.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                       {course.video_url && <PlayCircle className="w-16 h-16 text-text-main/80 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-text-main mb-2 group-hover:text-accent transition-colors">{course.title}</h3>
                    <p className="text-text-sec text-xs md:text-sm line-clamp-3 mb-6">{course.description}</p>
                    <div className="mt-auto text-accent text-xs font-bold uppercase tracking-widest hover:text-text-main transition-colors">
                      Ətraflı &rarr;
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
