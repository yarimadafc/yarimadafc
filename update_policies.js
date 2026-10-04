const fs = require('fs');

const mexfilik = `import React from 'react';
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
`;

const istifadeSertleri = `import React from 'react';
import FadeIn from '@/components/FadeIn';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--ks-paper)] pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="text-4xl md:text-5xl font-black font-condensed uppercase text-[var(--ks-ink)] tracking-wider mb-4">İstifadə Şərtləri</h1>
            <p className="text-gray-500 font-mono text-sm tracking-widest">SON YENİLƏNMƏ: {new Date().toLocaleDateString('az-AZ')}</p>
          </div>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">1. Razılaşmanın Qəbulu</h2>
              <p>Bu İstifadə Şərtləri ("Şərtlər") sizinlə Yarımada FK ("Klub") arasında hüquqi bir müqavilədir. Veb saytımıza (yarimadafc.com) daxil olmaqla, buradakı xidmətlərdən və məzmundan istifadə etməklə bu Şərtləri qeyd-şərtsiz qəbul etdiyinizi təsdiqləyirsiniz. Əgər şərtlərlə razı deyilsinizsə, lütfən saytdan istifadəni dayandırın.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">2. Əqli Mülkiyyət Hüquqları</h2>
              <p>Bu veb saytda yerləşən bütün mətnlər, qrafiklər, loqolar, şəkillər, audio və video materiallar, həmçinin saytın proqram təminatı Yarımada FK-ya məxsusdur və beynəlxalq əqli mülkiyyət və müəllif hüquqları qanunları ilə qorunur. Klubun yazılı icazəsi olmadan hər hansı məzmunun kopyalanması, paylanması və ya kommersiya məqsədilə istifadəsi qəti qadağandır.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">3. İstifadədə Məhdudiyyətlər</h2>
              <p className="mb-2">Saytdan istifadə edərkən aşağıdakı fəaliyyətlər qadağandır:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Saytın normal fəaliyyətinə və təhlükəsizliyinə zərər verə biləcək hər hansı proqram təminatı və ya virusların yüklənməsi.</li>
                <li>Digər istifadəçilərin məlumatlarına icazəsiz giriş cəhdləri.</li>
                <li>Qeyri-qanuni, təhqiredici və ya zərərli materialların sayt vasitəsilə göndərilməsi.</li>
                <li>Saytın məlumat bazasına avtomatik vasitələrlə (botlar) icazəsiz daxil olmaq.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">4. Akademiya Qeydiyyatı və Ödənişlər</h2>
              <p>Sayt vasitəsilə edilən akademiya qeydiyyatları ilkin sorğu xarakteri daşıyır. Yekun qərar klubun rəhbərliyi və məşqçilər heyətinin baxışından sonra verilir. Gələcəkdə sayt vasitəsilə hər hansı onlayn ödəniş həyata keçirilərsə, bu əməliyyatlar üçüncü tərəf rəsmi ödəniş sistemləri vasitəsilə tam təhlükəsiz şəraitdə icra ediləcəkdir.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--ks-ink)] mb-4">5. Şərtlərin Dəyişdirilməsi</h2>
              <p>Yarımada FK bu İstifadə Şərtlərinə əvvəlcədən xəbərdarlıq etmədən dəyişiklik etmək hüququnu özündə saxlayır. Dəyişikliklər saytda yayımlandığı andan etibarən qüvvəyə minir.</p>
            </section>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
`;

const cookieSiyaseti = `import React from 'react';
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
`;

fs.writeFileSync('src/app/[locale]/mexfilik/page.tsx', mexfilik);
fs.writeFileSync('src/app/[locale]/istifade-sertleri/page.tsx', istifadeSertleri);
fs.writeFileSync('src/app/[locale]/cookie/page.tsx', cookieSiyaseti);

console.log('Polices updated successfully.');
