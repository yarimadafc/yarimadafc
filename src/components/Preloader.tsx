'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only show preloader on first visit or hard refresh
    const hasVisited = sessionStorage.getItem('hasVisitedYarimada');
    if (!hasVisited) {
      sessionStorage.setItem('hasVisitedYarimada', 'true');
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // 2 second heavy loading animation like Saytlab
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, delay: 1.5, ease: [0.25, 1, 0.5, 1] }}
      onAnimationComplete={() => setLoading(false)}
      className="fixed inset-0 z-[100] bg-[var(--bg)] flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[var(--accent)] shadow-[0_0_50px_var(--glow)] mb-8">
          <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
        </div>
        
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="text-4xl md:text-6xl font-black font-display uppercase tracking-widest text-white mb-2 text-center"
          >
            YARIMADA <span className="text-[var(--accent)]">FK</span>
          </motion.h1>
        </div>

        <div className="overflow-hidden mt-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            className="h-[2px] bg-[var(--accent)] mx-auto"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
