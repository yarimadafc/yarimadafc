'use client';

import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import WhatsAppForm from '@/components/WhatsAppForm';
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
            <h3 className="text-3xl font-black text-text-main uppercase tracking-tight">Bizimlə Əlaqə Saxlayın</h3>
            <p className="text-text-sec font-medium leading-relaxed max-w-md">
              Sualınız var? Akademiyamıza yazılmaq və ya komandamız haqqında daha çox məlumat almaq istəyirsinizsə, bizimlə əlaqə saxlayın.
            </p>
          </div>

          <div className="flex flex-col space-y-8">
            {/* Phone */}
            <div className="flex items-start space-x-6">
              <div className="w-14 h-14 bg-bg-sec border border-bg-border rounded-2xl flex items-center justify-center flex-shrink-0 text-accent">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-text-sec font-bold text-xs uppercase tracking-widest mb-1">Telefon</span>
                <a href="tel:0554477467" className="text-text-main font-bold text-xl hover:text-accent transition-colors">
                  055 447 74 67
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-6">
              <div className="w-14 h-14 bg-bg-sec border border-bg-border rounded-2xl flex items-center justify-center flex-shrink-0 text-accent">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-text-sec font-bold text-xs uppercase tracking-widest mb-1">E-poçt</span>
                <a href="mailto:info@yarimadafc.com" className="text-text-main font-bold text-xl hover:text-accent transition-colors">
                  info@yarimadafc.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-6">
              <div className="w-14 h-14 bg-bg-sec border border-bg-border rounded-2xl flex items-center justify-center flex-shrink-0 text-accent">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-text-sec font-bold text-xs uppercase tracking-widest mb-1">Ünvan</span>
                <p className="text-text-main font-medium text-lg leading-relaxed">
                  Kristal Abşeron 1,<br />
                  Xırdalan şəhəri
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
          className="bg-bg-sec p-4 md:p-6 rounded-3xl border border-bg-border shadow-2xl w-full h-[400px] lg:h-auto overflow-hidden relative"
        >
          <iframe 
            src="https://maps.google.com/maps?q=Kristal+Abşeron+1,Xırdalan&hl=az&z=15&output=embed" 
            className="absolute inset-0 w-full h-full rounded-2xl border-0" 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>

        {/* Message form (opens WhatsApp) */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="lg:col-span-2 led-border bg-bg-sec rounded-3xl border border-bg-border p-6 md:p-10">
          <h3 className="text-2xl md:text-3xl font-black text-text-main tracking-tight mb-2">Bizə yazın</h3>
          <p className="text-text-sec mb-8">Mesajınız WhatsApp vasitəsilə birbaşa klubun nömrəsinə göndəriləcək.</p>
          <WhatsAppForm
            intro="Salam, saytdan əlaqə mesajı:"
            submitLabel="WhatsApp ilə göndər"
            fields={[
              { name: 'name', label: 'Ad, soyad', required: true, placeholder: 'Adınızı yazın' },
              { name: 'phone', label: 'Telefon', type: 'tel', required: true, placeholder: '050 000 00 00' },
              { name: 'message', label: 'Mesaj', type: 'textarea', required: true, placeholder: 'Mesajınızı yazın' },
            ]}
          />
        </motion.div>

      </div>
    </PageTransition>
  );
}
