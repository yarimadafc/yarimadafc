'use client';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CoachDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [coach, setCoach] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCoach() {
      const { data } = await supabase.from('coaches').select('*, teams(name)').eq('id', id).single();
      if (data) setCoach(data);
      setLoading(false);
    }
    loadCoach();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-[#0a1423] pb-20 flex justify-center">
        <div className="text-[#d7bf7b] font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="pt-32 min-h-screen bg-[#0a1423] pb-20 flex flex-col items-center justify-center">
        <div className="text-red-400 font-bold tracking-widest uppercase mb-4">Məşqçi tapılmadı</div>
        <Link href="/coaches" className="text-[#d7bf7b] hover:underline">Məşqçilər səhifəsinə qayıt</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#0a1423] pb-20">
      <div className="container mx-auto px-4 lg:px-8 mt-10">
        <div className="bg-[#152741] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Coach Photo */}
          <div className="w-full md:w-1/3 xl:w-1/4 h-[400px] md:h-auto relative bg-[#0d1a2d]">
            {coach.image_url ? (
              <img src={coach.image_url} alt={coach.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-24 h-24 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] md:from-transparent to-transparent"></div>
          </div>

          {/* Coach Details */}
          <div className="w-full md:w-2/3 xl:w-3/4 p-8 md:p-12 relative z-10 -mt-10 md:mt-0">
            <Link href="/coaches" className="text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest mb-6 inline-block flex items-center">
              &larr; Bütün Məşqçilər
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{coach.name}</h1>
            <p className="text-[#d7bf7b] font-bold text-lg md:text-xl uppercase tracking-widest mb-8">{coach.role || 'Məşqçi'}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-t border-b border-gray-800 py-6">
              <div className="flex flex-col">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Lisenziya</span>
                <span className="text-white font-medium text-lg">{coach.license || 'Məlumat Yoxdur'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Aid Olduğu Komanda</span>
                <span className="text-white font-medium text-lg">{coach.teams?.name || 'Ümumi Akademiya'}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Haqqında</h3>
              <p className="text-gray-400 leading-relaxed font-medium">
                 {coach.name} klubumuzun inkişafında xüsusi rolu olan peşəkar məşqçilərimizdən biridir. Öz bilik və təcrübəsi ilə uşaq və gənclərin futbol sirlərinə yiyələnməsində onlara dəstək olur. Onun rəhbərliyi altında futbolçularımız həm texniki, həm də taktiki baxımdan böyük irəliləyişlər əldə edirlər.
              </p>
            </div>

            {coach.teams && (
              <Link href={`/teams/${coach.teams.id}`} className="inline-block bg-[#d7bf7b] text-[#152741] px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white transition-colors">
                Komandasına Bax
              </Link>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
