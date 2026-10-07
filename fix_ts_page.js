const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');
content = content.replace(
  /\{heroMatch\.yarimada_lineup\.map\(\(p, idx\) => \(/,
  `{heroMatch.yarimada_lineup.map((p: any, idx: number) => (`
);
fs.writeFileSync('src/app/page.tsx', content);
