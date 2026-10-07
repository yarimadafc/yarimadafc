const fs = require('fs');
let content = fs.readFileSync('src/app/teams/[id]/page.tsx', 'utf-8');

content = content.replace(
  "export default function TeamDetailPage() {",
  `import { useState, useEffect } from 'react';\nimport { supabase } from '@/lib/supabase';\n\nexport default function TeamDetailPage() {`
);

content = content.replace(
  /const id = params\.id as string;\n\s*const teamName = id \? id\.toUpperCase\(\) : 'U-12';\n\n\s*const players = \[\n\s*\{ id: 1[\s\S]*?\];/,
  `const id = params.id as string;
  const [team, setTeam] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      const { data: teamData } = await supabase.from('teams').select('*, coaches(name)').eq('id', id).single();
      if (teamData) setTeam(teamData);

      const { data: playersData } = await supabase.from('players').select('*').eq('team_id', id).order('jersey_number', { ascending: true });
      if (playersData) setPlayers(playersData);
      
      setLoading(false);
    }
    loadTeam();
  }, [id]);

  if (loading) return <div className="pt-32 min-h-screen bg-[#0a1423] pb-20 flex justify-center"><div className="text-[#d7bf7b] font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div></div>;
  if (!team) return <div className="pt-32 min-h-screen bg-[#0a1423] pb-20 flex justify-center"><div className="text-red-400 font-bold tracking-widest uppercase">Komanda tapılmadı</div></div>;
  `
);

content = content.replace(
  /\{teamName\} Komandası/,
  `{team.name}`
);

content = content.replace(
  /AFFA Premyer Liqa/,
  `{team.league || 'Gənclər Liqası'}`
);

content = content.replace(
  /<div className="text-white text-sm md:text-base font-bold">Elnur Cəlilov<\/div>/,
  `<div className="text-white text-sm md:text-base font-bold">{team.coaches && team.coaches.length > 0 ? team.coaches[0].name : 'Təyin edilməyib'}</div>`
);

content = content.replace(
  /<div className="text-white text-sm md:text-base font-bold">22<\/div>/,
  `<div className="text-white text-sm md:text-base font-bold">{players.length}</div>`
);

content = content.replace(
  /<span className="text-\[#d7bf7b\] font-black text-xs md:text-sm">\{player.number\}<\/span>/,
  `<span className="text-[#d7bf7b] font-black text-xs md:text-sm">{player.jersey_number || '-'}</span>`
);

content = content.replace(
  /<div className="absolute inset-0 flex items-center justify-center bg-\[#0d1a2d\]">\s*<svg.*?<\/svg>\s*<\/div>/,
  `{player.image_url ? (
                     <img src={player.image_url} alt={player.name} className="absolute inset-0 w-full h-full object-cover" />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center bg-[#0d1a2d]">
                       <svg className="w-16 h-16 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                     </div>
                   )}`
);

fs.writeFileSync('src/app/teams/[id]/page.tsx', content);
