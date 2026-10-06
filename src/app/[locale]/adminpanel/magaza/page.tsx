'use client';
import { motion } from 'framer-motion';

export default function Page() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mağaza Məhsulları</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-500 mb-2 font-medium">Bu bölmə yeni əlavə edilmişdir.</p>
        <p className="text-gray-400 text-sm">Burada verilənlər bazası (Supabase) bağlantısı qurularaq məlumatlar idarə ediləcək.</p>
      </div>
    </motion.div>
  );
}
