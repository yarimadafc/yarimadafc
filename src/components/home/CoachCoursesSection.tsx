'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayCircle } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
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
    <section id="courses" className="bg-bg-deep py-24 border-b border-bg-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="container relative z-10">
        <SectionHeading title="Məşqçi kursu" href="/courses" linkText="Bütün kurslar" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group led-border led-hover card-fx cursor-pointer bg-bg-sec rounded-3xl overflow-hidden border border-bg-border shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={course.image_url || '/Logo.JPG.jpeg'} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                   <PlayCircle className="w-16 h-16 text-text-main/80 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-accent transition-colors">{course.title}</h3>
                <p className="text-text-sec text-sm line-clamp-2">{course.description}</p>
                {course.video_url && (
                  <a href={course.video_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-accent text-xs font-bold uppercase tracking-widest hover:text-text-main transition-colors">
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
