const fs = require('fs');
const path = require('path');

const filePatterns = ['.tsx', '.css'];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Backgrounds
  content = content.replace(/bg-\[\#0d1a2d\]/g, 'bg-[#0a0a0a]');
  content = content.replace(/bg-\[\#152741\]/g, 'bg-[#141414]');
  content = content.replace(/bg-\[\#0B1221\]/g, 'bg-[#0a0a0a]');
  content = content.replace(/bg-\[\#1c2d47\]/g, 'bg-[#1f1f1f]');
  
  // Custom CSS colors
  content = content.replace(/--ks-ink: #152741;/g, '--ks-ink: #0a0a0a;');
  content = content.replace(/--ks-instrument: #152741;/g, '--ks-instrument: #141414;');
  content = content.replace(/--ks-instrument-deep: #050b14;/g, '--ks-instrument-deep: #000000;');
  content = content.replace(/--ks-instrument-raised: #15294a;/g, '--ks-instrument-raised: #1f1f1f;');
  content = content.replace(/#152741/g, '#0a0a0a'); // global catch-all for remaining body styles in css

  // Borders
  content = content.replace(/border-\[\#152741\]/g, 'border-[#1a1a1a]');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated colors in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else {
      if (filePatterns.some(ext => fullPath.endsWith(ext))) {
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir('./src');
