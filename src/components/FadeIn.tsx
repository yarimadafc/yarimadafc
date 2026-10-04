'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }} // smooth ease-out spring-like curve
      className={className}
    >
      {children}
    </motion.div>
  );
}
