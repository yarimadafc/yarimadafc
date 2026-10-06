'use client';

import { motion } from 'framer-motion';

export default function Achievements() {
  const achievements = [
    { num: 9, text: 'Azərbaycan\nçempionatının qalibi', icon: '🏆' },
    { num: 6, text: 'Azərbaycan\nKubokunun qalibi', icon: '🏆' },
    { num: 2, text: 'Azərbaycan\nSuperkubokunun qalibi', icon: '🏆' },
    { num: 1, text: 'Birlik Kubokunun\nqalibi', icon: '🏆' },
  ];

  return (
    <section className="bg-[#152741] py-24 border-b border-gray-800/50 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Nailiyyətlər</h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-800/50">
          {achievements.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.2, type: "spring", stiffness: 100 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col items-center pt-8 md:pt-0"
            >
              {/* Trophy icon placeholder */}
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-24 h-32 flex justify-center items-end text-6xl mb-6 grayscale brightness-150"
              >
                 {item.icon}
              </motion.div>
              
              <div className="flex items-start space-x-4">
                <span className="text-5xl md:text-6xl font-black text-white">{item.num}</span>
                <p className="text-gray-300 font-bold text-sm tracking-wide leading-snug whitespace-pre-line mt-2">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
