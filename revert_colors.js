const fs = require('fs');
const path = require('path');

const filePatterns = ['.tsx', '.css'];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Backgrounds
  content = content.replace(/bg-\[\#0a0a0a\]/g, 'bg-[#0d1a2d]');
  content = content.replace(/bg-\[\#141414\]/g, 'bg-[#152741]');
  content = content.replace(/bg-\[\#1f1f1f\]/g, 'bg-[#1c2d47]');
  content = content.replace(/bg-\[\#000000\]/g, 'bg-[#0a1423]');
  content = content.replace(/bg-\[\#111111\]/g, 'bg-[#112240]');
  content = content.replace(/bg-\[\#1a1a1a\]/g, 'bg-[#1a2e4c]');

  // Custom CSS colors
  content = content.replace(/--ks-ink: #0a0a0a;/g, '--ks-ink: #152741;');
  content = content.replace(/--ks-instrument: #141414;/g, '--ks-instrument: #152741;');
  content = content.replace(/--ks-instrument-deep: #000000;/g, '--ks-instrument-deep: #050b14;');
  content = content.replace(/--ks-instrument-raised: #1f1f1f;/g, '--ks-instrument-raised: #15294a;');
  
  // Also border colors to match new backgrounds
  content = content.replace(/border-\[\#1a1a1a\]/g, 'border-[#152741]');
  content = content.replace(/border-\[\#1f1f1f\]/g, 'border-[#1c2d47]');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Reverted colors in ${filePath}`);
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
