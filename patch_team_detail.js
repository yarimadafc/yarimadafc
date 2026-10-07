const fs = require('fs');
let content = fs.readFileSync('src/app/teams/[id]/page.tsx', 'utf8');

// Fix spacing between Komanda Heyəti and Sezon
content = content.replace(
  '<div className="flex items-center justify-between mb-10 border-b border-bg-border pb-4 text-center flex justify-center">',
  '<div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-10 border-b border-bg-border pb-4 text-center">'
);

// Add Link to player page
content = content.replace(
  '<div className="bg-bg-sec border border-bg-border rounded-2xl overflow-hidden hover:border-accent/50 transition-colors group cursor-pointer relative shadow-lg">',
  '<Link href={`/players/${player.id}`} className="block h-full">\n<div className="bg-bg-sec border border-bg-border rounded-2xl overflow-hidden hover:border-accent/50 transition-colors group cursor-pointer relative shadow-lg h-full">'
);
content = content.replace(
  '</div>\n            </motion.div>',
  '</div>\n</Link>\n            </motion.div>'
);

fs.writeFileSync('src/app/teams/[id]/page.tsx', content, 'utf8');
