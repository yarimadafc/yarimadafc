const fs = require('fs');
let file = 'src/app/elaqe/page.tsx';
let content = fs.readFileSync(file, 'utf8');

let count = 0;
content = content.replace(/<a href="\#"/g, (match) => {
  count++;
  if (count === 1) return `<a href={contact?.facebook || '#'}`;
  if (count === 2) return `<a href={contact?.instagram || '#'}`;
  if (count === 3) return `<a href={contact?.youtube || '#'}`;
  return match;
});

fs.writeFileSync(file, content, 'utf8');
