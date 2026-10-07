'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { User } from 'lucide-react';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCoaches() {
      const { data } = await supabase.from('coaches').select('*').order('created_at', { ascending: false });
      if (data) setCoaches(data);
      setLoading(false);
    }
    loadCoaches();
  }, []);

  return (
    <div className="pt-[180px] min-h-screen bg-[var(--bg-main)] pb-20 transition-colors duration-500">
      
      {/* Header */}
      <div className="w-full bg-[var(--bg-sec)] py-12 md:py-16 border-b border-[var(--border)] relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter mb-4"
          >
            MƏŞQÇİLƏR <span className="text-[var(--accent)]">HEYƏTİ</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[var(--accent)] mx-auto mb-6"
          ></motion.div>
          <p className="text-[var(--text-sec)] max-w-2xl mx-auto text-sm md:text-base font-medium">
            Klubumuzun uğurlarında böyük pay sahibi olan peşəkar məşqçilərimizlə tanış olun.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-16">
        {loading ? (
          <div className="text-center py-20 text-[var(--accent)] font-bold uppercase tracking-widest animate-pulse">Yüklənir...</div>
        ) : coaches.length === 0 ? (
          <div className="text-center py-20 text-[var(--text-sec)] font-medium">Məlumat tapılmadı.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {coaches.map((coach, i) => (
              <motion.div 
                key={coach.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group flex flex-col items-center"
              >
                <Link href={`/coaches/${coach.id}`} className="block w-full">
                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-[var(--bg-sec)] border border-[var(--border)] group-hover:border-[var(--accent)] transition-colors">
                    {coach.image_url ? (
                      <img 
                        src={coach.image_url} 
                        alt={coach.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-deep)]">
                        <User className="w-20 h-20 text-[var(--bg-border)]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-black text-text-main uppercase tracking-wider mb-1 drop-shadow-md">{coach.name}</h3>
                      <p className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest drop-shadow-md">{coach.role || 'Məşqçi'}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recommended Courses Banner */}
        <div className="mt-24 bg-gradient-to-r from-[var(--bg-sec)] to-[var(--bg-main)] border border-[var(--accent)]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden transition-colors duration-500">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-[var(--text-sec)] font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="bg-[var(--accent)] text-var-bg-main px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
