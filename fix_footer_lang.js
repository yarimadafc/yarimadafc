const fs = require('fs');
const file = 'src/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

// I will just read it first to see what to replace
console.log(content.substring(0, 500));
