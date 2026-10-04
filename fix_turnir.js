const fs = require('fs');
let file = 'src/app/[locale]/turnir-cedveli/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('getTranslations')) {
  content = content.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\nimport { getTranslations } from 'next-intl/server';");
  
  content = content.replace(/export default async function TurnirCedveli\(\{ searchParams \}: \{ searchParams: \{ tournament_id\?: string \} \}\) \{/, "export default async function TurnirCedveli({ searchParams }: { searchParams: Promise<{ tournament_id?: string }> }) {\n  const resolvedParams = await searchParams;\n  const t = await getTranslations();");
  
  // replace searchParams with resolvedParams
  content = content.replace(/searchParams\.tournament_id/g, 'resolvedParams.tournament_id');

  content = content.replace(/>STATİSTİKA</, '>{t("standings_label")}<');
  content = content.replace(/>TURNİR CƏDVƏLİ</, '>{t("standings_title")}<');
  content = content.replace(/>Komanda</, '>{t("standings_club")}<');

  // Table headers
  content = content.replace(/title="Oyunlar">O</, 'title="Oyunlar">{t("standings_pld")}<');
  content = content.replace(/title="Qələbə">Q</, 'title="Qələbə">{t("standings_won")}<');
  content = content.replace(/title="Heç-heçə">H</, 'title="Heç-heçə">{t("standings_drw")}<');
  content = content.replace(/title="Məğlubiyyət">M</, 'title="Məğlubiyyət">{t("standings_lst")}<');
  content = content.replace(/title="Xal">X</, 'title="Xal">{t("standings_pts")}<');
  
  // Legend
  const oldLegend = `{[['O','Oyunlar'],['Q','Qələbə'],['H','Heç-heçə'],['M','Məğlubiyyət'],['VQ','Vurulan Qol'],['BQ','Buraxılan Qol'],['+/-','Qol Fərqi'],['X','Xal']].map(([k,v])=>(`;
  const newLegend = `{t('standings_legend').split(' · ').map(item => item.split('=')).map(([k, v]) => (`;
  content = content.replace(oldLegend, newLegend);
}

fs.writeFileSync(file, content, 'utf8');
