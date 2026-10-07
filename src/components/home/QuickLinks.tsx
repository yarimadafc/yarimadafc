'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function QuickLinks() {
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadImages() {
      const keys = ['quick_shop', 'quick_school', 'quick_academy'];
      const { data } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(item => { map[item.section_key] = item.image_url; });
        setImages(map);
      }
    }
    loadImages();
  }, []);

  const links = [
    { title: 'Onlayn mağaza', href: '/shop', key: 'quick_shop' },
    { title: '"Yarımada" Futbol Məktəbi', href: '/school', key: 'quick_school' },
    { title: 'Akademiya', href: '/academy', key: 'quick_academy' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {links.map((link, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link 
                href={link.href}
                className="group flex flex-col sm:flex-row bg-[#152741] rounded-2xl overflow-hidden hover:transform hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#d7bf7b]/30 h-full"
              >
                {/* Text Area */}
                <div className="w-full sm:w-1/2 p-8 flex flex-col justify-between z-10">
                  <h3 className="text-white font-black text-2xl lg:text-3xl tracking-tight leading-tight drop-shadow-md">
                    {link.title}
                  </h3>
                  <div className="mt-8 flex items-center space-x-4 text-[#d7bf7b]">
                    <div className="w-12 h-[2px] bg-[#d7bf7b] group-hover:w-16 transition-all shadow-md"></div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform drop-shadow-md" />
                  </div>
                </div>

                {/* Image Box */}
                <div className="w-full sm:w-1/2 min-h-[200px] sm:min-h-[250px] bg-[#0a1423] relative overflow-hidden">
                  {images[link.key] ? (
                    <img 
                      src={images[link.key]} 
                      alt={link.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800/80 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-gray-600 font-bold">
                       Şəkil
                    </div>
                  )}
                  {/* Gradient Overlay for text readability when responsive stack */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152741] via-transparent to-transparent sm:bg-gradient-to-l opacity-80"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
