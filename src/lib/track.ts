'use client';

// Anonymous site statistics: page views and shop order clicks, sent to /api/track.
// Only a random id kept in this browser is stored — no name, email or IP.

const VID_KEY = 'yfk_vid';

export function visitorId(): string {
  try {
    let id = localStorage.getItem(VID_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      localStorage.setItem(VID_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

export function trackEvent(kind: 'view' | 'order', data: { path?: string; label?: string } = {}) {
  if (typeof window === 'undefined' || (navigator as Navigator & { webdriver?: boolean }).webdriver) return;
  let referrer = '';
  try { referrer = document.referrer ? new URL(document.referrer).host : ''; } catch { /* ignore */ }
  if (referrer === location.host) referrer = '';
  const body = JSON.stringify({ kind, path: data.path ?? location.pathname, label: data.label, visitor_id: visitorId(), referrer });
  try {
    if (navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) return;
  } catch { /* fall through */ }
  fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
}
