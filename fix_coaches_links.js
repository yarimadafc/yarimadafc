const fs = require('fs');
let content = fs.readFileSync('src/app/coaches/page.tsx', 'utf-8');

if (!content.includes("import Link from 'next/link';")) {
  content = content.replace(
    "import { supabase } from '@/lib/supabase';",
    "import { supabase } from '@/lib/supabase';\nimport Link from 'next/link';"
  );
}

// Wrap card in Link
content = content.replace(
  /<div className="w-full h-72 bg-\[#0d1a2d\] relative overflow-hidden">/,
  `<Link href={\`/coaches/\${coach.id}\`} className="block w-full h-72 bg-[#0d1a2d] relative overflow-hidden group-hover:opacity-90 transition-opacity">`
);

content = content.replace(
  /\{coach.image_url \? \([\s\S]*?\)\s*:\s*\([\s\S]*?\)\s*\}/,
  `$&</Link>`
);

// Allow clicking the name too
content = content.replace(
  /<h3 className="text-xl font-black text-white uppercase tracking-widest mb-1">\{coach.name\}<\/h3>/,
  `<Link href={\`/coaches/\${coach.id}\`} className="hover:text-[#d7bf7b] transition-colors"><h3 className="text-xl font-black text-white uppercase tracking-widest mb-1">{coach.name}</h3></Link>`
);

fs.writeFileSync('src/app/coaches/page.tsx', content);
