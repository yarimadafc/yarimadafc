const fs = require('fs');
let file = 'src/components/ClientLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

const lockScreen = `
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl">
        <div className="bg-[#0a1628] p-8 rounded-3xl shadow-2xl border border-white/10 flex flex-col items-center text-center max-w-sm mx-4 transform scale-100 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(215,191,123,0.15)]">
            <svg className="w-10 h-10 text-[var(--ks-kinpaku)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 tracking-wider">YARIMADA FK</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Saytımızda hazırda yenilənmə və tənzimləmə işləri gedir. Tezliklə tam versiya ilə xidmətinizdə olacağıq.</p>
        </div>
      </div>

      <div className="pointer-events-none select-none h-screen overflow-hidden opacity-40">
        <Navbar />
        {children}
        <Footer />
      </div>
`;

content = content.replace(/<ReactLenis root options=\{\{ lerp: 0\.05, duration: 1\.5, smoothWheel: true \}\}>[\s\S]*?<\/ReactLenis>/, lockScreen);

fs.writeFileSync(file, content, 'utf8');
