import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--surface-2)] text-white pt-32 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-[#112240] p-8 md:p-12 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-8 text-[#d7bf7b]">Məxfilik Siyasəti</h1>
        <div className="space-y-6 text-gray-300">
          <p>Yarımada FK olaraq məxfiliyinizə hörmətlə yanaşırıq. Bu Məxfilik Siyasəti veb saytımızdan istifadə edərkən şəxsi məlumatlarınızın necə toplandığını, istifadə edildiyini və qorunduğunu izah edir.</p>
          <h2 className="text-xl font-bold text-white">1. Məlumatların Toplanması</h2>
          <p>Biz qeydiyyat, əlaqə formaları və saytın istifadəsi zamanı könüllü təqdim etdiyiniz məlumatları (ad, soyad, email, telefon nömrəsi və s.) toplayırıq.</p>
          <h2 className="text-xl font-bold text-white">2. Məlumatların İstifadəsi</h2>
          <p>Toplanan məlumatlar xidmətlərimizin təkmilləşdirilməsi, sizinlə əlaqə saxlanılması və akademiyaya qeydiyyat proseslərinin idarə edilməsi üçün istifadə olunur.</p>
          <h2 className="text-xl font-bold text-white">3. Məlumatların Təhlükəsizliyi</h2>
          <p>Şəxsi məlumatlarınızın təhlükəsizliyini təmin etmək üçün müvafiq texniki və təşkilati tədbirlər görürük.</p>
          <p className="pt-4 text-sm text-[var(--text-muted)]">Son yenilənmə: {new Date().toLocaleDateString('az-AZ')}</p>
        </div>
      </div>
    </div>
  );
}
