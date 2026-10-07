const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// I will just replace the exact block that causes issues.
content = content.replace(
  `                     </div>\n                   </div>\n                   </div>\n                 </div>\n                 \n               {/* Lineup & Events section */}`,
  `                     </div>\n                 </div>\n\n               {/* Lineup & Events section */}`
);

fs.writeFileSync('src/app/page.tsx', content);
