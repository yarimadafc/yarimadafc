const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (dirPath.includes('adminpanel') || dirPath.includes('api')) return; // Skip admin panel and api
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replaceRules = [
  { match: /bg-\[var\(--ks-paper\)\] text-\[var\(--ks-ink\)\]/g, replace: 'bg-[var(--bg)] text-[var(--text)]' },
  { match: /var\(--ks-kinpaku-rich\)/g, replace: 'var(--accent)' },
  { match: /var\(--ks-kinpaku-vivid\)/g, replace: 'var(--accent-2)' },
  { match: /var\(--ks-kinpaku-deep\)/g, replace: 'var(--accent-deep)' },
  { match: /var\(--ks-kinpaku\)/g, replace: 'var(--accent)' },
  { match: /var\(--ks-ink\)/g, replace: 'var(--text)' },
  { match: /\#0a1628/g, replace: 'var(--surface-2)' }, // Often used for dark backgrounds
  { match: /text-gray-800|text-gray-900|text-gray-700/g, replace: 'text-[var(--text)]' },
  { match: /text-gray-500|text-gray-400|text-gray-600/g, replace: 'text-[var(--text-muted)]' },
  { match: /bg-white/g, replace: 'bg-[var(--surface)]' },
  { match: /bg-gray-50/g, replace: 'bg-[var(--surface-2)]' },
  { match: /bg-gray-100/g, replace: 'bg-[var(--surface-2)]' },
  { match: /bg-gray-200/g, replace: 'bg-[var(--border)]' },
  { match: /border-gray-100|border-gray-200/g, replace: 'border-[var(--border)]' },
  { match: /font-condensed/g, replace: 'font-display' },
  { match: /bg-\[var\(--surface-2\)\]\/5/g, replace: 'bg-[var(--surface-2)]' }
];

walkDir('./src/app', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replaceRules.forEach(rule => {
      content = content.replace(rule.match, rule.replace);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
