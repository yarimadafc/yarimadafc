const fs = require('fs');
let content = fs.readFileSync('src/app/coaches/page.tsx', 'utf-8');

content = content.replace("export default function CoachesPage() {", "import { useState, useEffect } from 'react';\nimport { supabase } from '@/lib/supabase';\n\nexport default function CoachesPage() {");

content = content.replace(
  /const coaches = \[\s*\{ id: 1, name: 'Elnur Cəlilov'.*?\];/s,
  `const [coaches, setCoaches] = useState<any[]>([]);

  useEffect(() => {
    async function loadCoaches() {
      const { data } = await supabase.from('coaches').select('*, teams(name)').order('created_at', { ascending: false });
      if (data) setCoaches(data);
    }
    loadCoaches();
  }, []);`
);

content = content.replace(
  /<p className="text-gray-400 text-sm leading-relaxed mb-6 h-16 line-clamp-3">\s*\{coach.bio\}\s*<\/p>/s,
  `<p className="text-gray-400 text-sm leading-relaxed mb-6 h-16 line-clamp-3">
                  {coach.teams ? \`Aid olduğu komanda: \${coach.teams.name}\` : 'Akademiya və Ümumi Məşqçi'}
                </p>`
);

content = content.replace(
  /<div className="w-\[1px\] h-8 bg-gray-800"><\/div>\s*<div className="flex flex-col text-right">\s*<span className="text-gray-500 text-\[10px\] font-bold uppercase tracking-widest mb-1">Təcrübə<\/span>\s*<span className="text-white text-sm font-bold">\{coach.experience\}<\/span>\s*<\/div>/,
  ""
);

content = content.replace(
  /<svg className="w-20 h-20 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" \/><\/svg>/,
  `{coach.image_url ? (
                    <img src={coach.image_url} alt={coach.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <svg className="w-20 h-20 text-gray-700 relative z-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  )}`
);

fs.writeFileSync('src/app/coaches/page.tsx', content);
