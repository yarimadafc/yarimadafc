'use client';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useSyncVersion } from '@/lib/siteSync';

export default function LeadershipDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sync = useSyncVersion();
  useEffect(() => {
    async function loadPerson() {
      const { data } = await supabase.from('leadership').select('*').eq('id', id).maybeSingle();
      if (data) setPerson(data);
      setLoading(false);
    }
    loadPerson();
  }, [id, sync]);

  if (loading) {
    return (
      <div className="pt-header min-h-screen bg-bg-deep pb-20 flex justify-center">
        <div className="text-accent font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="pt-header min-h-screen bg-bg-deep pb-20 flex flex-col items-center justify-center">
        <div className="text-text-main font-bold tracking-widest uppercase mb-4">Şəxs tapılmadı</div>
        <Link href="/club" className="text-accent hover:underline">Haqqımızda səhifəsinə qayıt</Link>
      </div>
    );
  }

  return (
    <div className="pt-header min-h-screen bg-bg-deep pb-20">
      <div className="container mt-10">
        <div className="bg-bg-sec rounded-3xl border border-bg-border overflow-hidden shadow-2xl flex flex-col md:flex-row led-border">
          
          {/* Photo */}
          <div className="w-full md:w-1/4 xl:w-1/5 h-[300px] md:h-[400px] relative bg-bg-main flex-shrink-0 border-r border-bg-border">
            {person.image_url ? (
              <img src={person.image_url} alt={person.name} className="absolute inset-0 w-full h-full object-cover object-top" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-24 h-24 text-text-sec" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep md:from-transparent to-transparent"></div>
          </div>

          {/* Details */}
          <div className="w-full p-8 md:p-10 relative z-10 -mt-10 md:mt-0">
            <Link href="/club" className="text-text-sec hover:text-text-main transition-colors text-[10px] font-bold uppercase tracking-widest mb-6 inline-block flex items-center">
              &larr; {person.group_type === 'staff' ? 'Klub Heyətinə Qayıt' : 'Klub Rəhbərliyinə Qayıt'}
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-black text-text-main uppercase tracking-tighter mb-2">{person.name}</h1>
            <p className="text-accent font-bold text-base md:text-lg uppercase tracking-widest mb-8">{person.position}</p>

            <div className="mb-8">
              <h3 className="text-text-main font-bold uppercase tracking-widest text-sm mb-4">Haqqında</h3>
              <p className="text-text-sec leading-relaxed font-medium whitespace-pre-wrap">
                 {person.bio || "Məlumat yoxdur."}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
