const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/MatchesAdmin.tsx', 'utf-8');

// I will add an effect that watches `tournament` and if `yarimadaLineup` is empty, auto-fetches.
const autoSyncEffect = `
  useEffect(() => {
    if (isAdding && tournament && yarimadaLineup.length === 0) {
      const matchedTeam = teams.find(t => t.name.toLowerCase() === tournament.toLowerCase());
      if (matchedTeam) {
        setSelectedTeamIdForLineup(matchedTeam.id);
        // Auto fetch players
        supabase.from('players').select('*').eq('team_id', matchedTeam.id).then(({ data }) => {
          if (data && yarimadaLineup.length === 0) {
            setYarimadaLineup(data.map(p => ({
              id: p.id,
              name: p.name,
              number: p.number,
              position: p.position,
              is_starting: true, // Defaulting to starting
              events: []
            })));
          }
        });
      }
    }
  }, [tournament, isAdding, teams]);
`;

content = content.replace(
  "useEffect(() => {",
  autoSyncEffect + "\n  useEffect(() => {"
);

fs.writeFileSync('src/app/admin/components/MatchesAdmin.tsx', content);
