const fs = require('fs');
const path = require('path');

const filePatterns = ['.tsx'];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Backgrounds
  content = content.replace(/bg-\[\#0a0a0a\]/g, 'bg-bg-main');
  content = content.replace(/bg-\[\#141414\]/g, 'bg-bg-sec');
  content = content.replace(/bg-\[\#000000\]/g, 'bg-bg-deep');
  content = content.replace(/bg-\[\#111111\]/g, 'bg-bg-card');
  content = content.replace(/bg-\[\#1a1a1a\]/g, 'bg-bg-card');
  
  // Gradients
  content = content.replace(/from-\[\#0a0a0a\]/g, 'from-bg-main');
  content = content.replace(/from-\[\#141414\]/g, 'from-bg-sec');
  content = content.replace(/from-\[\#000000\]/g, 'from-bg-deep');
  content = content.replace(/to-\[\#0a0a0a\]/g, 'to-bg-main');
  content = content.replace(/to-\[\#141414\]/g, 'to-bg-sec');
  content = content.replace(/to-\[\#000000\]/g, 'to-bg-deep');
  content = content.replace(/to-transparent/g, 'to-transparent');

  // Borders
  content = content.replace(/border-\[\#1f1f1f\]/g, 'border-bg-border');
  content = content.replace(/border-\[\#1a1a1a\]/g, 'border-bg-border');
  content = content.replace(/border-\[\#141414\]/g, 'border-bg-border');
  content = content.replace(/border-gray-800/g, 'border-bg-border');
  content = content.replace(/border-gray-700/g, 'border-bg-border');

  // Text colors
  content = content.replace(/text-white/g, 'text-text-main');
  content = content.replace(/text-gray-300/g, 'text-text-sec');
  content = content.replace(/text-gray-400/g, 'text-text-sec');
  content = content.replace(/text-gray-500/g, 'text-text-sec');

  // Accent (Gold #d7bf7b)
  content = content.replace(/text-\[\#d7bf7b\]/g, 'text-accent');
  content = content.replace(/bg-\[\#d7bf7b\]/g, 'bg-accent');
  content = content.replace(/border-\[\#d7bf7b\]/g, 'border-accent');
  content = content.replace(/from-\[\#d7bf7b\]/g, 'from-accent');

  // Specific hardcoded opacities with gold (like bg-[#d7bf7b]/20)
  // Let's replace them with bg-accent/20
  content = content.replace(/bg-\[\#d7bf7b\]\/(10|20|30|50)/g, 'bg-accent/$1');
  content = content.replace(/border-\[\#d7bf7b\]\/(10|20|30|50)/g, 'border-accent/$1');

  // For hovering
  content = content.replace(/hover:text-white/g, 'hover:text-text-main');
  content = content.replace(/hover:text-\[\#d7bf7b\]/g, 'hover:text-accent');
  content = content.replace(/hover:bg-white/g, 'hover:bg-text-main hover:text-bg-main'); // Special case for buttons
  content = content.replace(/hover:bg-\[\#1a1a1a\]/g, 'hover:bg-bg-border');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Themed ${filePath}`);
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

walkDir('./src/app');
walkDir('./src/components');
