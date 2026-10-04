'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, clipPath: 'inset(10% 0 0 0)', filter: 'blur(10px)' }}
      animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)', filter: 'blur(0px)' }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] // Emil Kowalski style spring-like easing
      }}
    >
      {children}
    </motion.div>
  );
}
