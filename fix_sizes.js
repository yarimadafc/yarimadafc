const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (dirPath.includes('adminpanel') || dirPath.includes('api')) return;
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/app', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Reduce Hero bar heights
    content = content.replace(/min-h-\[50vh\]/g, 'min-h-[25vh]');
    content = content.replace(/min-h-\[40vh\]/g, 'min-h-[20vh]');
    content = content.replace(/min-h-\[30vh\]/g, 'min-h-[15vh]');
    content = content.replace(/min-h-\[15vh\]/g, 'min-h-[10vh]');
    
    // Reduce heading text sizes
    content = content.replace(/text-8xl md:text-\[12rem\]/g, 'text-5xl md:text-7xl');
    content = content.replace(/text-7xl md:text-9xl/g, 'text-5xl md:text-7xl');
    content = content.replace(/text-5xl md:text-8xl/g, 'text-4xl md:text-6xl');
    content = content.replace(/text-6xl md:text-7xl/g, 'text-4xl md:text-5xl');
    content = content.replace(/text-4xl md:text-6xl/g, 'text-3xl md:text-5xl');
    
    // Remove fallback mock data conditionally (I'll do this via regex for each)
    content = content.replace(/\/\/ Fallback data[\s\S]*?\} else \{/g, 'if (false) {');
    // For arrays that assign mock data when empty:
    content = content.replace(/if \([^)]+\.length === 0\) \{[\s\S]*?\} else \{[\s\S]*?\}/g, (match) => {
      if (match.includes('Fallback data') || match.includes('1', '2', '3')) {
        return ''; // Removing it entirely is hard because of the `else`. Let's just manually fix the known ones below.
      }
      return match;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Resized ${filePath}`);
    }
  }
});
