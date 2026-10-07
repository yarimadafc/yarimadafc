const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// I need to add </section> just before {/* 2. Sürətli Keçidlər...
content = content.replace(
  /\{\/\* 2\. Sürətli Keçidlər \(4-lü Grid\) \*\/\}/,
  `</section>\n\n        {/* 2. Sürətli Keçidlər (4-lü Grid) */}`
);

fs.writeFileSync('src/app/page.tsx', content);
