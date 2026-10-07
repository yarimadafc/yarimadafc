'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function PageTransition({ children, title }: { children: ReactNode, title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen pt-36 pb-20 container mx-auto px-4 lg:px-8"
    >
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 64 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="h-1 bg-accent mb-6"
      ></motion.div>
      <h1 className="text-3xl md:text-4xl font-black text-text-main uppercase tracking-tighter mb-12">
        {title}
      </h1>
      {children}
    </motion.div>
  );
}
