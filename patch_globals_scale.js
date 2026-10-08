const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Inject html font-size scaling
const htmlRule = `html {
  scroll-behavior: smooth;
  font-size: 14px; /* Default desktop scaling */
}

@media (max-width: 768px) {
  html {
    font-size: 13px; /* Mobile scaling */
  }
}`;

css = css.replace(/html\s*\{\s*scroll-behavior:\s*smooth;\s*\}/, htmlRule);

fs.writeFileSync('src/app/globals.css', css, 'utf8');
