import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder with Overlay */}
        <div className="absolute inset-0 bg-gray-800">
          {/* Using a gradient overlay to match the design description */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl w-full mx-auto px-4 flex flex-col justify-end h-full pb-16">
          <p className="font-mono uppercase tracking-widest text-sm text-[#00e5a0] mb-4">
            2026/27 MÖVSÜM
          </p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-wider text-white mb-6">
            BU YARIMADA FK.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
            Bakının ən gənc futbol akademiyası. Hər oyunu, hər komandanı və hər anı yaxından izlə.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/join" 
              className="bg-[#00e5a0] text-[#0a1628] font-bold uppercase tracking-wider rounded-full px-8 py-4 hover:bg-[#00c98b] transition-colors"
            >
              Akademiyaya Qoşul
            </Link>
            <Link 
              href="/matches" 
              className="bg-transparent border border-white text-white font-bold uppercase tracking-wider rounded-full px-8 py-4 hover:bg-white/10 transition-colors"
            >
              Oyunlara bax
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MEMBERSHIP/JOIN SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-[#f0f2f5] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="font-mono uppercase tracking-widest text-sm text-[#00e5a0] mb-4">
              AKADEMİYA
            </p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-[#0a1628] mb-6">
              YARIMADA FK AKADEMİYASINA QOŞUL
            </h2>
            <p className="text-[#0a1628]/70 mb-8 text-lg">
              Peşəkar məşqçilər, müasir infrastruktur və gələcəyin ulduzları arasında yerini al. Karyerana bizimlə başla!
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-[#00e5a0] text-[#0a1628] font-bold uppercase tracking-wider rounded-full px-8 py-4 hover:bg-[#00c98b] transition-colors"
            >
              Qeydiyyatdan keç
            </Link>
          </div>
          <div className="w-full md:w-[400px] h-[300px] bg-gray-300 rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-gray-500 font-bold uppercase">Image Placeholder (350x250)</span>
          </div>
        </div>
      </section>

      {/* 3. NEXT MATCH SECTION */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-[#f0f2f5] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-[400px] h-[300px] bg-gray-300 rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-gray-500 font-bold uppercase">Match Image Placeholder</span>
          </div>
          <div className="flex-1">
            <p className="font-mono uppercase tracking-widest text-sm text-[#00e5a0] mb-4">
              NÖVBƏTİ OYUN
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-[#0a1628] mb-6">
              YARIMADA FK vs. BAKI SPOR
            </h2>
            <div className="space-y-2 mb-8 text-[#0a1628]/80 text-lg">
              <p><strong>Tarix:</strong> 15 Oktyabr 2026, 18:00</p>
              <p><strong>Məkan:</strong> Yarımada Arena</p>
              <p><strong>Turnir:</strong> Həvəskarlar Liqası</p>
            </div>
            <Link 
              href="/match/next" 
              className="inline-block bg-[#00e5a0] text-[#0a1628] font-bold uppercase tracking-wider rounded-full px-8 py-4 hover:bg-[#00c98b] transition-colors"
            >
              Ətraflı
            </Link>
          </div>
        </div>
      </section>

      {/* 4. LATEST NEWS SECTION */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="font-mono uppercase tracking-widest text-sm text-[#00e5a0] mb-4">
              SON XƏBƏRLƏR
            </p>
            <h2 className="text-4xl font-black uppercase tracking-wider text-[#0a1628]">
              YARIMADA FK-DAN XƏBƏRLƏR
            </h2>
          </div>
          <Link 
            href="/news" 
            className="inline-block bg-transparent border-2 border-[#0a1628] text-[#0a1628] font-bold uppercase tracking-wider rounded-full px-8 py-4 hover:bg-[#0a1628] hover:text-white transition-colors"
          >
            Bütün xəbərlər
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* News Card 1 */}
          <div className="bg-[#f0f2f5] rounded-2xl overflow-hidden flex flex-col">
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 font-bold text-sm uppercase">News Image</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="font-mono text-sm text-[#0a1628]/60 mb-2">Okt 8, 2026</p>
              <h3 className="text-xl font-bold uppercase text-[#0a1628] mb-3 leading-snug">
                Yarımada Derbidə Son Dəqiqə Qələbəsi Qazandı
              </h3>
              <p className="text-[#0a1628]/70 text-sm mt-auto">
                Klubumuz həlledici derbi oyununda son dəqiqə qolu ilə əzmkar qələbə qazandı...
              </p>
            </div>
          </div>

          {/* News Card 2 */}
          <div className="bg-[#f0f2f5] rounded-2xl overflow-hidden flex flex-col">
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 font-bold text-sm uppercase">News Image</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="font-mono text-sm text-[#0a1628]/60 mb-2">Okt 5, 2026</p>
              <h3 className="text-xl font-bold uppercase text-[#0a1628] mb-3 leading-snug">
                Akademiya Məzunu İlk Peşəkar Müqaviləsini İmzaladı
              </h3>
              <p className="text-[#0a1628]/70 text-sm mt-auto">
                U-19 komandasının parlaq üzvü A komanda ilə 3 illik müqavilə imzaladı...
              </p>
            </div>
          </div>

          {/* News Card 3 */}
          <div className="bg-[#f0f2f5] rounded-2xl overflow-hidden flex flex-col">
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 font-bold text-sm uppercase">News Image</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="font-mono text-sm text-[#0a1628]/60 mb-2">Okt 2, 2026</p>
              <h3 className="text-xl font-bold uppercase text-[#0a1628] mb-3 leading-snug">
                Klub Yeni Yarımmüdafiəçinin Transferini Tamamladı
              </h3>
              <p className="text-[#0a1628]/70 text-sm mt-auto">
                Yarımada FK mərkəz xəttini gücləndirmək üçün gənc istedadı rənglərinə bağladı...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STADIUM/ABOUT SECTION */}
      <section className="w-full relative h-[500px] flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gray-800">
          <div className="absolute inset-0 bg-[#0a1628]/80 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <p className="font-mono uppercase tracking-widest text-sm text-[#00e5a0] mb-6">
            AKADEMİYA
          </p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wider mb-6">
            YARIMADA FK AKADEMİYASINI KƏŞF ET
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Ən yüksək standartlara cavab verən təlim mərkəzimiz gənclərin fiziki və taktiki hazırlığı üçün xüsusi olaraq dizayn edilib.
          </p>
          <Link 
            href="/academy" 
            className="inline-block bg-[#0a1628] border border-white/20 text-white font-bold uppercase tracking-wider rounded-full px-8 py-4 hover:bg-white hover:text-[#0a1628] transition-colors"
          >
            Ətraflı
          </Link>
        </div>
      </section>

      {/* 6. SPONSOR SECTION */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-[#f0f2f5] rounded-3xl p-8 md:p-12 text-center flex flex-col items-center">
          <p className="font-mono uppercase tracking-widest text-sm text-[#00e5a0] mb-8">
            TƏRƏFDAŞIMIZ
          </p>
          <div className="w-24 h-24 bg-gray-300 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-gray-500 text-xs font-bold uppercase">Logo</span>
          </div>
          <h2 className="text-3xl font-black uppercase text-[#0a1628] mb-4">
            AQUAVITA
          </h2>
          <p className="text-[#0a1628]/70 max-w-xl mx-auto mb-6">
            Yarımada FK-nın rəsmi tərəfdaşı və gənc istedadların ən böyük dəstəkçisi. Birlikdə daha güclüyük.
          </p>
          <span className="inline-block font-mono bg-white text-[#0a1628] px-4 py-2 rounded-lg text-sm border border-gray-200 uppercase">
            Əsas Tərəfdaş
          </span>
        </div>
      </section>
    </main>
  );
}
