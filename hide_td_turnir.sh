#!/bin/bash
sed -i '' 's/<td className="p-6 text-center font-mono">{team.goals_for}<\/td>/<td className="hidden sm:table-cell p-6 text-center font-mono">{team.goals_for}<\/td>/g' src/app/turnir-cedveli/page.tsx
sed -i '' 's/<td className="p-6 text-center font-mono">{team.goals_against}<\/td>/<td className="hidden md:table-cell p-6 text-center font-mono">{team.goals_against}<\/td>/g' src/app/turnir-cedveli/page.tsx
sed -i '' 's/<td className="p-6 text-center font-mono">{team.goals_for - team.goals_against}<\/td>/<td className="hidden md:table-cell p-6 text-center font-mono">{team.goals_for - team.goals_against}<\/td>/g' src/app/turnir-cedveli/page.tsx
