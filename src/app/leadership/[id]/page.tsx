'use client';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LeadershipDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPerson() {
      const { data } = await supabase.from('leadership').select('*').eq('id', id).maybeSingle();
      if (data) setPerson(data);
      setLoading(false);
    }
    loadPerson();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-[#0a1423] pb-20 flex justify-center">
        <div className="text-[#d7bf7b] font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="pt-32 min-h-screen bg-[#0a1423] pb-20 flex flex-col items-center justify-center">
        <div className="text-red-400 font-bold tracking-widest uppercase mb-4">Şəxs tapılmadı</div>
        <Link href="/club" className="text-[#d7bf7b] hover:underline">Haqqımızda səhifəsinə qayıt</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-[#0a1423] pb-20">
      <div className="container mx-auto px-4 lg:px-8 mt-10">
        <div className="bg-[#152741] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl flex flex-col md:flex-row max-w-5xl mx-auto">
          
          {/* Photo */}
          <div className="w-full md:w-2/5 xl:w-1/3 h-[400px] md:h-auto relative bg-[#0d1a2d]">
            {person.image_url ? (
              <img src={person.image_url} alt={person.name} className="absolute inset-0 w-full h-full object-cover object-top" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-24 h-24 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] md:from-transparent to-transparent"></div>
          </div>

          {/* Details */}
          <div className="w-full md:w-3/5 xl:w-2/3 p-8 md:p-12 relative z-10 -mt-10 md:mt-0">
            <Link href="/club" className="text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest mb-6 inline-block flex items-center">
              &larr; Klub Rəhbərliyinə Qayıt
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{person.name}</h1>
            <p className="text-[#d7bf7b] font-bold text-lg md:text-xl uppercase tracking-widest mb-8">{person.position}</p>

            <div className="mb-8">
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Haqqında</h3>
              <p className="text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">
                 {person.bio || "Məlumat yoxdur."}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
