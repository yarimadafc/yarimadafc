const fs = require('fs');
let file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldChunk = `            {/* Komandalar */}
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">AKADEMİYA</p>
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8">
              <h2 className="text-3xl md:text-5xl font-black font-condensed uppercase text-[var(--ks-ink)] leading-[0.9]">
                KOMANDALAR
              </h2>
              <Link href="/komandalar" className="text-sm font-bold uppercase tracking-wider text-[var(--ks-kinpaku-rich)] hover:text-[var(--ks-ink)] transition-colors inline-block pb-1 border-b border-[var(--ks-kinpaku-rich)] md:border-none">
                Bütün yaş qrupları →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['U-12', 'U-11', 'U-10', 'U-9'].map((age) => (
                <Link key={age} href={\`/komandalar?age=\${age}\`} className="group aspect-square rounded-[2rem] bg-white flex flex-col items-center justify-center p-6 hover:border-[var(--ks-kinpaku)] hover:transition-all">
                  <div className="w-16 h-16 rounded-full bg-[#0a1628]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-black text-[var(--ks-ink)]">{age}</span>
                  </div>
                  <span className="font-bold text-[var(--ks-ink)] group-hover:text-[var(--ks-kinpaku-deep)]">Komandası</span>
                </Link>
              ))}
            </div>`;

const newChunk = `            {/* Komandalar */}
            <div className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 text-white bg-[#0a1628] mt-16 group">
              {siteSettings?.teams_bg_image && (
                <img src={siteSettings.teams_bg_image} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000 z-0" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0"></div>
              <div className="relative z-10">
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">AKADEMİYA</p>
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8">
                  <h2 className="text-3xl md:text-5xl font-black font-condensed uppercase leading-[0.9]">
                    KOMANDALAR
                  </h2>
                  <Link href="/komandalar" className="text-sm font-bold uppercase tracking-wider text-[var(--ks-kinpaku-rich)] hover:text-white transition-colors inline-block pb-1 border-b border-[var(--ks-kinpaku-rich)] md:border-none">
                    Bütün yaş qrupları →
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['U-12', 'U-11', 'U-10', 'U-9'].map((age) => (
                    <Link key={age} href={\`/komandalar?age=\${age}\`} className="group aspect-square rounded-[2rem] bg-white/10 backdrop-blur-md flex flex-col items-center justify-center p-6 hover:bg-[var(--ks-kinpaku)] hover:transition-all">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-black text-white group-hover:text-[#0a1628]">{age}</span>
                      </div>
                      <span className="font-bold text-white group-hover:text-[#0a1628]">Komandası</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>`;

content = content.replace(oldChunk, newChunk);
fs.writeFileSync(file, content, 'utf8');
