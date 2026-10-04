export const dynamic = 'force-dynamic';

import FadeIn from '@/components/FadeIn';

export default function ContactPage() {
  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)] pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      
      {/* HERO SECTION */}
      <div className="relative rounded-[2rem] overflow-hidden min-h-[30vh] flex flex-col justify-end p-8 md:p-12 bg-[#0a1628] mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0" />
        <div className="relative z-10 max-w-4xl">
          <FadeIn>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">BİZİMLƏ ƏLAQƏ</p>
            <h1 className="text-6xl md:text-8xl font-black font-condensed uppercase tracking-normal text-white leading-[0.85] drop-shadow-xl">
              ƏLAQƏ SAXLAYIN
            </h1>
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* CONTACT FORM */}
          <div className="flex-1 bg-[var(--ks-paper-deep)] rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-sm">
            <h2 className="text-4xl font-black font-condensed uppercase mb-8">Mesaj Göndərin</h2>
            
            <form className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Adınız</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)] transition-colors" placeholder="Ad və Soyad" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Əlaqə Nömrəsi</label>
                  <input type="tel" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)] transition-colors" placeholder="+994 (__) ___-__-__" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">E-poçt</label>
                <input type="email" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)] transition-colors" placeholder="nümunə@email.com" />
              </div>
              
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Mövzu</label>
                <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)] transition-colors" placeholder="Nə barədə yazırsınız?" />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Mesajınız</label>
                <textarea rows={5} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ks-kinpaku)] focus:ring-1 focus:ring-[var(--ks-kinpaku)] transition-colors resize-none" placeholder="Mesajınızı bura daxil edin..."></textarea>
              </div>

              <button type="button" className="ks-button !bg-[var(--ks-ink)] !text-[var(--ks-kinpaku)] hover:!bg-[#15294a] !rounded-xl !py-4 font-black uppercase tracking-widest text-lg mt-4 shadow-md transition-all">
                Göndər
              </button>
            </form>
          </div>

          {/* CONTACT INFO & MAP */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8 shrink-0">
            <div className="bg-[#0a1628] text-white rounded-[2rem] p-8 md:p-10 shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 text-[var(--ks-kinpaku)]/10 font-black text-9xl">Y</div>
              
              <h2 className="text-3xl font-black font-condensed uppercase mb-8 text-[var(--ks-kinpaku)]">Əlaqə Məlumatları</h2>
              
              <ul className="space-y-8 relative z-10">
                <li>
                  <p className="text-[var(--ks-kinpaku)] font-mono text-xs uppercase tracking-widest mb-1">Ünvan</p>
                  <p className="font-bold text-lg leading-tight">Bakı ş., Nərimanov r.,<br/>Əhməd Rəcəbli küç. 15</p>
                </li>
                <li>
                  <p className="text-[var(--ks-kinpaku)] font-mono text-xs uppercase tracking-widest mb-1">Telefon / WhatsApp</p>
                  <p className="font-bold text-lg leading-tight">+994 50 123 45 67</p>
                </li>
                <li>
                  <p className="text-[var(--ks-kinpaku)] font-mono text-xs uppercase tracking-widest mb-1">E-poçt</p>
                  <p className="font-bold text-lg leading-tight">info@yarimadafc.az</p>
                </li>
              </ul>

              <div className="mt-12 flex gap-4 relative z-10">
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--ks-kinpaku)] hover:text-[#0a1628] transition-colors">FB</a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--ks-kinpaku)] hover:text-[#0a1628] transition-colors">IN</a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--ks-kinpaku)] hover:text-[#0a1628] transition-colors">YT</a>
              </div>
            </div>

            <div className="bg-gray-200 rounded-[2rem] h-64 overflow-hidden border border-gray-300 relative group cursor-pointer">
              <div className="absolute inset-0 bg-[#0a1628]/10 group-hover:bg-transparent transition-colors z-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur px-6 py-2 rounded-full font-bold shadow-md text-[#0a1628] z-20 group-hover:scale-105 transition-transform">Xəritədə Bax</span>
              </div>
              {/* Google Maps placeholder */}
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=Baku,Azerbaijan&zoom=13&size=600x300&maptype=roadmap&key=mock')" }}></div>
            </div>
          </div>

        </div>
      </FadeIn>

    </main>
  );
}
