const fs = require('fs');
let file = 'src/app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/Albert_Sans/g, 'Montserrat');
content = content.replace(/Alumni_Sans/g, 'Oswald');
content = content.replace(/const albert = Albert_Sans/g, 'const albert = Montserrat');
content = content.replace(/const alumni = Alumni_Sans/g, 'const alumni = Oswald');

content = content.replace(/const albert = Montserrat\(\{\s*subsets: \['latin'\],\s*weight: \['400', '500', '600', '700', '800', '900'\],\s*variable: '--font-albert'\s*\}\);/, `const albert = Montserrat({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-albert'
});`);

content = content.replace(/const alumni = Oswald\(\{\s*subsets: \['latin'\],\s*weight: \['700', '800', '900'\],\s*variable: '--font-alumni'\s*\}\);/, `const alumni = Oswald({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-alumni'
});`);

fs.writeFileSync(file, content, 'utf8');
console.log('Fonts updated');
