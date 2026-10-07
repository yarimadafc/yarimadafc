const fs = require('fs');
const glob = require('glob');

const files = ['src/app/matches/page.tsx', 'src/app/shop/page.tsx', 'src/app/academy/page.tsx', 'src/app/standings/page.tsx', 'src/app/media/page.tsx'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Remove PageTransition import
    content = content.replace(/import PageTransition from '@\/components\/PageTransition';\n/g, '');
    
    // Replace <PageTransition title="..."> with <> or a basic motion.div
    content = content.replace(/<PageTransition title=".*?">/g, '<motion.div\n      initial={{ opacity: 0 }}\n      animate={{ opacity: 1 }}\n      exit={{ opacity: 0 }}\n    >');
    content = content.replace(/<\/PageTransition>/g, '</motion.div>');
    
    // Also fix pt-24 inside them just in case
    content = content.replace(/pt-24 min-h-screen/g, 'pt-32 min-h-screen');
    
    fs.writeFileSync(file, content);
  }
});

