import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a safe client that NEVER blocks the build process
function createSafeClient(): SupabaseClient {
  const isBuild = process.env.NODE_ENV === 'production' && !supabaseUrl.startsWith('http');
  
  if (isBuild || !supabaseUrl || !supabaseUrl.startsWith('http')) {
    // Return a dummy proxy that instantly resolves promises with empty data
    const handler: ProxyHandler<any> = {
      get(_target, prop) {
        if (prop === 'from') {
          return () => new Proxy({}, {
            get(_t, p) {
              if (['select', 'insert', 'update', 'delete', 'upsert', 'order', 'eq', 'single', 'limit'].includes(p as string)) {
                return (..._args: any[]) => new Proxy({}, {
                  get(_t2, p2) {
                    if (p2 === 'then') {
                      return (resolve: any) => resolve({ data: null, error: { message: 'Supabase mock' } });
                    }
                    if (['select', 'insert', 'update', 'delete', 'upsert', 'order', 'eq', 'single', 'limit'].includes(p2 as string)) {
                        return (..._args2: any[]) => new Proxy({}, handler);
                    }
                    return (..._a: any[]) => Promise.resolve({ data: null, error: null });
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
