const fs = require('fs');
let content = fs.readFileSync('src/app/teams/page.tsx', 'utf-8');

content = content.replace("export default function TeamsPage() {", "import { useState, useEffect } from 'react';\nimport { supabase } from '@/lib/supabase';\n\nexport default function TeamsPage() {");

content = content.replace(
  /const teams = \[\s*\{ id: 'u-12'.*?\];/s,
  `const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    async function loadTeams() {
      const { data } = await supabase.from('teams').select('*, coaches(name), players(count)').order('created_at', { ascending: false });
      if (data) setTeams(data);
    }
    loadTeams();
  }, []);`
);

content = content.replace(
  /<span className="text-white text-sm font-medium">\{team.league\}<\/span>/,
  `<span className="text-white text-sm font-medium">{team.league || 'Gənclər Liqası'}</span>`
);

content = content.replace(
  /<span className="text-white text-sm font-medium">\{team.coach\}<\/span>/,
  `<span className="text-white text-sm font-medium">{team.coaches && team.coaches.length > 0 ? team.coaches[0].name : 'Təyin edilməyib'}</span>`
);

content = content.replace(
  /<span className="text-\[#d7bf7b\] text-lg font-black">\{team.playersCount\}<\/span>/,
  `<span className="text-[#d7bf7b] text-lg font-black">{team.players ? team.players[0]?.count : 0}</span>`
);

fs.writeFileSync('src/app/teams/page.tsx', content);
