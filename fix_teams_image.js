const fs = require('fs');
let file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The BİZ KİMİK image place (there's a placeholder already)
content = content.replace(
  /<div className="w-full h-full min-h-\[300px\] bg-\[\#0a1628\]\/10"><\/div>/,
  `{siteSettings?.about_bg_image ? (
    <img src={siteSettings.about_bg_image} alt="Klub" className="w-full h-full min-h-[300px] object-cover" />
  ) : (
    <div className="w-full h-full min-h-[300px] bg-[#0a1628]/10 flex items-center justify-center text-gray-400">Şəkil</div>
  )}`
);

// For KOMANDALAR
content = content.replace(
  /\{\/\* Komandalar \*\/\}\s*<p className="font-mono text-sm uppercase tracking-\[0\.2em\] text-\[\#0a1628\]\/60 mb-4 font-bold">AKADEMİYA<\/p>\s*<div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8">\s*<h2 className="text-3xl md:text-5xl font-black font-condensed uppercase text-\[var\(--ks-ink\)\] leading-\[0\.9\]">\s*KOMANDALARIMIZ\s*<\/h2>\s*<Link href="\/komandalar" className="ks-button ks-button-secondary !border-\[var\(--ks-ink\)\]\/20 text-\[var\(--ks-ink\)\] hover:!bg-\[var\(--ks-ink\)\] hover:!text-white hidden md:inline-flex">\s*Bütün komandalar\s*<\/Link>\s*<\/div>/,
  `{/* Komandalar */}
            <div className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 text-white bg-[#0a1628]">
              {siteSettings?.teams_bg_image && (
                <img src={siteSettings.teams_bg_image} className="absolute inset-0 w-full h-full object-cover opacity-30" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0"></div>
              <div className="relative z-10">
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">{t('teams_label', lang)}</p>
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8">
                  <h2 className="text-3xl md:text-5xl font-black font-condensed uppercase leading-[0.9]">
                    {t('teams_title', lang)}
                  </h2>
                  <Link href="/komandalar" className="ks-button !bg-[var(--ks-kinpaku)] !text-[#0a1628] hover:!bg-white hidden md:inline-flex font-bold">
                    Bütün komandalar
                  </Link>
                </div>
              </div>`
);

// We need to close the div for komandalar after the grid. The grid ends around </div> </div> </FadeIn>
// Wait, the easiest way is to close the newly wrapped <div> right after the grid.
content = content.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">[\s\S]*?<\/div>\s*<\/FadeIn>/,
  (match) => match.replace(/<\/FadeIn>$/, '</div></FadeIn>') // Add a closing div before FadeIn ends
);

fs.writeFileSync(file, content, 'utf8');
