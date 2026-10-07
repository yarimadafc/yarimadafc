const fs = require('fs');
let content = fs.readFileSync('src/app/media/page.tsx', 'utf-8');

content = content.replace(
  /<\/div>\n    <\/motion\.div>\n  \);\n\}/,
  `    </div>\n      </div>\n    </motion.div>\n  );\n}`
);

fs.writeFileSync('src/app/media/page.tsx', content);
