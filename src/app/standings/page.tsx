'use client';
import { motion } from 'framer-motion';
import MatchesAndStandings from '@/components/home/MatchesAndStandings';

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MatchesAndStandings />
    </motion.div>
  );
}
