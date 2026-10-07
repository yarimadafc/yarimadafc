const fs = require('fs');
let content = fs.readFileSync('src/app/teams/[id]/page.tsx', 'utf-8');

// Load extra details
content = content.replace(
  "const [team, setTeam] = useState<any>(null);",
  "const [team, setTeam] = useState<any>(null);\n  const [teamPos, setTeamPos] = useState('');\n  const [teamImg, setTeamImg] = useState('');\n  const [teamDesc, setTeamDesc] = useState('');"
);

content = content.replace(
  "setLoading(false);",
  `const keys = [\`team_\${id}_pos\`, \`team_\${id}_desc\`, \`team_\${id}_img\`];
      const { data: imgData } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
      if (imgData) {
        imgData.forEach(item => {
          if (item.section_key.endsWith('_pos')) setTeamPos(item.image_url);
          if (item.section_key.endsWith('_desc')) setTeamDesc(item.image_url);
          if (item.section_key.endsWith('_img')) setTeamImg(item.image_url);
        });
      }
      setLoading(false);`
);

// Apply extra details to UI
content = content.replace(
  /<div className="absolute inset-0 bg-\[url\('\/placeholder-hero\.jpg'\)\] bg-cover bg-center opacity-10 blur-sm"><\/div>/,
  `{teamImg ? (
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: \`url(\${teamImg})\` }}></div>
        ) : (
          <div className="absolute inset-0 bg-[url('/placeholder-hero.jpg')] bg-cover bg-center opacity-10 blur-sm"></div>
        )}`
);

content = content.replace(
  /<div className="text-\[#d7bf7b\] text-sm md:text-base font-black">3-cü yer<\/div>/,
  `<div className="text-[#d7bf7b] text-sm md:text-base font-black">{teamPos || 'Məlumat Yoxdur'}</div>`
);

// Add description
content = content.replace(
  /{team\.name}<\/h1>/,
  `{team.name}</h1>
          {teamDesc && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-gray-300 max-w-2xl text-center text-sm md:text-base mb-4 bg-[#0a1423]/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
              {teamDesc}
            </motion.p>
          )}`
);

fs.writeFileSync('src/app/teams/[id]/page.tsx', content);
