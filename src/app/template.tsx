'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      transition={{ 
        duration: 0.35, 
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
}
