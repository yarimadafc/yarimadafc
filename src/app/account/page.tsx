'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Save, KeyRound } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { AuthCard, Field, Notice, inputCls } from '@/components/AuthUI';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import { GENDERS, ageFromBirth, authErrorText, normalizePhone, useMember, validPhone, validateBirth } from '@/lib/member';

export default function AccountPage() {
  const { t } = useLang();
  const router = useRouter();
  const { user, loading } = useMember();
  const [p, setP] = useState({ first_name: '', last_name: '', gender: '', birth_date: '', phone: '' });
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const [pw, setPw] = useState({ a: '', b: '' });
  const [pwMsg, setPwMsg] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => { if (!loading && !user) router.replace('/login'); }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from('member_profiles').select('*').eq('user_id', user.id).maybeSingle();
      if (cancelled) return;
      const meta = (user.user_metadata || {}) as Record<string, string>;
      const src = (data || meta) as Record<string, string | null>;
      setP({ first_name: src.first_name || '', last_name: src.last_name || '', gender: src.gender || '', birth_date: src.birth_date || '', phone: src.phone || '' });
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const set = (k: keyof typeof p) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setP(prev => ({ ...prev, [k]: e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || busy) return;
    setMsg(null);
    const problem =
      p.first_name.trim().length < 2 ? 'Adınızı yazın.'
      : p.last_name.trim().length < 2 ? 'Soyadınızı yazın.'
      : !p.gender ? 'Cinsi seçin.'
      : validateBirth(p.birth_date) || (!validPhone(p.phone) ? 'Telefon nömrəsini düzgün yazın.' : null);
    if (problem) return setMsg({ kind: 'error', text: problem });
    setBusy(true);
    const row = { first_name: p.first_name.trim(), last_name: p.last_name.trim(), gender: p.gender, birth_date: p.birth_date, phone: normalizePhone(p.phone) };
    // update first; if the row does not exist yet (e.g. sign-up before the SQL was run), create it
    const { data: upd, error: err } = await supabase.from('member_profiles').update({ ...row, updated_at: new Date().toISOString() }).eq('user_id', user.id).select('user_id');
    let failed = err;
    if (!err && (!upd || upd.length === 0)) {
      const res = await supabase.from('member_profiles').insert({ user_id: user.id, email: user.email, ...row });
      failed = res.error;
    }
    setBusy(false);
    setMsg(failed ? { kind: 'error', text: 'Xəta baş verdi. Yenidən cəhd edin.' } : { kind: 'success', text: 'Məlumatlar yadda saxlanıldı.' });
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.a.length < 6) return setPwMsg({ kind: 'error', text: 'Parol ən azı 6 simvol olmalıdır.' });
    if (pw.a !== pw.b) return setPwMsg({ kind: 'error', text: 'Parollar eyni deyil.' });
    const { error: err } = await supabase.auth.updateUser({ password: pw.a });
    if (err) return setPwMsg({ kind: 'error', text: authErrorText(err.message) });
    setPw({ a: '', b: '' });
    setPwMsg({ kind: 'success', text: 'Parol dəyişdirildi.' });
  };

  const logout = async () => { await supabase.auth.signOut(); router.push('/'); };

  if (loading || !user) return <div className="pt-header min-h-screen" />;
  const age = ageFromBirth(p.birth_date);

  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title={t('Hesabım')} subtitle={user.email || ''}>
        <button onClick={logout} className="btn-fx mt-5 inline-flex items-center gap-2 border border-bg-border px-5 py-2.5 rounded-xl text-sm font-semibold text-text-sec hover:text-text-main">
          <LogOut className="w-4 h-4" /> {t('Çıxış')}
        </button>
      </PageHero>
      <div className="container space-y-8">
        <AuthCard>
          <h2 className="text-xl font-extrabold text-text-main mb-6">{t('Şəxsi məlumatlar')}{age !== null && <span className="ml-3 text-sm font-semibold text-text-sec">{age} {t('yaş')}</span>}</h2>
          {!ready ? <div className="h-48 rounded-xl bg-bg-main animate-pulse" /> : (
            <form onSubmit={save} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Ad" required><input className={inputCls} value={p.first_name} onChange={set('first_name')} maxLength={80} /></Field>
                <Field label="Soyad" required><input className={inputCls} value={p.last_name} onChange={set('last_name')} maxLength={80} /></Field>
                <Field label="Cins" required>
                  <select className={inputCls} value={p.gender} onChange={set('gender')}>
                    <option value="">{t('Seçin...')}</option>
                    {GENDERS.map(g => <option key={g.value} value={g.value}>{t(g.label)}</option>)}
                  </select>
                </Field>
                <Field label="Doğum tarixi" required><input type="date" className={inputCls} value={p.birth_date} max={today} min="1920-01-01" onChange={set('birth_date')} /></Field>
                <Field label="Telefon nömrəsi" required><input type="tel" className={inputCls} value={p.phone} onChange={set('phone')} maxLength={25} /></Field>
                <Field label="Email"><input className={inputCls} value={user.email || ''} disabled readOnly /></Field>
              </div>
              {msg && <Notice kind={msg.kind}>{t(msg.text)}</Notice>}
              <button type="submit" disabled={busy} className="btn-fx led-border inline-flex items-center gap-2 bg-accent text-on-accent font-bold px-8 py-3.5 rounded-xl disabled:opacity-60">
                <Save className="w-4 h-4" /> {busy ? t('Gözləyin...') : t('Yadda saxla')}
              </button>
            </form>
          )}
        </AuthCard>

        <AuthCard>
          <h2 className="text-xl font-extrabold text-text-main mb-6">{t('Parolu dəyiş')}</h2>
          <form onSubmit={changePassword} className="space-y-5 max-w-lg" noValidate>
            <Field label="Yeni parol" hint="Ən azı 6 simvol"><input type="password" className={inputCls} autoComplete="new-password" value={pw.a} onChange={e => setPw(s => ({ ...s, a: e.target.value }))} maxLength={72} /></Field>
            <Field label="Parolu təkrarlayın"><input type="password" className={inputCls} autoComplete="new-password" value={pw.b} onChange={e => setPw(s => ({ ...s, b: e.target.value }))} maxLength={72} /></Field>
            {pwMsg && <Notice kind={pwMsg.kind}>{t(pwMsg.text)}</Notice>}
            <button type="submit" className="btn-fx inline-flex items-center gap-2 border border-bg-border px-6 py-3 rounded-xl font-semibold text-text-main hover:border-accent">
              <KeyRound className="w-4 h-4" /> {t('Parolu dəyiş')}
            </button>
          </form>
        </AuthCard>
        <p className="text-sm text-text-sec text-center"><Link href="/register" className="hover:text-accent underline">{t('Akademiyaya qeydiyyat')}</Link></p>
      </div>
    </div>
  );
}
