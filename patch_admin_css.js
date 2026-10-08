const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf8');

if (!css.includes('admin-input-fix')) {
  css += `\n
/* admin-input-fix */
input, textarea, select {
  color: inherit;
}
input::placeholder, textarea::placeholder {
  color: #9ca3af; /* gray-400 */
}
`;
  fs.writeFileSync('src/app/globals.css', css, 'utf8');
}
