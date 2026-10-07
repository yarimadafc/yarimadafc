const fs = require('fs');
const glob = require('glob');

// 1. Fix PageTransition
let ptContent = fs.readFileSync('src/components/PageTransition.tsx', 'utf-8');
ptContent = ptContent.replace('pt-32', 'pt-36'); // push down
ptContent = ptContent.replace('text-4xl md:text-6xl', 'text-3xl md:text-4xl'); // smaller font
fs.writeFileSync('src/components/PageTransition.tsx', ptContent);

// 2. Fix other app pages
const files = glob.sync('src/app/**/*.tsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Push down
  if (content.includes('pt-24 min-h-screen')) {
    content = content.replace(/pt-24 min-h-screen/g, 'pt-36 min-h-screen');
    changed = true;
  }
  
  if (content.includes('py-16 md:py-24')) {
    // maybe reduce padding on the header block? No, just keep it.
  }

  // Smaller fonts for main headers
  if (content.includes('text-4xl md:text-6xl')) {
    content = content.replace(/text-4xl md:text-6xl/g, 'text-3xl md:text-5xl');
    changed = true;
  }
  
  // Smaller fonts for sub headers
  if (content.includes('text-3xl md:text-5xl')) {
    content = content.replace(/text-3xl md:text-5xl/g, 'text-2xl md:text-4xl');
    changed = true;
  }

  if (changed) fs.writeFileSync(file, content);
});

