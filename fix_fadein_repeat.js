const fs = require('fs');
let file = 'src/components/FadeIn.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/viewport=\{\{ once: true, margin: "-50px" \}\}/, "viewport={{ once: false, margin: '-50px 0px -50px 0px', amount: 0.15 }}");
content = content.replace(/duration: 0\.9/, 'duration: 1.1');

fs.writeFileSync(file, content, 'utf8');
