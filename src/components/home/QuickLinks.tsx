'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuickLinks() {
  const links = [
    { title: 'Biletlər', href: '/tickets', imgBg: 'bg-gray-800' },
    { title: 'Onlayn mağaza', href: '/shop', imgBg: 'bg-gray-800' },
    { title: '"Yarımada" Futbol Məktəbi', href: '/school', imgBg: 'bg-gray-800' },
    { title: 'Akademiya', href: '/academy', imgBg: 'bg-gray-800' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="bg-[#0d1a2d] py-16 border-b border-gray-800/50 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {links.map((link, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link 
                href={link.href}
                className="group flex flex-col sm:flex-row bg-[#152741] rounded-2xl overflow-hidden hover:transform hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#d7bf7b]/30 h-full"
              >
                {/* Text Area */}
                <div className="w-full sm:w-1/2 p-8 flex flex-col justify-between">
                  <h3 className="text-white font-black text-2xl lg:text-3xl tracking-tight leading-tight">
                    {link.title}
                  </h3>
                  <div className="mt-8 flex items-center space-x-4 text-[#d7bf7b]">
                    <div className="w-12 h-[2px] bg-[#d7bf7b] group-hover:w-16 transition-all"></div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Image Box */}
                <div className={`w-full sm:w-1/2 min-h-[200px] sm:min-h-[250px] ${link.imgBg} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gray-800/80 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-gray-600 font-bold">
                     Şəkil
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
