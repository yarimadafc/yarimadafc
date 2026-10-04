const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Extract the marquee block
const start = code.indexOf('\n      {/* MARQUEE SPONSORLAR');
const end = code.indexOf('</section>', start) + '</section>'.length;
if (start === -1) { console.error('Marquee not found'); process.exit(1); }

const marqueeBlock = code.slice(start, end);

// Remove it from current position
code = code.slice(0, start) + code.slice(end);

// Insert before the Media section
const mediaMarker = '{/* MEDİA: VİDEO';
const insertAt = code.indexOf(mediaMarker);
if (insertAt === -1) { console.error('Media section not found'); process.exit(1); }

code = code.slice(0, insertAt) + marqueeBlock + '\n\n      ' + code.slice(insertAt);

fs.writeFileSync('src/app/page.tsx', code);
console.log('Done! Marquee moved between news and media.');
