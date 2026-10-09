'use client';
import { motion, useReducedMotion, type TargetAndTransition } from 'framer-motion';
import type { ReactNode } from 'react';

type Variant = 'up' | 'left' | 'right' | 'scale' | 'fade';

const hidden: Record<Variant, TargetAndTransition> = {
  up: { opacity: 0, y: 40 },
  left: { opacity: 0, x: -50 },
  right: { opacity: 0, x: 50 },
  scale: { opacity: 0, scale: 0.9 },
  fade: { opacity: 0 },
};

interface Props {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}

// Scroll-triggered entrance (runs once). Respects "reduce motion".
export default function Reveal({ children, variant = 'up', delay = 0, className, as = 'div' }: Props) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : hidden[variant]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
