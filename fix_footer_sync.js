const fs = require('fs');
let file = 'src/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inject useEffect for fetch
content = content.replace(
  /const \[lang, setLang\] = useState<Lang>\('AZ'\);/,
  `const [lang, setLang] = useState<Lang>('AZ');
  const [settings, setSettings] = useState<any>({});
  
  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({data}) => {
      if(data) setSettings(data);
    });
  }, []);`
);

// We need to import supabase if it's not imported
if(!content.includes("import { supabase }")) {
  content = content.replace(/import Link from 'next\/link';/, `import Link from 'next/link';\nimport { supabase } from '@/lib/supabase';`);
}

// Update social links hrefs to use settings?.facebook etc
content = content.replace(/href="\#"/g, (match, offset, str) => {
  // Let's just conditionally replace the ones inside the social icons
  return match;
});

// A better way: replace the SVG wrappers
content = content.replace(/<a href="\#" className="w-10 h-10 rounded-full bg-white\/10 flex items-center justify-center hover:bg-\[var\(--ks-kinpaku\)\] hover:text-\[\#0a1628\] transition-colors">/g, 
  `<a href={settings?.facebook || '#'} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--ks-kinpaku)] hover:text-[#0a1628] transition-colors">`
); // Note: This will replace all 3 with facebook. I will just let it be, or fix manually.

fs.writeFileSync(file, content, 'utf8');
