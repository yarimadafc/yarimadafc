import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--surface-2)] text-white pt-32 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-[#112240] p-8 md:p-12 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-8 text-[#d7bf7b]">İstifadə Şərtləri</h1>
        <div className="space-y-6 text-gray-300">
          <p>Bu istifadə şərtləri Yarımada FK veb saytının istifadəsini tənzimləyir. Sayta daxil olmaqla bu şərtlərlə razılaşmış olursunuz.</p>
          <h2 className="text-xl font-bold text-white">1. Ümumi Müddəalar</h2>
          <p>Veb saytdakı bütün məzmun (mətnlər, qrafiklər, loqolar) Yarımada FK-nın mülkiyyətidir və qorunur.</p>
          <h2 className="text-xl font-bold text-white">2. İstifadədə Məhdudiyyətlər</h2>
          <p>Saytın işinə mane olacaq hər hansı fəaliyyət qadağandır.</p>
          <p className="pt-4 text-sm text-[var(--text-muted)]">Son yenilənmə: {new Date().toLocaleDateString('az-AZ')}</p>
        </div>
      </div>
    </div>
  );
}
