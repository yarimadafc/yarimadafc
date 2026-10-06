'use client';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-[60vh]"
    >
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Admin Panel Yenilənir</h2>
      <p className="text-gray-500 text-lg max-w-lg mb-8">
        Sistemin daha təkmil, xətasız və yeni dizaynla işləməsi üçün Admin Panel tamamilə sıfırlandı. Tezliklə hər bir modul yenidən və fərqli şəkildə proqramlaşdırılacaq.
      </p>
    </motion.div>
  );
}
