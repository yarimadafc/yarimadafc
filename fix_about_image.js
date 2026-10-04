const fs = require('fs');
let file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<Link href="\/klub" className="ks-button ks-button-primary !bg-\[var\(--ks-ink\)\] !text-white hover:!bg-\[\#15294a\]">[\s\S]*?<\/Link>\s*<\/div>\s*<\/div>/,
  `<Link href="/klub" className="ks-button ks-button-primary !bg-[var(--ks-ink)] !text-white hover:!bg-[#15294a]">
                  {t('about_btn', lang)} &rarr;
                </Link>
              </div>
              <div className="w-full lg:w-1/3 relative flex-shrink-0 min-h-[300px] bg-gray-100 rounded-3xl overflow-hidden shadow-lg group">
                {siteSettings?.about_bg_image ? (
                  <img src={siteSettings.about_bg_image} alt="About Us" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628]/5 text-[var(--ks-kinpaku)]">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                )}
              </div>
            </div>`
);

fs.writeFileSync(file, content, 'utf8');
