'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('transfers').select('*').order('date', { ascending: false });
      if (data) setTransfers(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="pt-header min-h-screen bg-bg-main pb-20">
      <PageHero title="Transferlər" subtitle="Klubumuzun gələn və gedən transferləri." />
      <div className="container">

        {loading ? (
          <div className="text-center py-20 text-accent font-medium text-sm">Yüklənir...</div>
        ) : transfers.length === 0 ? (
          <div className="text-center py-20 text-text-sec font-medium">Hələ ki, transfer məlumatı yoxdur.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transfers.map((t, i) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="led-border led-hover card-fx bg-bg-sec rounded-xl border border-bg-border overflow-hidden shadow-lg p-6 flex flex-col items-center relative h-full"
              >
                <div className="absolute top-4 left-4 text-[10px] font-bold text-bg-main bg-accent px-2 py-1 rounded uppercase tracking-widest">
                  {t.transfer_type}
                </div>
                
                <div className="w-24 h-24 rounded-full overflow-hidden bg-bg-deep border-4 border-bg-border mb-4 mt-6">
                  {t.image_url ? (
                    <img src={t.image_url} alt={t.player_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-sec">?</div>
                  )}
                </div>
                
                <h3 className="text-xl font-black text-text-main uppercase tracking-wider mb-6 text-center">{t.player_name}</h3>
                
                <div className="flex items-center justify-between w-full border-t border-bg-border pt-4">
                   <div className="flex flex-col items-center w-[45%]">
                      <span className="text-text-sec text-[10px] uppercase font-bold tracking-widest mb-1">Haradan</span>
                      <span className="text-text-main text-sm font-bold text-center truncate w-full">{t.from_team || 'Məlum deyil'}</span>
                   </div>
                   <div className="text-accent w-[10%] text-center font-bold">→</div>
                   <div className="flex flex-col items-center w-[45%]">
                      <span className="text-text-sec text-[10px] uppercase font-bold tracking-widest mb-1">Haraya</span>
                      <span className="text-text-main text-sm font-bold text-center truncate w-full">{t.to_team || 'Yarımada FK'}</span>
                   </div>
                </div>
                <div className="mt-4 text-center w-full">
                  <span className="text-text-sec text-[11px] font-bold">{t.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
