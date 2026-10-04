const fs = require('fs');
let file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inject site_settings fetching
content = content.replace(
  /let heroBanner = null;/,
  `let heroBanner = null;
  let siteSettings: any = {};`
);

content = content.replace(
  /try \{/,
  `try {
    const settingsRes = await supabase.from('site_settings').select('*').single();
    if (settingsRes.data) siteSettings = settingsRes.data;`
);

// 1. Update HERO section background
content = content.replace(
  /<div className="absolute inset-0 bg-\[\#0a1628\] z-\[-2\]"><\/div>/,
  `{siteSettings.hero_bg_image ? (
          <div className="absolute inset-0 z-[-2]">
            <img src={siteSettings.hero_bg_image} alt="Hero Background" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-[#0a1628]/60"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#0a1628] z-[-2]"></div>
        )}`
);

// 2. Update ABOUT section image (BİZ KİMİK?)
content = content.replace(
  /<div className="w-full h-full min-h-\[300px\] bg-\[\#0a1628\]\/10"><\/div>/,
  `{siteSettings?.about_bg_image ? (
                  <img src={siteSettings.about_bg_image} alt="About Us" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full min-h-[300px] bg-[#0a1628]/10 flex items-center justify-center text-[var(--ks-kinpaku)]">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                )}`
);

// We need to wrap it with group to make hover scale work
content = content.replace(
  /<div className="flex-1 rounded-\[2rem\] overflow-hidden bg-gray-200">/,
  `<div className="flex-1 rounded-[2rem] overflow-hidden bg-gray-200 group">`
);

// 3. Update KOMANDALAR section background
const oldKomandalarStr = `{/* Komandalar */}
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">{t('teams_label', lang)}</p>
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8">
              <h2 className="text-3xl md:text-5xl font-black font-condensed uppercase text-[var(--ks-ink)] leading-[0.9]">
                {t('teams_title', lang)}
              </h2>
              <Link href="/komandalar" className="ks-button ks-button-secondary !border-[var(--ks-ink)]/20 text-[var(--ks-ink)] hover:!bg-[var(--ks-ink)] hover:!text-white hidden md:inline-flex">
                Bütün komandalar
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">`;

const newKomandalarStr = `{/* Komandalar */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">`;

content = content.replace(oldKomandalarStr, newKomandalarStr);

// To close the new `<div className="relative rounded-[2rem]...">` and `<div className="relative z-10">`, I need to add 2 `</div>`s at the end of the map.
// The map ends with:
const oldMapEnd = `                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>`;

const newMapEnd = `                </Link>
              ))}
            </div>
            </div>
            </div>
          </FadeIn>
        </div>
      </section>`;

content = content.replace(oldMapEnd, newMapEnd);

fs.writeFileSync(file, content, 'utf8');
