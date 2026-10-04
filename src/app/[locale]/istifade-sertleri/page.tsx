import React from 'react';
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
