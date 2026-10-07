const fs = require('fs');
let content = fs.readFileSync('src/app/coaches/[id]/page.tsx', 'utf-8');

// Change select query
content = content.replace(
  "select('*, teams(name)')",
  "select('*, teams(id, name)')"
);

// Fallback link if teams.id is somehow missing but team_id exists on coach
content = content.replace(
  /href=\{`\/teams\/\$\{coach\.teams\.id\}`\}/,
  "href={`/teams/${coach.team_id || coach.teams.id}`}"
);

fs.writeFileSync('src/app/coaches/[id]/page.tsx', content);
