// Server side of the admin -> site sync: sends a Supabase Realtime broadcast that open pages
// of the public site listen to (see lib/siteSync.tsx). Uses the REST endpoint, so no socket is kept.
export const SYNC_TOPIC = 'site-sync';

/** Personal channel of one member (see components/AccountWatcher.tsx). */
export const memberTopic = (userId: string) => `member-${userId}`;

export async function broadcast(topic: string, event: string, payload: Record<string, unknown>): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !url.startsWith('http')) return;
  try {
    await fetch(`${url}/realtime/v1/api/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({ messages: [{ topic, event, payload: { ...payload, at: Date.now() }, private: false }] }),
      signal: AbortSignal.timeout(5000),
    });
  } catch { /* clients also re-check on focus */ }
}

export function broadcastSiteChange(table: string): Promise<void> {
  return broadcast(SYNC_TOPIC, 'changed', { table });
}
