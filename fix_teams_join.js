const fs = require('fs');
let content = fs.readFileSync('src/app/teams/page.tsx', 'utf-8');

content = content.replace("players(count)", "players(id)");
content = content.replace("{team.players ? team.players[0]?.count : 0}", "{team.players ? team.players.length : 0}");

fs.writeFileSync('src/app/teams/page.tsx', content);
