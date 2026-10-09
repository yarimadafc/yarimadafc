'use client';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      const { data } = await supabase.from('coach_courses').select('*').eq('id', id).maybeSingle();
      if (data) setCourse(data);
      setLoading(false);
    }
    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-header min-h-screen bg-bg-deep pb-20 flex justify-center">
        <div className="text-accent font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-header min-h-screen bg-bg-deep pb-20 flex flex-col items-center justify-center">
        <div className="text-red-400 font-bold tracking-widest uppercase mb-4">Kurs tapılmadı</div>
        <Link href="/" className="text-accent hover:underline">Ana səhifəyə qayıt</Link>
      </div>
    );
  }

  // Extract YouTube ID for embed if it's a YouTube link
  let youtubeId = '';
  if (course.video_url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = course.video_url.match(regExp);
    if (match && match[2].length === 11) {
      youtubeId = match[2];
    }
  }

  return (
    <div className="pt-header min-h-screen bg-bg-deep pb-20">
      <div className="container mt-10">
        <div className="bg-bg-sec rounded-3xl border border-bg-border overflow-hidden shadow-2xl flex flex-col p-8 md:p-12 relative led-border">
            <Link href="/" className="text-text-sec hover:text-text-main transition-colors text-[10px] font-bold uppercase tracking-widest mb-6 inline-block flex items-center">
              &larr; Geri Qayıt
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-black text-text-main uppercase tracking-tighter mb-6">{course.title}</h1>
            
            {youtubeId ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-bg-border">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${youtubeId}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : course.video_url ? (
               <div className="mb-8">
                 <a href={course.video_url} target="_blank" rel="noopener noreferrer" className="btn-fx bg-accent text-on-accent px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm inline-block hover:bg-text-main hover:text-bg-main transition-colors">Videonu İzlə</a>
               </div>
            ) : course.image_url ? (
               <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-bg-border relative bg-bg-main">
                  <img src={course.image_url} alt={course.title} className="absolute inset-0 w-full h-full object-contain" />
               </div>
            ) : null}

            <div className="mb-8">
              <h3 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Haqqında</h3>
              <p className="text-text-sec leading-relaxed font-medium whitespace-pre-wrap">
                 {course.description || "Məlumat yoxdur."}
              </p>
            </div>
            
        </div>
      </div>
    </div>
  );
}
