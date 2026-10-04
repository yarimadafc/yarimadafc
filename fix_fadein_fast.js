const fs = require('fs');
let file = 'src/components/FadeIn.tsx';
let content = fs.readFileSync(file, 'utf8');

// Speed up and optimize performance
content = content.replace(/filter: 'blur\(10px\)'/g, '');
content = content.replace(/filter: 'blur\(0px\)'/g, '');
content = content.replace(/duration: 1\.1/g, 'duration: 0.5');
content = content.replace(/y: 30/g, 'y: 20');

fs.writeFileSync(file, content, 'utf8');
