const fs = require('fs');
let content = fs.readFileSync('src/components/home/Achievements.tsx', 'utf8');

// Replace <Link href="..."> with <div className="...">
content = content.replace(/<Link href=\{\`\/achievements\/\$\{item\.id\}\`\} key=\{item\.id\}/g, '<div key={item.id}');
content = content.replace(/<\/Link>/g, '</div>');

// Remove import Link if it's unused, though it might be used elsewhere, but simple text replacement is enough for the component
fs.writeFileSync('src/components/home/Achievements.tsx', content, 'utf8');
