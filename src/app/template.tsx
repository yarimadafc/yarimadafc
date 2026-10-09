'use client';

import { motion } from 'framer-motion';

// Light page-enter fade (no blur/scale: those are expensive on phones and hide content while JS loads).
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0.001 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
