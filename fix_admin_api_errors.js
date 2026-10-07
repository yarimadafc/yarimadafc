const fs = require('fs');
const glob = require('glob');

// Use glob to find all Admin components
const files = glob.sync('src/app/admin/components/*.tsx');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;

    // Fix .single() -> .maybeSingle() to prevent 406 Not Acceptable
    if (content.includes('.single()')) {
        content = content.replace(/\.single\(\)/g, '.maybeSingle()');
        changed = true;
    }

    // Fix MatchesAdmin specifically
    if (file.includes('MatchesAdmin.tsx')) {
        // Change payload 'venue' to 'stadium' and handle empty match_date
        content = content.replace(
            /const payload = \{[\s\S]*?venue,[\s\S]*?tournament[\s\S]*?\};/m,
            `const payload = {
      home_team: homeTeam,
      away_team: awayTeam,
      match_date: matchDate || null,
      match_time: matchTime || null,
      stadium: venue,
      tournament
    };`
        );
        // Replace m.venue with m.stadium when reading
        content = content.replace(/setVenue\(m\.venue \|\| ''\);/g, "setVenue(m.stadium || '');");
        content = content.replace(/\{m\.venue\}/g, "{m.stadium}");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
    }
});

