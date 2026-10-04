const fs = require('fs');
let file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

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

fs.writeFileSync(file, content, 'utf8');
