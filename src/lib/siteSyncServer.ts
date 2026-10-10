// Server side of the admin -> site sync: sends a Supabase Realtime broadcast that every open page
// of the public site listens to (see lib/siteSync.tsx). Uses the REST endpoint, so no socket is kept.
export const SYNC_TOPIC = 'site-sync';

export async function broadcastSiteChange(table: string): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !url.startsWith('http')) return;
  try {
    await fetch(`${url}/realtime/v1/api/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({ messages: [{ topic: SYNC_TOPIC, event: 'changed', payload: { table, at: Date.now() }, private: false }] }),
      signal: AbortSignal.timeout(5000),
    });
  } catch { /* the site still refreshes on focus / interval */ }
}
