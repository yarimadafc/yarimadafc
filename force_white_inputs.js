const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Inject text-white if not present
      content = content.replace(/(<input[^>]*className="[^"]*)(")/g, (match, p1, p2) => {
        if (!p1.includes('text-white') && !p1.includes('text-gray-') && !p1.includes('text-accent') && !p1.includes('hidden')) {
          return p1 + ' text-white' + p2;
        }
        return match;
      });
      
      content = content.replace(/(<textarea[^>]*className="[^"]*)(")/g, (match, p1, p2) => {
        if (!p1.includes('text-white') && !p1.includes('text-gray-') && !p1.includes('text-accent')) {
          return p1 + ' text-white' + p2;
        }
        return match;
      });

      content = content.replace(/(<select[^>]*className="[^"]*)(")/g, (match, p1, p2) => {
        if (!p1.includes('text-white') && !p1.includes('text-gray-') && !p1.includes('text-accent')) {
          return p1 + ' text-white' + p2;
        }
        return match;
      });
      
      // Also make sure text-black doesn't exist
      content = content.replace(/text-black/g, 'text-white');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('src/app/admin');
