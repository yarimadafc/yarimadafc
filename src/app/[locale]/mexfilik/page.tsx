import React from 'react';
import FadeIn from '@/components/FadeIn';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--ks-paper)] pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="text-4xl md:text-5xl font-black font-condensed uppercase text-[var(--ks-ink)] tracking-wider mb-4">Məxfilik Siyasəti</h1>
            <p className="text-gray-500 font-mono text-sm tracking-widest">SON YENİLƏNMƏ: {new Date().toLocaleDateString('az-AZ')}</p>
          </div>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">1. Giriş və Ümumi Müddəalar</h2>
              <p>Yarımada FK ("Biz", "Klub", "Akademiya") olaraq, sizin məxfiliyinizə ciddi şəkildə hörmətlə yanaşırıq. Bu Məxfilik Siyasəti, veb saytımızı (yarimadafc.com) ziyarət etdiyiniz və ya xidmətlərimizdən (akademiya qeydiyyatı, bilet satışı, əlaqə formaları) istifadə etdiyiniz zaman şəxsi məlumatlarınızın necə toplandığını, istifadə edildiyini, qorunduğunu və paylaşıldığını aydınlaşdırır. Saytımızdan istifadə edərək bu siyasətdəki şərtlərlə razılaşırsınız.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">2. Topladığımız Məlumatlar</h2>
              <p className="mb-2">Biz sizdən iki növ məlumat toplaya bilərik:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Şəxsi İdentifikasiya Məlumatları:</strong> Ad, soyad, e-poçt ünvanı, telefon nömrəsi, doğum tarixi və akademiya qeydiyyatı zamanı təqdim olunan digər rəsmi sənəd məlumatları.</li>
                <li><strong>Avtomatik Toplanan Məlumatlar:</strong> IP ünvanı, brauzer növü, cihaz məlumatları, saytda keçirdiyiniz vaxt və səhifə ziyarətləri kimi anonim statistik məlumatlar.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">3. Məlumatların İstifadə Məqsədi</h2>
              <p className="mb-2">Təqdim etdiyiniz məlumatlar yalnız aşağıdakı məqsədlər üçün istifadə olunur:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Akademiyaya qeydiyyat sorğularının qəbulu və idarə edilməsi.</li>
                <li>Sizinlə birbaşa əlaqə saxlamaq, suallarınızı və müraciətlərinizi cavablandırmaq.</li>
                <li>Saytın texniki fəaliyyətini izləmək və istifadəçi təcrübəsini təkmilləşdirmək.</li>
                <li>Hüquqi öhdəlikləri yerinə yetirmək.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">4. Məlumatların Qorunması və Paylaşılması</h2>
              <p>Biz şəxsi məlumatlarınızı ciddi şəkildə qoruyuruq və üçüncü tərəflərə (reklam şirkətlərinə və ya digər kommersiya qurumlarına) <strong>qətiyyən satmırıq</strong>. Məlumatlarınız yalnız qanunvericiliklə tələb olunan hallarda və ya klubun rəsmi fəaliyyəti çərçivəsində (məsələn, AFFA qeydiyyatları) müvafiq orqanlara təqdim edilə bilər.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">5. Sizin Hüquqlarınız</h2>
              <p>Siz istənilən vaxt bizə müraciət edərək bazamızdakı şəxsi məlumatlarınızın silinməsini, yenilənməsini və ya düzəliş edilməsini tələb edə bilərsiniz. Bunun üçün info@yarimadafc.com ünvanına yaza bilərsiniz.</p>
            </section>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
