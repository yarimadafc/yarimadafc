'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20,  }}
      whileInView={{ opacity: 1, y: 0,  }}
      viewport={{ once: false, margin: '-50px 0px -50px 0px', amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: [0.44, 0, 0.56, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
