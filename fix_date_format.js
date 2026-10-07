const fs = require('fs');
const glob = require('glob');

const azMonths = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

// 1. Fix src/app/page.tsx (Hero Clock)
let pageContent = fs.readFileSync('src/app/page.tsx', 'utf-8');
pageContent = pageContent.replace(
  "const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };",
  "// Custom date formatter"
);
pageContent = pageContent.replace(
  "setDate(now.toLocaleDateString('az-AZ', options));",
  "const azMonths = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];\n      setDate(`${now.getDate()} ${azMonths[now.getMonth()]} ${now.getFullYear()}`);"
);
fs.writeFileSync('src/app/page.tsx', pageContent);

// 2. Fix all toLocaleDateString('az-AZ') across the app
const files = glob.sync('src/**/*.tsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Replace generic toLocaleDateString('az-AZ') with a more robust format
  if (content.includes("toLocaleDateString('az-AZ')")) {
    content = content.replace(/new Date\(([^)]+)\)\.toLocaleDateString\('az-AZ'\)/g, 
      "(new Date($1).getDate().toString().padStart(2, '0') + '.' + (new Date($1).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date($1).getFullYear())"
    );
    changed = true;
  }

  // Replace short month in Matches/MatchesSection
  if (content.includes("toLocaleString('az-AZ', { month: 'short' })")) {
    content = content.replace(/new Date\(([^)]+)\)\.toLocaleString\('az-AZ', \{ month: 'short' \}\)/g,
      "['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'][new Date($1).getMonth()]"
    );
    changed = true;
  }

  if (changed) fs.writeFileSync(file, content);
});

