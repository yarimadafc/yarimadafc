'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PlayerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayer() {
      const { data } = await supabase.from('players').select('*, teams(name)').eq('id', id).single();
      if (data) setPlayer(data);
      setLoading(false);
    }
    fetchPlayer();
  }, [id]);

  if (loading) return <div className="pt-[180px] min-h-screen bg-bg-main flex justify-center text-accent">Yüklənir...</div>;
  if (!player) return <div className="pt-[180px] min-h-screen bg-bg-main flex justify-center text-red-500">Oyunçu tapılmadı</div>;

  return (
    <div className="pt-[180px] min-h-screen bg-bg-main pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="bg-bg-sec border border-bg-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
          {/* Background Number */}
          <div className="absolute top-0 right-10 text-[200px] font-black text-bg-deep opacity-30 select-none z-0 leading-none">
            {player.jersey_number || ''}
          </div>

          {/* Photo */}
          <div className="w-full md:w-2/5 lg:w-1/3 bg-bg-deep relative z-10 aspect-[3/4] md:aspect-auto">
            {player.image_url ? (
              <img src={player.image_url} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-32 h-32 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full md:w-3/5 lg:w-2/3 p-8 md:p-12 relative z-10 flex flex-col justify-center">
            <div className="inline-block bg-accent text-bg-main px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              {player.teams?.name || 'Komanda'}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-text-main uppercase tracking-tighter mb-2">{player.name}</h1>
            <h2 className="text-xl md:text-2xl font-bold text-accent uppercase tracking-widest mb-10">{player.position}</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-bg-main border border-bg-border p-4 rounded-xl text-center">
                <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Nömrə</div>
                <div className="text-text-main text-2xl font-black">{player.jersey_number || '-'}</div>
              </div>
              <div className="bg-bg-main border border-bg-border p-4 rounded-xl text-center">
                <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Təvəllüd</div>
                <div className="text-text-main text-xl font-bold mt-1">{player.birth_date ? new Date(player.birth_date).getFullYear() : '-'}</div>
              </div>
              {/* Optional fields if they exist in DB in the future */}
              <div className="bg-bg-main border border-bg-border p-4 rounded-xl text-center">
                <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Boy</div>
                <div className="text-text-main text-xl font-bold mt-1">-</div>
              </div>
              <div className="bg-bg-main border border-bg-border p-4 rounded-xl text-center">
                <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Çəki</div>
                <div className="text-text-main text-xl font-bold mt-1">-</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
