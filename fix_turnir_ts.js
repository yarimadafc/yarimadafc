const fs = require('fs');
let file = 'src/app/[locale]/turnir-cedveli/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement was:
// content = content.replace(/export default async function TurnirCedveli\(\{ searchParams \}: \{ searchParams: \{ tournament_id\?: string \} \}\) \{/, "export default async function TurnirCedveli({ searchParams }: { searchParams: Promise<{ tournament_id?: string }> }) {\n  const resolvedParams = await searchParams;\n  const t = await getTranslations();");
// But maybe the original signature was different?
// Let's just forcefully inject t and resolvedParams
content = content.replace(/export default async function TurnirCedveli[^{]*\{/, `export default async function TurnirCedveli({ searchParams }: { searchParams: Promise<{ tournament_id?: string }> }) {\n  const resolvedParams = await searchParams;\n  const t = await getTranslations();`);

fs.writeFileSync(file, content, 'utf8');
