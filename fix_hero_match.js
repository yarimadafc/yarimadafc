const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Replace the site_images fetch for hmData
const regex = /const hmKeys.*?setHeroMatch\(hm\);\n\s+\}/s;
const replacement = `const { data: hmData } = await supabase
        .from('matches')
        .select('*')
        .eq('is_hero', true)
        .neq('status', 'finished')
        .order('match_date', { ascending: true })
        .limit(1);

      if (hmData && hmData.length > 0) {
        const m = hmData[0];
        setHeroMatch({
          home: m.home_team || 'YARIMADA',
          away: m.away_team || 'RƏQİB',
          date: m.match_date || '',
          time: m.match_time || '',
          venue: m.stadium || '',
          league: m.tournament || 'Yoldaşlıq',
          home_logo: m.home_logo || '',
          away_logo: m.away_logo || '',
          status: m.status || 'upcoming',
          live_minute: m.live_minute || '',
          added_time: m.added_time || '',
          home_score: m.home_score,
          away_score: m.away_score
        });
      }`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/app/page.tsx', content);
