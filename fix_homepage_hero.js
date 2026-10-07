const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Add state for hero texts and next match
content = content.replace(
  "export default function Home() {",
  `export default function Home() {
  const [heroTexts, setHeroTexts] = useState<Record<string, string>>({
    hero_title_1: 'YENİ MÖVSÜM,',
    hero_title_2: 'YENİ HƏDƏFLƏR',
    hero_subtitle: 'Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!'
  });
  const [nextMatch, setNextMatch] = useState<any>(null);`
);

// Add fetch logic in useEffect
content = content.replace(
  /useEffect\(\(\) => \{\n\s*const timer = setInterval\(\(\) => \{\n\s*const now = new Date\(\);/,
  `useEffect(() => {
    async function loadData() {
      const { data: texts } = await supabase.from('site_images').select('section_key, image_url').in('section_key', ['hero_title_1', 'hero_title_2', 'hero_subtitle']);
      if (texts) {
        const map: Record<string, string> = { ...heroTexts };
        texts.forEach(t => { map[t.section_key] = t.image_url; });
        setHeroTexts(map);
      }
      const { data: match } = await supabase.from('matches').select('*').order('match_date', { ascending: true }).limit(1).single();
      if (match) setNextMatch(match);
    }
    loadData();

    const timer = setInterval(() => {
      const now = new Date();`
);

// Add missing dependencies if any
if (!content.includes("import { supabase }")) {
  content = content.replace("import { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';\nimport { supabase } from '@/lib/supabase';");
}

// Replace static texts
content = content.replace(
  /YENİ MÖVSÜM, <br \/>\n\s*<span className="text-\[#d7bf7b\]">YENİ HƏDƏFLƏR<\/span>/,
  `{heroTexts.hero_title_1} <br />
                    <span className="text-[#d7bf7b]">{heroTexts.hero_title_2}</span>`
);
content = content.replace(
  /Gələcəyin çempionları burada yetişir\. Böyük hədəflərə doğru birlikdə addımlayırıq!/,
  `{heroTexts.hero_subtitle}`
);

// Replace Next Match hardcoded widget
content = content.replace(
  /<span className="text-gray-400 text-\[11px\] font-medium tracking-wide">U-12 Premyer Liqa<\/span>[\s\S]*?<Link href="\/matches" className="text-\[#d7bf7b\] text-\[10px\] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center group-hover:underline underline-offset-4">\n\s*Ətraflı &rarr;\n\s*<\/Link>\n\s*<\/div>/,
  `<span className="text-gray-400 text-[11px] font-medium tracking-wide">{nextMatch?.tournament || 'Gənclər Liqası'}</span>
                     </div>

                     <div className="flex items-center justify-between mb-8 relative">
                       {/* Team 1 */}
                       <div className="flex flex-col items-center space-y-3 w-[40%]">
                         <div className="w-12 h-12 rounded-full border border-gray-700 bg-[#0d1a2d] flex items-center justify-center p-2 shadow-inner">
                           <div className="w-full h-full relative">
                             <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                           </div>
                         </div>
                         <span className="font-black text-white tracking-widest text-xs uppercase text-center">{nextMatch?.home_team || 'YARIMADA'}</span>
                       </div>
                       
                       {/* VS */}
                       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-10px]">
                         <div className="w-8 h-8 rounded-full bg-[#0a1423] border border-gray-700 flex items-center justify-center shadow-lg">
                           <span className="text-[#d7bf7b] text-[10px] font-black italic">VS</span>
                         </div>
                       </div>

                       {/* Team 2 */}
                       <div className="flex flex-col items-center space-y-3 w-[40%]">
                         <div className="w-12 h-12 rounded-full border border-gray-700 bg-[#0d1a2d] flex items-center justify-center p-2 shadow-inner">
                           {/* Placeholder logo for opponent */}
                           <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                         </div>
                         <span className="font-black text-white tracking-widest text-xs uppercase text-center">{nextMatch?.away_team || 'RƏQİB'}</span>
                       </div>
                     </div>

                     <div className="w-full bg-[#0a1423] rounded-lg p-3 flex justify-between items-center border border-gray-800">
                       <div className="flex flex-col">
                         <span className="text-gray-500 text-[10px] uppercase tracking-widest mb-0.5">Tarix / Saat</span>
                         <span className="text-white text-xs font-bold">{nextMatch ? \`\${nextMatch.match_date} • \${nextMatch.match_time}\` : 'Məlumat Yoxdur'}</span>
                       </div>
                       <Link href="/matches" className="text-[#d7bf7b] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center group-hover:underline underline-offset-4">
                         Ətraflı &rarr;
                       </Link>
                     </div>`
);

fs.writeFileSync('src/app/page.tsx', content);
