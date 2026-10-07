const fs = require('fs');
const path = require('path');

const filePatterns = ['.tsx', '.css'];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Generic hex replacements (no utility prefix constraint)
  content = content.replace(/#0d1a2d/g, '#0a0a0a');
  content = content.replace(/#152741/g, '#141414');
  content = content.replace(/#1c2d47/g, '#1f1f1f');
  content = content.replace(/#0a1423/g, '#000000');
  content = content.replace(/#0B1221/g, '#000000');
  content = content.replace(/#112240/g, '#111111');
  content = content.replace(/#1a2e4c/g, '#1a1a1a');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed gradients/colors in ${filePath}`);
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
