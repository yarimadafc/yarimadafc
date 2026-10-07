const fs = require('fs');
const path = require('path');

const dir = 'src/app';

function getFiles(baseDir) {
  let results = [];
  const list = fs.readdirSync(baseDir);
  list.forEach(file => {
    file = path.join(baseDir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else {
      if (file.endsWith('page.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = getFiles(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Move away from top bar
  content = content.replace(/pt-\[140px\]/g, 'pt-[180px]');

  // 2. Center titles
  // Matches <motion.h1 ...> or <h1 ...>
  // and looks for the inner absolute line to center it too.
  
  if (content.includes('border-b border-bg-border pb-4 flex items-center')) {
    content = content.replace('border-b border-bg-border pb-4 flex items-center', 'border-b border-bg-border pb-4 flex justify-center items-center text-center');
  } else if (content.includes('border-b border-bg-border pb-4')) {
    content = content.replace('border-b border-bg-border pb-4', 'border-b border-bg-border pb-4 text-center flex justify-center');
  }

  // Center the little accent bar above the text
  content = content.replace(/absolute -top-4 left-0/g, 'absolute -top-4 left-1/2 -translate-x-1/2');

  // Specific for coaches/page.tsx since it has a huge banner header
  if (file.endsWith('coaches/page.tsx')) {
    // it's already text-center
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Centered headers in ${file}`);
  }
});

