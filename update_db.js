const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error } = await supabase.rpc('exec_sql', {
    query: `
      ALTER TABLE coach_courses ADD COLUMN IF NOT EXISTS video_url TEXT;
    `
  });
  console.log("Error:", error);
}
run();
