'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
    <div className="pt-[180px] min-h-screen bg-bg-main pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-text-main tracking-tight mt-12 mb-8 border-b border-bg-border pb-4 flex justify-center items-center text-center"
        >
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-accent"></div>
            Transferlər
          </div>
        </motion.h1>

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
                className="bg-bg-sec rounded-xl border border-bg-border overflow-hidden shadow-lg p-6 flex flex-col items-center relative"
              >
                <div className="absolute top-4 left-4 text-[10px] font-bold text-bg-main bg-accent px-2 py-1 rounded uppercase tracking-widest">
                  {t.transfer_type}
                </div>
                
                <div className="w-24 h-24 rounded-full overflow-hidden bg-bg-deep border-4 border-bg-border mb-4 mt-6">
                  {t.image_url ? (
                    <img src={t.image_url} alt={t.player_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">?</div>
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
