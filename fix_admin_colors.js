const fs = require('fs');
const path = require('path');

const dir = 'src/app/admin';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/bg-bg-main/g, 'bg-gray-900');
  content = content.replace(/bg-bg-sec/g, 'bg-gray-800');
  content = content.replace(/bg-bg-deep/g, 'bg-black');
  content = content.replace(/bg-bg-card/g, 'bg-gray-800');
  content = content.replace(/bg-bg-border/g, 'bg-gray-700');
  content = content.replace(/border-bg-border/g, 'border-gray-700');
  
  content = content.replace(/text-text-main/g, 'text-white');
  content = content.replace(/text-text-sec/g, 'text-gray-400');
  
  content = content.replace(/hover:bg-bg-border/g, 'hover:bg-gray-700');
  content = content.replace(/hover:text-text-main/g, 'hover:text-white');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed admin colors in ${filePath}`);
  }
}

function walkDir(d) {
  const files = fs.readdirSync(d);
  for (const file of files) {
    const fullPath = path.join(d, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(dir);
