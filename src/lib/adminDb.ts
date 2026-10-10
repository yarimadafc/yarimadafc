// Client-side helper for admin writes. Mirrors the supabase-js chain used in the admin panel
// (insert/update/upsert/delete + eq + select) but runs on the server via /api/admin/db.
type Result = { data: any; error: { message: string } | null };

// Every admin write reports its outcome (shown as a toast by the dashboard), so failures are never silent.
function notify(kind: 'success' | 'error', message: string) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('admin-toast', { detail: { kind, message } }));
}

class AdminQuery implements PromiseLike<Result> {
  private action: 'insert' | 'update' | 'upsert' | 'delete' = 'insert';
  private payload: unknown;
  private options: unknown;
  private filters: [string, unknown][] = [];
  private returning = false;

  constructor(private table: string) {}

  insert(values: unknown) { this.action = 'insert'; this.payload = values; return this; }
  update(values: unknown) { this.action = 'update'; this.payload = values; return this; }
  upsert(values: unknown, options?: unknown) { this.action = 'upsert'; this.payload = values; this.options = options; return this; }
  delete() { this.action = 'delete'; return this; }
  eq(column: string, value: unknown) { this.filters.push([column, value]); return this; }
  select() { this.returning = true; return this; }

  private async run(): Promise<Result> {
    try {
      const res = await fetch('/api/admin/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: this.table, action: this.action, payload: this.payload,
          options: this.options, filters: this.filters, returning: this.returning,
        }),
      });
      const json = await res.json().catch(() => ({}));
      const error = json.error ?? (res.ok ? null : { message: res.status === 401 ? 'Sessiya bitib, yenidən daxil olun.' : `HTTP ${res.status}` });
      notify(error ? 'error' : 'success', error ? error.message : this.action === 'delete' ? 'Silindi' : 'Yadda saxlanıldı');
      return { data: json.data ?? null, error };
    } catch (e: any) {
      notify('error', e?.message || 'Şəbəkə xətası');
      return { data: null, error: { message: e?.message || 'Network error' } };
    }
  }

  then<R1 = Result, R2 = never>(
    onfulfilled?: ((value: Result) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | null,
  ): PromiseLike<R1 | R2> {
    return this.run().then(onfulfilled, onrejected);
  }
}

export const adminDb = { from: (table: string) => new AdminQuery(table) };
