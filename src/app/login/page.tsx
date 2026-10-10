'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { AuthCard, Field, Notice, inputCls } from '@/components/AuthUI';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import { authErrorText, validEmail } from '@/lib/member';

type Mode = 'login' | 'forgot' | 'code';

async function post(url: string, body: unknown): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    return res.ok ? { ok: true } : { ok: false, error: json.error || 'Xəta baş verdi. Yenidən cəhd edin.' };
  } catch {
    return { ok: false, error: 'Şəbəkə xətası. İnternetinizi yoxlayın.' };
  }
}

export default function LoginPage() {
  const { t } = useLang();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newPw, setNewPw] = useState({ a: '', b: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const addr = email.trim().toLowerCase();
  const go = (m: Mode) => { setMode(m); setError(''); setInfo(''); };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(''); setInfo('');
    if (!validEmail(email) || !password) return setError('Email və parolu yazın.');
    setBusy(true);
    let { error: err } = await supabase.auth.signInWithPassword({ email: addr, password });
    // account from the time email confirmation was on: confirm it and try once more
    if (err && /not confirmed/i.test(err.message)) {
      const res = await fetch('/api/members/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: addr }) }).catch(() => null);
      if (res?.ok && (await res.json().catch(() => ({}))).ok) {
        ({ error: err } = await supabase.auth.signInWithPassword({ email: addr, password }));
      }
    }
    setBusy(false);
    if (err) return setError(authErrorText(err.message));
    router.push('/account');
  };

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    setError(''); setInfo('');
    if (!validEmail(email)) return setError('Əvvəlcə email ünvanınızı yazın.');
    setBusy(true);
    const r = await post('/api/members/reset/request', { email: addr });
    setBusy(false);
    if (!r.ok) return setError(r.error!);
    setMode('code');
    setInfo('Bu email ilə hesab varsa, 6 rəqəmli kod göndərildi. Gələnlər və Spam qovluğunu yoxlayın.');
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    if (code.replace(/\D/g, '').length !== 6) return setError('Emaildəki 6 rəqəmli kodu yazın.');
    if (newPw.a.length < 6) return setError('Parol ən azı 6 simvol olmalıdır.');
    if (newPw.a !== newPw.b) return setError('Parollar eyni deyil.');
    setBusy(true);
    const r = await post('/api/members/reset/confirm', { email: addr, code, password: newPw.a });
    if (!r.ok) { setBusy(false); return setError(r.error!); }
    const { error: err } = await supabase.auth.signInWithPassword({ email: addr, password: newPw.a });
    setBusy(false);
    if (err) { go('login'); return setInfo('Parol yeniləndi. Yeni parolla daxil olun.'); }
    router.push('/account');
  };

  const title = mode === 'login' ? 'Daxil ol' : 'Parolu sıfırla';
  const btn = 'btn-fx led-border inline-flex items-center justify-center gap-2 bg-accent text-on-accent font-bold px-8 py-3.5 rounded-xl disabled:opacity-60';

  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title={t(title)} subtitle={t(mode === 'login' ? 'Şəxsi kabinetinizə daxil olun.' : 'Emailinizə göndərilən kodla yeni parol təyin edin.')} />
      <div className="container">
        <AuthCard>
          <div className="max-w-lg mx-auto space-y-5">
            {mode === 'login' && (
              <form onSubmit={login} className="space-y-5" noValidate>
                <Field label="Email" required><input type="email" className={inputCls} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
                <Field label="Parol" required><input type="password" className={inputCls} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></Field>
                {error && <Notice kind="error">{t(error)}</Notice>}
                {info && <Notice kind="success">{t(info)}</Notice>}
                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" disabled={busy} className={btn}><LogIn className="w-4 h-4" /> {busy ? t('Gözləyin...') : t('Daxil ol')}</button>
                  <button type="button" onClick={() => go('forgot')} className="text-sm text-text-sec hover:text-accent underline">{t('Parolu unutdum')}</button>
                </div>
                <p className="text-sm text-text-sec">{t('Hesabınız yoxdur?')} <Link href="/join" className="text-accent font-semibold hover:underline">{t('Qeydiyyatdan keçin')}</Link></p>
              </form>
            )}

            {mode === 'forgot' && (
              <form onSubmit={sendCode} className="space-y-5" noValidate>
                <p className="text-sm text-text-sec">{t('Hesabınızın email ünvanını yazın — sizə 6 rəqəmli sıfırlama kodu göndərəcəyik.')}</p>
                <Field label="Email" required><input type="email" className={inputCls} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus /></Field>
                {error && <Notice kind="error">{t(error)}</Notice>}
                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" disabled={busy} className={btn}><Mail className="w-4 h-4" /> {busy ? t('Gözləyin...') : t('Kodu göndər')}</button>
                  <button type="button" onClick={() => go('login')} className="inline-flex items-center gap-1 text-sm text-text-sec hover:text-accent"><ArrowLeft className="w-4 h-4" /> {t('Girişə qayıt')}</button>
                </div>
              </form>
            )}

            {mode === 'code' && (
              <form onSubmit={resetPassword} className="space-y-5" noValidate>
                {info && <Notice kind="success">{t(info)}</Notice>}
                <Field label="Emaildəki kod" required>
                  <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} className={`${inputCls} text-center text-2xl font-black tracking-[0.5em] tabular-nums`} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="••••••" autoFocus />
                </Field>
                <Field label="Yeni parol" required hint="Ən azı 6 simvol"><input type="password" className={inputCls} autoComplete="new-password" value={newPw.a} onChange={e => setNewPw(s => ({ ...s, a: e.target.value }))} maxLength={72} /></Field>
                <Field label="Parolu təkrarlayın" required><input type="password" className={inputCls} autoComplete="new-password" value={newPw.b} onChange={e => setNewPw(s => ({ ...s, b: e.target.value }))} maxLength={72} /></Field>
                {error && <Notice kind="error">{t(error)}</Notice>}
                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" disabled={busy} className={btn}><KeyRound className="w-4 h-4" /> {busy ? t('Gözləyin...') : t('Parolu yenilə')}</button>
                  <button type="button" onClick={() => sendCode()} disabled={busy} className="text-sm text-text-sec hover:text-accent underline">{t('Kodu yenidən göndər')}</button>
                  <button type="button" onClick={() => go('login')} className="inline-flex items-center gap-1 text-sm text-text-sec hover:text-accent"><ArrowLeft className="w-4 h-4" /> {t('Girişə qayıt')}</button>
                </div>
              </form>
            )}
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
