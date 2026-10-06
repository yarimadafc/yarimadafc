'use client';

import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <PageTransition title="Əlaqə">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col space-y-12"
        >
          <div className="flex flex-col space-y-6">
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Bizimlə Əlaqə Saxlayın</h3>
            <p className="text-gray-400 font-medium leading-relaxed max-w-md">
              Sualınız var? Akademiyamıza yazılmaq və ya komandamız haqqında daha çox məlumat almaq istəyirsinizsə, bizimlə əlaqə saxlayın.
            </p>
          </div>

          <div className="flex flex-col space-y-8">
            {/* Phone */}
            <div className="flex items-start space-x-6">
              <div className="w-14 h-14 bg-[#152741] border border-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#d7bf7b]">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Telefon</span>
                <a href="tel:+994551234567" className="text-white font-bold text-xl hover:text-[#d7bf7b] transition-colors">
                  (+994) 55 123 45 67
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-6">
              <div className="w-14 h-14 bg-[#152741] border border-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#d7bf7b]">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">E-poçt</span>
                <a href="mailto:info@yarimadafc.com" className="text-white font-bold text-xl hover:text-[#d7bf7b] transition-colors">
                  info@yarimadafc.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-6">
              <div className="w-14 h-14 bg-[#152741] border border-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#d7bf7b]">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Ünvan</span>
                <p className="text-white font-medium text-lg leading-relaxed">
                  Bakı şəhəri, Suraxanı rayonu,<br />
                  Qaraçuxur qəsəbəsi,<br />
                  Neftçilər parkının yanı
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Map */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-[#152741] p-4 md:p-6 rounded-3xl border border-gray-800 shadow-2xl w-full h-[400px] lg:h-auto overflow-hidden relative"
        >
          <iframe 
            src="https://maps.google.com/maps?q=40.4552142,49.7338299&hl=az&z=17&output=embed" 
            className="absolute inset-0 w-full h-full rounded-2xl border-0" 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>

      </div>
    </PageTransition>
  );
}
