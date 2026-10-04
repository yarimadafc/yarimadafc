import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a mock client that returns empty data when Supabase is not configured
function createSafeClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    // Return a proxy that handles all Supabase calls gracefully
    const handler: ProxyHandler<any> = {
      get(_target, prop) {
        if (prop === 'from') {
          return () => new Proxy({}, {
            get(_t, p) {
              if (['select', 'insert', 'update', 'delete', 'upsert'].includes(p as string)) {
                return (..._args: any[]) => new Proxy({}, {
                  get(_t2, p2) {
                    // Terminal methods that return data
                    if (['then', 'single', 'maybeSingle'].includes(p2 as string)) {
                      if (p2 === 'then') {
                        return (resolve: any) => resolve({ data: null, error: { message: 'Supabase not configured' } });
                      }
                      return () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
                    }
                    // Chaining methods
                    return (..._a: any[]) => new Proxy({}, handler);
                  }
                });
              }
              return (..._args: any[]) => new Proxy({}, handler);
            }
          });
        }
        return () => new Proxy({}, handler);
      }
    };
    return new Proxy({} as SupabaseClient, handler);
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSafeClient();
