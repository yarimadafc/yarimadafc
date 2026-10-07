const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  await supabase.from('site_images').insert([
    { section_key: 'hero_title_1', image_url: 'YENİ MÖVSÜM,' },
    { section_key: 'hero_title_2', image_url: 'YENİ HƏDƏFLƏR' },
    { section_key: 'hero_subtitle', image_url: 'Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!' }
  ]);
  console.log("Texts inserted");
}
run();
