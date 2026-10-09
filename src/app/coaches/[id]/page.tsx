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
      const { data } = await supabase.from('coaches').select('*, teams(id, name)').eq('id', id).single();
      if (data) setCoach(data);
      setLoading(false);
    }
    loadCoach();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-header min-h-screen bg-bg-deep pb-20 flex justify-center">
        <div className="text-accent font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="pt-header min-h-screen bg-bg-deep pb-20 flex flex-col items-center justify-center">
        <div className="text-red-400 font-bold tracking-widest uppercase mb-4">Məşqçi tapılmadı</div>
        <Link href="/coaches" className="text-accent hover:underline">Məşqçilər səhifəsinə qayıt</Link>
      </div>
    );
  }

  return (
    <div className="pt-header min-h-screen bg-bg-deep pb-20">
      <div className="container mt-10">
        <div className="bg-bg-sec rounded-3xl border border-bg-border overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Coach Photo */}
          <div className="w-full md:w-1/4 xl:w-1/5 h-[300px] md:h-[400px] relative bg-bg-main flex-shrink-0 border-r border-bg-border">
            {coach.image_url ? (
              <img src={coach.image_url} alt={coach.name} className="absolute inset-0 w-full h-full object-contain object-top pt-4 opacity-90" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-24 h-24 text-text-sec" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep md:from-transparent to-transparent"></div>
          </div>

          {/* Coach Details */}
          <div className="w-full p-8 md:p-10 relative z-10 -mt-10 md:mt-0">
            <Link href="/coaches" className="text-text-sec hover:text-text-main transition-colors text-[10px] font-bold uppercase tracking-widest mb-6 inline-block flex items-center">
              &larr; Bütün Məşqçilər
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-black text-text-main uppercase tracking-tighter mb-2">{coach.name}</h1>
            <p className="text-accent font-bold text-base md:text-lg uppercase tracking-widest mb-8">{coach.role || 'Məşqçi'}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-t border-b border-bg-border py-6">
              <div className="flex flex-col">
                
              </div>
              <div className="flex flex-col">
                <span className="text-text-sec text-[10px] uppercase font-bold tracking-widest mb-1">Aid Olduğu Komanda</span>
                <span className="text-text-main font-medium text-lg">{coach.teams?.name || 'Ümumi Akademiya'}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-text-main font-bold uppercase tracking-widest text-sm mb-4">Haqqında</h3>
              <p className="text-text-sec leading-relaxed font-medium whitespace-pre-wrap">
                 {coach.bio || `${coach.name} klubumuzun inkişafında xüsusi rolu olan peşəkar məşqçilərimizdən biridir. Öz bilik və təcrübəsi ilə uşaq və gənclərin futbol sirlərinə yiyələnməsində onlara dəstək olur.`}
              </p>
            </div>

            {coach.teams && (
              <Link href={`/teams/${coach.team_id || coach.teams.id}`} className="btn-fx inline-block bg-accent text-on-accent px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-text-main hover:text-bg-main transition-colors">
                Komandasına Bax
              </Link>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
