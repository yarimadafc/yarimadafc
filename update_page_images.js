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

// Update HERO section background
content = content.replace(
  /<div className="absolute inset-0 bg-\[\#0a1628\] z-[-2]"><\/div>/,
  `{siteSettings.hero_bg_image ? (
          <div className="absolute inset-0 z-[-2]">
            <img src={siteSettings.hero_bg_image} alt="Hero Background" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-[#0a1628]/60"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#0a1628] z-[-2]"></div>
        )}`
);

// Update ABOUT section image (BİZ KİMİK?)
// Currently the layout is max-w-2xl text, and an empty div on right? Let's check.
content = content.replace(
  /<div className="w-full lg:w-1\/3 relative flex-shrink-0 min-h-\[300px\] bg-gray-100 rounded-3xl overflow-hidden">[\s\S]*?<\/div>/,
  `<div className="w-full lg:w-1/3 relative flex-shrink-0 min-h-[300px] bg-gray-100 rounded-3xl overflow-hidden shadow-lg group">
                {siteSettings.about_bg_image ? (
                  <img src={siteSettings.about_bg_image} alt="About Us" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628]/5 text-[var(--ks-kinpaku)]">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                )}
              </div>`
);

// Update TEAMS section background
// It currently has: <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto relative overflow-hidden">
// Wait, I need to find the TEAMS section wrapper and insert the image.
content = content.replace(
  /<div className="bg-\[\#0a1628\] rounded-\[2rem\] p-8 md:p-16 text-white relative overflow-hidden">/,
  `<div className="bg-[#0a1628] rounded-[2rem] p-8 md:p-16 text-white relative overflow-hidden group">
            {siteSettings.teams_bg_image && (
              <img src={siteSettings.teams_bg_image} alt="Teams Background" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000 z-0" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0"></div>`
);

// Ensure z-index for text inside TEAMS
content = content.replace(
  /<div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4 md:gap-0">/,
  `<div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4 md:gap-0 relative z-10">`
);
content = content.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">/,
  `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">`
);

fs.writeFileSync(file, content, 'utf8');
console.log('page.tsx images injected');
