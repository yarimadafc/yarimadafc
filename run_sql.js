const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createTable() {
  const { data, error } = await supabase.rpc('run_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS leadership (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        position TEXT,
        image_url TEXT,
        bio TEXT,
        order_num INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  console.log(error || 'Success');
}
// createTable();
// wait, I can't run raw SQL directly from the JS client easily unless they have `run_sql` RPC or similar.
