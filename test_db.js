const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data } = await supabase.from('matches').select('*');
  console.log('Matches:', data?.map(m => ({ id: m.id, home: m.home_team, away: m.away_team, is_hero: m.is_hero, status: m.status })));
}
test();
