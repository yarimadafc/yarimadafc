export const dynamic = 'force-dynamic';

import FadeIn from '@/components/FadeIn';

export default function RegistrationPage() {
  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)] pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      
      {/* HERO SECTION */}
      <div className="relative rounded-[2rem] overflow-hidden min-h-[40vh] flex flex-col justify-end p-8 md:p-12 bg-[#0a1628] mb-12 text-center md:text-left">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0" />
        <div className="relative z-10 max-w-4xl">
          <FadeIn>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">AKADEMİYA</p>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black font-condensed uppercase tracking-normal text-white leading-[0.85] drop-shadow-xl mb-6">
              BİZƏ QOŞUL
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl font-medium">Övladınızın futbol xəyallarını gerçəkləşdirmək üçün ilk addımı atın. Yarımada FK ailəsinə xoş gəldiniz!</p>
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={0.1}>
        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-8 md:p-16 border border-gray-100 shadow-xl relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ks-kinpaku)]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

          <h2 className="text-4xl font-black font-condensed uppercase mb-10 text-center relative z-10 border-b border-gray-100 pb-8">
            Futbolçu Qeydiyyat Forması
          </h2>
          
          <form className="flex flex-col gap-8 relative z-10">
            
            {/* CHILD INFO */}
            <div className="bg-gray-50 p-8 rounded-[1.5rem] border border-gray-100">
              <h3 className="font-bold text-[var(--ks-kinpaku-rich)] uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--ks-kinpaku)]/20 flex items-center justify-center font-mono">1</span>
                Uşağın Məlumatları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Ad</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)]" placeholder="Uşağın adı" required />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Soyad</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)]" placeholder="Uşağın soyadı" required />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Doğum Tarixi</label>
                  <input type="date" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)]" required />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Yaş Qrupu (Seçim)</label>
                  <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)]">
                    <option value="">Seçin</option>
                    <option value="U-9">U-9 (2017-2018)</option>
                    <option value="U-10">U-10 (2016)</option>
                    <option value="U-11">U-11 (2015)</option>
                    <option value="U-12">U-12 (2014)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PARENT INFO */}
            <div className="bg-gray-50 p-8 rounded-[1.5rem] border border-gray-100">
              <h3 className="font-bold text-[var(--ks-kinpaku-rich)] uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--ks-kinpaku)]/20 flex items-center justify-center font-mono">2</span>
                Valideyn Məlumatları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Ad və Soyad</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)]" placeholder="Valideynin adı və soyadı" required />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Əlaqə Nömrəsi</label>
                  <input type="tel" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)]" placeholder="+994 (__) ___-__-__" required />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">WhatsApp Nömrəsi</label>
                  <input type="tel" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)]" placeholder="+994 (__) ___-__-__" />
                </div>
              </div>
            </div>

            {/* EXTRA INFO */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2 pl-2">Əlavə qeydlər (istəyə görə)</label>
              <textarea rows={4} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)] resize-none" placeholder="Uşağın əvvəlki futbol təcrübəsi, sağlamlıq vəziyyəti və s. haqqında məlumat yaza bilərsiniz."></textarea>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <input type="checkbox" id="terms" className="w-5 h-5 accent-[var(--ks-kinpaku)]" required />
              <label htmlFor="terms" className="text-sm text-gray-600 font-medium cursor-pointer">
                <a href="/istifade-sertleri" className="text-[var(--ks-ink)] font-bold hover:underline">İstifadə şərtləri</a> və <a href="/mexfilik" className="text-[var(--ks-ink)] font-bold hover:underline">Məxfilik siyasəti</a> ilə razıyam.
              </label>
            </div>

            <button type="button" className="ks-button w-full md:w-auto md:self-end !bg-[var(--ks-ink)] !text-[var(--ks-kinpaku)] hover:!bg-[#15294a] !rounded-full !px-12 !py-5 font-black uppercase tracking-widest text-lg mt-4 shadow-lg transition-all">
              Müraciəti Göndər &rarr;
            </button>
          </form>

        </div>
      </FadeIn>

    </main>
  );
}
