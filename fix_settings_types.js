const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/settings\?/g, 'settings?.');
  fs.writeFileSync(file, content, 'utf8');
}
fix('src/components/Footer.tsx');
fix('src/components/Navbar.tsx');
