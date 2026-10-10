'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { AuthCard, Field, Notice, inputCls } from '@/components/AuthUI';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import { authErrorText, validEmail } from '@/lib/member';

function LoginForm() {
  const { t } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(''); setInfo('');
    if (!validEmail(email) || !password) return setError('Email və parolu yazın.');
    setBusy(true);
    const addr = email.trim().toLowerCase();
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

  const forgot = async () => {
    setError(''); setInfo('');
    if (!validEmail(email)) return setError('Əvvəlcə email ünvanınızı yazın.');
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/account` });
    setBusy(false);
    if (err) return setError(authErrorText(err.message));
    setInfo('Parolu yeniləmək üçün link emailinizə göndərildi.');
  };

  return (
    <AuthCard>
      <form onSubmit={submit} className="space-y-5 max-w-lg mx-auto" noValidate>
        <Field label="Email" required><input type="email" className={inputCls} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Parol" required><input type="password" className={inputCls} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></Field>
        {error && <Notice kind="error">{t(error)}</Notice>}
        {info && <Notice kind="success">{t(info)}</Notice>}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={busy} className="btn-fx led-border inline-flex items-center justify-center gap-2 bg-accent text-on-accent font-bold px-8 py-3.5 rounded-xl disabled:opacity-60">
            <LogIn className="w-4 h-4" /> {busy ? t('Gözləyin...') : t('Daxil ol')}
          </button>
          <button type="button" onClick={forgot} disabled={busy} className="text-sm text-text-sec hover:text-accent underline">{t('Parolu unutdum')}</button>
        </div>
        <p className="text-sm text-text-sec">{t('Hesabınız yoxdur?')} <Link href="/join" className="text-accent font-semibold hover:underline">{t('Qeydiyyatdan keçin')}</Link></p>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  const { t } = useLang();
  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title={t('Daxil ol')} subtitle={t('Şəxsi kabinetinizə daxil olun.')} />
      <div className="container"><Suspense fallback={null}><LoginForm /></Suspense></div>
    </div>
  );
}
