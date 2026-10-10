import { createHash, randomInt, timingSafeEqual } from 'crypto';

// Server-only helpers for the email reset code.
export const CODE_TTL_MIN = 15;
export const MAX_CODE_ATTEMPTS = 5;

const pepper = () => process.env.PASSWORD_RESET_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const newCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');

export const hashCode = (userId: string, code: string) =>
  createHash('sha256').update(`${pepper()}:${userId}:${code}`).digest('hex');

export function sameHash(a: string, b: string) {
  const x = Buffer.from(a, 'hex'), y = Buffer.from(b, 'hex');
  return x.length === y.length && timingSafeEqual(x, y);
}

const esc = (v: string) => v.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

const FROM = () => process.env.RESEND_FROM || 'Yarımada FK <no-reply@yarimadafc.com>';

/** Sends the code with Resend (https://resend.com/docs/api-reference/emails/send-email). */
export async function sendResetEmail(to: string, code: string, name?: string | null): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: 'RESEND_API_KEY is not configured' };
  const hello = name ? `Salam, ${name.slice(0, 80)}!` : 'Salam!';
  const html = `<!doctype html><html><body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#051024">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden">
      <tr><td style="background:#051024;padding:22px 28px;color:#ffffff;font-size:20px;font-weight:bold">Yarımada FK</td></tr>
      <tr><td style="padding:28px">
        <p style="margin:0 0 12px;font-size:16px">${esc(hello)}</p>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.5">Hesabınızın parolunu sıfırlamaq üçün bu kodu saytda daxil edin:</p>
        <div style="font-size:34px;font-weight:bold;letter-spacing:10px;text-align:center;background:#f3f4f6;border-radius:12px;padding:16px 0;margin:0 0 20px">${code}</div>
        <p style="margin:0 0 8px;font-size:13px;color:#4b5563">Kod ${CODE_TTL_MIN} dəqiqə etibarlıdır və yalnız bir dəfə istifadə olunur.</p>
        <p style="margin:0;font-size:13px;color:#4b5563">Bu sorğunu siz göndərməmisinizsə, bu məktubu nəzərə almayın — parolunuz dəyişməyəcək.</p>
      </td></tr>
      <tr><td style="padding:16px 28px;background:#f9fafb;font-size:12px;color:#6b7280">Bu avtomatik məktubdur, cavab verməyin. · yarimadafc.com</td></tr>
    </table>
  </td></tr></table></body></html>`;
  const text = `${hello}\n\nParol sıfırlama kodunuz: ${code}\nKod ${CODE_TTL_MIN} dəqiqə etibarlıdır.\n\nBu sorğunu siz göndərməmisinizsə, məktubu nəzərə almayın.\n\nYarımada FK — yarimadafc.com`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM(), to: [to], subject: 'Yarımada FK — parol sıfırlama kodu', html, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { ok: false, error: `Resend ${res.status}: ${(await res.text()).slice(0, 300)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
