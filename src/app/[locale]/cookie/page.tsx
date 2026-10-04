import React from 'react';
import FadeIn from '@/components/FadeIn';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[var(--ks-paper)] pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="text-4xl md:text-5xl font-black font-condensed uppercase text-[var(--ks-ink)] tracking-wider mb-4">Cookie Siyasəti</h1>
            <p className="text-gray-500 font-mono text-sm tracking-widest">SON YENİLƏNMƏ: {new Date().toLocaleDateString('az-AZ')}</p>
          </div>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">1. Cookie (Kuki) Nədir?</h2>
              <p>Cookie-lər siz veb saytımızı ziyarət edərkən kompüterinizə, mobil telefonunuza və ya digər cihazlarınıza yüklənən kiçik həcmli mətn fayllarıdır. Bu fayllar veb saytın cihazınızı tanımasına, tərcihlərinizi yadda saxlamasına (məsələn, seçdiyiniz dil) və sayt daxilində daha sürətli və rahat naviqasiya etməyinizə kömək edir.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">2. Hansı Növ Cookie-lərdən İstifadə Edirik?</h2>
              <ul className="list-disc pl-5 space-y-4">
                <li><strong>Zəruri Cookie-lər:</strong> Bu cookie-lər saytın əsas funksiyalarının düzgün işləməsi üçün mütləqdir. Məsələn, idarəetmə panelinə (Admin Panel) giriş zamanı sessiyanızı yadda saxlamaq üçün istifadə olunur.</li>
                <li><strong>Funksional Cookie-lər:</strong> Sizin saytdakı seçimlərinizi (dil seçimi kimi) yadda saxlayır ki, hər dəfə sayta daxil olanda yenidən eyni seçimləri etmək məcburiyyətində qalmayasınız (Məsələn: NEXT_LOCALE cookie-si).</li>
                <li><strong>Analitik Cookie-lər:</strong> Ziyarətçilərin saytla necə qarşılıqlı əlaqədə olduğunu, hansı səhifələrə daha çox daxil olduğunu anlamaq üçün istifadə edilir. Bu məlumatlar anonim toplanır.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">3. Cookie-lərin İdarə Edilməsi</h2>
              <p>Siz öz brauzerinizin (Chrome, Safari, Firefox və s.) tənzimləmələri vasitəsilə cookie-ləri bloklaya, silə və ya hər dəfə cookie saxlanılanda xəbərdarlıq ala bilərsiniz. Ancaq zəruri cookie-ləri bloklasanız, veb saytın bəzi funksiyaları (məsələn, hesaba giriş) düzgün işləməyə bilər.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">4. Əlaqə</h2>
              <p>Cookie siyasətimizlə bağlı hər hansı sualınız olarsa, bizimlə <strong>info@yarimadafc.com</strong> elektron poçt ünvanı vasitəsilə əlaqə saxlaya bilərsiniz.</p>
            </section>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
