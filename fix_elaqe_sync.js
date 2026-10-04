const fs = require('fs');
let file = 'src/app/elaqe/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import FadeIn from '@\/components\/FadeIn';/, `import FadeIn from '@/components/FadeIn';\nimport { supabase } from '@/lib/supabase';`);

content = content.replace(/export default function ContactPage\(\) \{/, `export default async function ContactPage() {\n  const { data: contact } = await supabase.from('site_settings').select('*').single();`);

content = content.replace(/\+994 55 447 74 67/, `{contact?.phone || '+994 55 447 74 67'}`);
content = content.replace(/info@yarmadafc\.com/, `{contact?.email || 'info@yarmadafc.com'}`);
content = content.replace(/Kristal Abşeron 1 Xırdalan şəhəri Meydança <br\/> \(Həmçinin: Masazır, Hökməli, Mehdiabad, Məmmədli\)/, `{contact?.address || 'Kristal Abşeron 1 Xırdalan şəhəri'}`);

fs.writeFileSync(file, content, 'utf8');
