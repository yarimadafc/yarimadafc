import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a safe client that NEVER blocks the build process
function createSafeClient(): SupabaseClient {
  const isBuild = process.env.NODE_ENV === 'production' && !supabaseUrl.startsWith('http');
  
  if (isBuild || !supabaseUrl || !supabaseUrl.startsWith('http')) {
    // Return a highly simplified mock that immediately resolves promises
    const mockBuilder = {
      select: () => mockBuilder,
      insert: () => mockBuilder,
      update: () => mockBuilder,
      delete: () => mockBuilder,
      eq: () => mockBuilder,
      neq: () => mockBuilder,
      gt: () => mockBuilder,
      lt: () => mockBuilder,
      in: () => mockBuilder,
      like: () => mockBuilder,
      ilike: () => mockBuilder,
      or: () => mockBuilder,
      upsert: () => mockBuilder,
      order: () => mockBuilder,
      limit: () => mockBuilder,
      single: () => mockBuilder,
      maybeSingle: () => mockBuilder,
      // The most critical part: immediately resolve when awaited
      then: (resolve: any) => resolve({ data: null, error: null }),
      catch: (reject: any) => reject(new Error('Supabase mock')),
      finally: (cb: any) => { cb(); return mockBuilder; }
    };

    return {
      from: () => mockBuilder,
      rpc: () => mockBuilder,
      channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
      removeChannel: () => {},
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: {}, error: null }),
        signOut: async () => ({ error: null }),
        signUp: async () => ({ data: { user: null, session: null }, error: null }),
        updateUser: async () => ({ data: { user: null }, error: null }),
        resetPasswordForEmail: async () => ({ data: {}, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      }
    } as unknown as SupabaseClient;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSafeClient();
