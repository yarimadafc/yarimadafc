import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-white pt-32 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-[#112240] p-8 md:p-12 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-8 text-[#d7bf7b]">Cookie Siyasəti</h1>
        <div className="space-y-6 text-gray-300">
          <p>Bu veb sayt istifadəçi təcrübəsini yaxşılaşdırmaq üçün cookie-lərdən istifadə edir.</p>
          <h2 className="text-xl font-bold text-white">Cookie Nədir?</h2>
          <p>Cookie-lər veb saytı ziyarət etdiyiniz zaman cihazınızda saxlanılan kiçik mətn fayllarıdır.</p>
          <h2 className="text-xl font-bold text-white">Necə İstifadə Edirik?</h2>
          <p>Biz cookie-ləri saytın fəaliyyətini analiz etmək və admin panelinə giriş seanslarını idarə etmək üçün istifadə edirik.</p>
          <p className="pt-4 text-sm text-gray-500">Son yenilənmə: {new Date().toLocaleDateString('az-AZ')}</p>
        </div>
      </div>
    </div>
  );
}
