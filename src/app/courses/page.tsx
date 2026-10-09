'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
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
    <div className="pt-header min-h-screen bg-bg-deep pb-20">
      <PageHero title="Məşqçi kursları və praktiki dərslər" subtitle="Klubumuzun məşqçilər və futbol sevərlər üçün hazırladığı peşəkar kurslar, praktiki videolar və tədris materialları." />

      <div className="container mt-16">
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
                <Link href={`/courses/${course.id}`} className="led-border led-hover card-fx block h-full group cursor-pointer bg-bg-sec rounded-3xl overflow-hidden border border-bg-border flex flex-col">
                  <div className="relative aspect-video overflow-hidden shrink-0">
                    <img 
                      src={course.image_url || '/Logo.JPG.jpeg'} 
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
