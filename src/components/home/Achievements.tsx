'use client';

import { motion } from 'framer-motion';

export default function Achievements() {
  // Gələcəkdə admin paneldən əlavə olunan şəkillər (Nailiyyətlər) burada siyahılanacaq
  const achievementImages: string[] = [];

  return (
    <section className="bg-[#152741] py-24 border-b border-gray-800/50 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Nailiyyətlər</h2>
        </motion.div>

        {/* Grid for Achievement Images */}
        {achievementImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {achievementImages.map((imgUrl, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="aspect-square bg-[#0d1a2d] rounded-2xl overflow-hidden border border-gray-800 shadow-xl"
              >
                <img src={imgUrl} alt="Nailiyyət" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 border-2 border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm text-center">
              Tezliklə yeni nailiyyət şəkilləri əlavə olunacaq...
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
