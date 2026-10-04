export const dynamic = 'force-dynamic';

import FadeIn from '@/components/FadeIn';

export default function ContactPage() {
  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)] pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      
      {/* HERO SECTION */}
      <div className="relative rounded-[2rem] overflow-hidden min-h-[10vh] flex flex-col justify-end p-6 md:p-8 bg-[#0a1628] mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0" />
        <div className="relative z-10 max-w-4xl">
          <FadeIn>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">BİZİMLƏ ƏLAQƏ</p>
            <h1 className="text-4xl sm:text-3xl md:text-5xl font-black font-condensed uppercase tracking-normal text-white leading-[0.85] drop-shadow-xl">
              ƏLAQƏ SAXLAYIN
            </h1>
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* CONTACT INFO & MAP */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 shrink-0">
            <div className="bg-[#0a1628] text-white rounded-[2rem] p-8 md:p-10 shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 text-[var(--ks-kinpaku)]/10 font-black text-9xl">Y</div>
              
              <h2 className="text-3xl font-black font-condensed uppercase mb-8 text-[var(--ks-kinpaku)]">Əlaqə Məlumatları</h2>
              
              <ul className="space-y-6 relative z-10">
                
                <li>
                  <p className="text-[var(--ks-kinpaku)] font-mono text-xs uppercase tracking-widest mb-1">Ünvanlar</p>
                  <p className="font-bold text-lg leading-tight">📍 Kristal Abşeron 1 Xırdalan şəhəri Meydança <br/> (Həmçinin: Masazır, Hökməli, Mehdiabad, Məmmədli)</p>
                </li>
                <li>
                  <p className="text-[var(--ks-kinpaku)] font-mono text-xs uppercase tracking-widest mb-1">Telefon / WhatsApp</p>
                  <p className="font-bold text-xl leading-tight">+994 55 447 74 67</p>
                </li>
                <li>
                  <p className="text-[var(--ks-kinpaku)] font-mono text-xs uppercase tracking-widest mb-1">E-poçt</p>
                  <p className="font-bold text-lg leading-tight">info@yarmadafc.com</p>
                </li>
              </ul>

              <div className="mt-12 flex gap-4 relative z-10">
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--ks-kinpaku)] hover:text-[#0a1628] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--ks-kinpaku)] hover:text-[#0a1628] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--ks-kinpaku)] hover:text-[#0a1628] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
              </div>
            </div>

            <div className="rounded-[2rem] h-full min-h-[300px] overflow-hidden border border-gray-300 relative shadow-lg">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.786520330835!2d49.73164121540113!3d40.45521417936166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403085bd9f9e5c9b%3A0x6b446a6f1d141e17!2sKristal%20Abseron%201!5e0!3m2!1sen!2s!4v1684784949282!5m2!1sen!2s" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>

        </div>
      </FadeIn>

    </main>
  );
}
