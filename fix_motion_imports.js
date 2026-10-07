const fs = require('fs');

const files = ['src/app/standings/page.tsx', 'src/app/media/page.tsx'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('framer-motion') && content.includes('<motion.div')) {
      content = `'use client';\nimport { motion } from 'framer-motion';\n` + content;
      fs.writeFileSync(file, content);
    }
  }
});
