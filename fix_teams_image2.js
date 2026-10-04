const fs = require('fs');
let file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Use a simpler string replace
const oldText = `{/* Komandalar */}
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">AKADEMİYA</p>
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8">
              <h2 className="text-3xl md:text-5xl font-black font-condensed uppercase text-[var(--ks-ink)] leading-[0.9]">
                KOMANDALAR
              </h2>
              <Link href="/komandalar" className="ks-button ks-button-secondary !border-[var(--ks-ink)]/20 text-[var(--ks-ink)] hover:!bg-[var(--ks-ink)] hover:!text-white hidden md:inline-flex">
                Bütün komandalar
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">`;

const newText = `{/* Komandalar */}
            <div className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 text-white bg-[#0a1628]">
              {siteSettings?.teams_bg_image && (
                <img src={siteSettings.teams_bg_image} className="absolute inset-0 w-full h-full object-cover opacity-30" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0"></div>
              <div className="relative z-10">
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">AKADEMİYA</p>
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8">
                  <h2 className="text-3xl md:text-5xl font-black font-condensed uppercase leading-[0.9]">
                    KOMANDALAR
                  </h2>
                  <Link href="/komandalar" className="ks-button !bg-[var(--ks-kinpaku)] !text-[#0a1628] hover:!bg-white hidden md:inline-flex font-bold">
                    Bütün komandalar
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">`;

content = content.replace(oldText, newText);

// We need to close the div we opened for the Teams block
// Since the block was inside the `<div className="bg-[var(--ks-paper-deep)] ...">`
// Wait, `<FadeIn>` wraps the whole `<div className="bg-[var(--ks-paper-deep)] ...">`.
// The end of `Komandalar` is where the `coaches` or `teams` map ends.

const closeOld = `                </Link>
              ))}
            </div>
          </FadeIn>
        </div>`;

const closeNew = `                </Link>
              ))}
            </div>
            </div></div>
          </FadeIn>
        </div>`;

content = content.replace(closeOld, closeNew);

fs.writeFileSync(file, content, 'utf8');
