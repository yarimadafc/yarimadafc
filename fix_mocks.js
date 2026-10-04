const fs = require('fs');

const filesToClean = [
  'src/app/mesqciler/page.tsx',
  'src/app/komandalar/page.tsx',
  'src/app/oyunlar/page.tsx',
  'src/app/turnir-cedveli/page.tsx',
  'src/app/teqvim/page.tsx',
  'src/app/xeberler/page.tsx',
  'src/app/media/page.tsx'
];

filesToClean.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Pattern to catch the specific fallback data block usually written as:
    // // Fallback data
    // if (array.length === 0) { ... } else { ... }
    
    content = content.replace(/\/\/ Fallback data[\s\S]*?\} else \{/g, '');
    // Need to remove the closing bracket of the else
    // But since it's hard to match reliably with regex without an AST parser,
    // I will write custom replacements for the known arrays.
  }
});
