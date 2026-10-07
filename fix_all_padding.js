const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  if (content.includes('pt-24')) {
    content = content.replace(/pt-24/g, 'pt-32');
    changed = true;
  }
  if (content.includes('pt-36')) {
    content = content.replace(/pt-36/g, 'pt-32');
    changed = true;
  }
  if (content.includes('py-16 md:py-24')) {
    content = content.replace(/py-16 md:py-24/g, 'py-12 md:py-16');
    changed = true;
  }
  
  // Also adjust fonts inside these blocks from text-3xl md:text-5xl to text-2xl md:text-4xl
  if (content.includes('text-4xl md:text-6xl')) {
    content = content.replace(/text-4xl md:text-6xl/g, 'text-2xl md:text-4xl');
    changed = true;
  }
  if (content.includes('text-3xl md:text-5xl')) {
    content = content.replace(/text-3xl md:text-5xl/g, 'text-2xl md:text-4xl');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
  }
});
