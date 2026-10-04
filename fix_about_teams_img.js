const fs = require('fs');
let file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// ABOUT section image
content = content.replace(
  /<div className="w-full h-full min-h-\[300px\] bg-\[\#0a1628\]\/10"><\/div>/,
  `{siteSettings?.about_bg_image ? (
                  <img src={siteSettings.about_bg_image} alt="About Us" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full min-h-[300px] bg-[#0a1628]/10 flex items-center justify-center text-[var(--ks-kinpaku)]">
                    Şəkil
                  </div>
                )}`
);
content = content.replace(
  /<div className="flex-1 rounded-\[2rem\] overflow-hidden bg-gray-200">/,
  `<div className="flex-1 rounded-[2rem] overflow-hidden bg-gray-200 group">`
);

// TEAMS section
const oldTeams = `{/* Komandalar */}
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">{t('teams_label', lang)}</p>
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8">
              <h2 className="text-3xl md:text-5xl font-black font-condensed uppercase text-[var(--ks-ink)] leading-[0.9]">
                {t('teams_title', lang)}
              </h2>
              <Link href="/komandalar" className="ks-button ks-button-secondary !border-[var(--ks-ink)]/20 text-[var(--ks-ink)] hover:!bg-[var(--ks-ink)] hover:!text-white hidden md:inline-flex">
                Bütün komandalar
              </Link>
            </div>`;

const newTeams = `{/* Komandalar */}
            <div className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 text-white bg-[#0a1628] mt-16 group">
              {siteSettings?.teams_bg_image && (
                <img src={siteSettings.teams_bg_image} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" />
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
                </div>`;

content = content.replace(oldTeams, newTeams);

// Close the wrapper
const oldGridEnd = `                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>`;

const newGridEnd = `                </Link>
              ))}
            </div>
            </div>
            </div>
          </FadeIn>
        </div>
      </section>`;

content = content.replace(oldGridEnd, newGridEnd);

fs.writeFileSync(file, content, 'utf8');
