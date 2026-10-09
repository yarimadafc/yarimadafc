'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
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
    <div className="pt-header min-h-screen bg-bg-main pb-20 transition-colors duration-500">
      
      {/* Header */}
      <PageHero title="Məşqçilər heyəti" subtitle="Klubumuzun uğurlarında böyük pay sahibi olan peşəkar məşqçilərimizlə tanış olun." />

      <div className="container mt-16">
        {loading ? (
          <div className="text-center py-20 text-accent font-bold uppercase tracking-widest animate-pulse">Yüklənir...</div>
        ) : coaches.length === 0 ? (
          <div className="text-center py-20 text-text-sec font-medium">Məlumat tapılmadı.</div>
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
                  <div className="led-border led-hover card-fx relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-bg-sec border border-bg-border">
                    {coach.image_url ? (
                      <img 
                        src={coach.image_url} 
                        alt={coach.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-bg-deep">
                        <User className="w-20 h-20 text-[var(--bg-border)]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-black text-text-main uppercase tracking-wider mb-1 drop-shadow-md">{coach.name}</h3>
                      <p className="text-accent font-bold text-xs uppercase tracking-widest drop-shadow-md">{coach.role || 'Məşqçi'}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recommended Courses Banner */}
        <div className="mt-24 bg-gradient-to-r from-bg-sec to-bg-main border border-accent/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden transition-colors duration-500">
           <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-4">Peşəkar Məşqçi Kursları</h2>
             <p className="text-text-sec font-medium">Özünü inkişaf etdirmək və peşəkar məşqçi olmaq istəyənlər üçün hazırladığımız xüsusi kurslar və praktiki dərslərlə tanış olun.</p>
           </div>
           <div className="relative z-10 md:w-1/3 flex justify-end">
             <Link href="/courses" className="btn-fx bg-accent text-on-accent px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
