const fs = require('fs');
let file = 'src/app/[locale]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Helper to get from home_texts
const helper = `
  const getDynamicText = (key) => {
    const texts = siteSettings?.home_texts || {};
    const langKey = \`\${key}_\${lang.toLowerCase()}\`;
    return texts[langKey] || t(key);
  };
`;
if (!content.includes('getDynamicText')) {
  content = content.replace(/const t = await getTranslations\(\);/, 'const t = await getTranslations();\n' + helper);
}

// Replace hardcoded usages
content = content.replace(/\{t\("hero_title"\)\}/g, '{getDynamicText("hero_title")}');
content = content.replace(/\{t\("hero_subtitle"\)\}/g, '{getDynamicText("hero_subtitle")}');
content = content.replace(/\{t\("about_title"\)\}/g, '{getDynamicText("about_title")}');
content = content.replace(/\{t\("about_text"\)\}/g, '{getDynamicText("about_text")}');
// Note: Single quote or double quote difference might matter
content = content.replace(/\{t\('hero_title'\)\}/g, '{getDynamicText("hero_title")}');
content = content.replace(/\{t\('hero_subtitle'\)\}/g, '{getDynamicText("hero_subtitle")}');
content = content.replace(/\{t\('about_title'\)\}/g, '{getDynamicText("about_title")}');
content = content.replace(/\{t\('about_text'\)\}/g, '{getDynamicText("about_text")}');

fs.writeFileSync(file, content, 'utf8');
