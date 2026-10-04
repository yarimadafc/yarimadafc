import Link from 'next/link';

export default function QeydiyyatPage() {
  return (
    <main className="flex-grow pt-24 pb-20 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="text-gray-500 font-mono text-sm">
            <Link href="/" className="hover:text-black transition-colors">Ana səhifə</Link> / <span className="text-black">Akademiyaya Qoşul</span>
          </p>
        </div>

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black text-[#0a1628] uppercase tracking-tight mb-6">
            Akademiyaya Qoşul
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Yarımada FK akademiyasına qeydiyyatdan keçərək gələcəyin peşəkar futbolçusu olmaq üçün ilk addımını at. Fərqli yaş qrupları və filiallar üçün uyğun paketlərimizlə tanış ol.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-10 rounded-[2rem] shadow-sm flex flex-col h-full border border-gray-100">
            <div className="mb-8">
              <h3 className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-4">Aylıq Ödəniş</h3>
              <h2 className="text-4xl font-black text-[#0a1628] uppercase tracking-tight mb-4">U-9 / U-10</h2>
              <p className="text-gray-600">
                8-10 yaşlı uşaqlar üçün təməl futbol təlimləri. Həftədə 3 dəfə məşq və daxili turnirlərdə iştirak. Təlimlər peşəkar lisenziyalı məşqçilər tərəfindən keçirilir.
              </p>
            </div>
            <div className="mt-auto pt-8">
              <Link href="/qeydiyyat/forma?paket=kicik" className="block w-full text-center bg-[#f0f2f5] hover:bg-[#e2e8f0] text-[#0a1628] font-bold py-4 rounded-full transition-colors uppercase tracking-wider text-sm">
                Qeydiyyatdan Keç
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0a1628] p-10 rounded-[2rem] shadow-xl flex flex-col h-full text-white relative transform md:-translate-y-4">
            <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-[#c9a84c] text-[#0a1628] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full">
              Ən Çox Seçilən
            </div>
            <div className="mb-8">
              <h3 className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-4">Aylıq Ödəniş</h3>
              <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-4">U-11 / U-12</h2>
              <p className="text-gray-300">
                11-12 yaş qrupu üçün inkişaf proqramı. Həftədə 4 məşq, rəsmi AFFA liqasında iştirak hüququ, fərdi inkişaf analizi və tam təchizatlı məşq forması daxildir.
              </p>
            </div>
            <div className="mt-auto pt-8">
              <Link href="/qeydiyyat/forma?paket=orta" className="block w-full text-center bg-[#c9a84c] hover:bg-[#b39542] text-[#0a1628] font-bold py-4 rounded-full transition-colors uppercase tracking-wider text-sm">
                Qeydiyyatdan Keç
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-10 rounded-[2rem] shadow-sm flex flex-col h-full border border-gray-100">
            <div className="mb-8">
              <h3 className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-4">Aylıq Ödəniş</h3>
              <h2 className="text-4xl font-black text-[#0a1628] uppercase tracking-tight mb-4">Fərdi Məşq</h2>
              <p className="text-gray-600">
                Xüsusi diqqət tələb edən oyunçular üçün. Baş məşqçi ilə birəbir məşqlər, fiziki və taktiki göstəricilərin xüsusi inkişaf proqramı. İstənilən yaş qrupu üçün keçərlidir.
              </p>
            </div>
            <div className="mt-auto pt-8">
              <Link href="/qeydiyyat/forma?paket=ferdi" className="block w-full text-center bg-[#f0f2f5] hover:bg-[#e2e8f0] text-[#0a1628] font-bold py-4 rounded-full transition-colors uppercase tracking-wider text-sm">
                Ətraflı Məlumat
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
