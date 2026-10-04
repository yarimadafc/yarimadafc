const fs = require('fs');
let file = 'src/app/[locale]/elaqe/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Kristal fallback
content = content.replace(/\{contact\?\.address \|\| 'Kristal Abşeron 1 Xırdalan şəhəri'\}/, '{contact?.address}');

// 2. Add Telegram and TikTok icons
const ytString = `<a href={contact?.youtube || '#'} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--ks-kinpaku)] hover:text-[#0a1628] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>`;

const tgIcon = `
                {contact?.telegram && <a href={contact.telegram} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--ks-kinpaku)] hover:text-[#0a1628] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.304-.346-.108l-6.4 4.024-2.76-.86c-.6-.185-.61-.6.125-.89l10.736-4.136c.498-.195.938.118.775.82z"/></svg></a>}
`;
const ttIcon = `
                {contact?.tiktok && <a href={contact.tiktok} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--ks-kinpaku)] hover:text-[#0a1628] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.014 3.91-.004.154.02.273.04.385.054a5.2 5.2 0 00-1.306 3.197c.01 1.05.31 2.083.84 2.964a5.2 5.2 0 003.11 2.217v3.52c-.41-.01-.82-.04-1.22-.09-1.21-.14-2.37-.58-3.41-1.28a6.38 6.38 0 01-2.18-2.61v7.65c-.01 1.99-.86 3.91-2.34 5.26a7.25 7.25 0 01-5.11 2.05c-2.4-.04-4.66-1.16-6.15-3.05a7.35 7.35 0 01-1.47-5.06c.21-2.2 1.32-4.22 3.06-5.59a7.33 7.33 0 015.01-1.68v3.63a3.54 3.54 0 00-2.37 1.08c-1.12 1.1-1.52 2.76-1.02 4.25.32.96 1.02 1.76 1.95 2.15a3.61 3.61 0 004.15-.81c.88-.86 1.33-2.09 1.25-3.32V.02h3.91z"/></svg></a>}
`;

if (!content.includes('contact?.tiktok')) {
  content = content.replace(ytString, ytString + tgIcon + ttIcon);
}

// Ensure the map shows exactly a generic marker if "Xırdalan şəhəri" is requested. 
// Or I can keep the existing one because it points to "Kristal Abseron 1", wait, the user asked to remove the TEXT but they said "Əlaqədə Konumda atdığım yerin işarəsi görünsün"
// If they meant the existing map link is fine, I will keep it. 
// Actually, let's leave the iframe alone unless I have a new link. 

fs.writeFileSync(file, content, 'utf8');
