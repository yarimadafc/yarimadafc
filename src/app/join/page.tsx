'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { AuthCard, Field, Notice, inputCls } from '@/components/AuthUI';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import { GENDERS, authErrorText, normalizePhone, validEmail, validPhone, validateBirth } from '@/lib/member';

export default function JoinPage() {
  const { t } = useLang();
  const router = useRouter();
  const [v, setV] = useState({ first_name: '', last_name: '', gender: '', birth_date: '', phone: '', email: '', password: '', password2: '', website: '' });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV(p => ({ ...p, [k]: e.target.value }));
  const today = new Date().toISOString().slice(0, 10);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    if (v.website) return; // honeypot: real people never fill this hidden field
    const problem =
      v.first_name.trim().length < 2 ? 'Adınızı yazın.'
      : v.last_name.trim().length < 2 ? 'Soyadınızı yazın.'
      : !v.gender ? 'Cinsi seçin.'
      : validateBirth(v.birth_date)
      || (!validPhone(v.phone) ? 'Telefon nömrəsini düzgün yazın.'
      : !validEmail(v.email) ? 'Email düzgün deyil.'
      : v.password.length < 6 ? 'Parol ən azı 6 simvol olmalıdır.'
      : v.password !== v.password2 ? 'Parollar eyni deyil.'
      : !agree ? 'Məxfilik siyasəti ilə razılaşmalısınız.' : null);
    if (problem) return setError(problem);

    setBusy(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: v.email.trim().toLowerCase(),
      password: v.password,
      options: {
        data: {
          first_name: v.first_name.trim(), last_name: v.last_name.trim(), gender: v.gender,
          birth_date: v.birth_date, phone: normalizePhone(v.phone),
        },
      },
    });
    setBusy(false);
    if (err) return setError(authErrorText(err.message));
    if (data.user && data.user.identities?.length === 0) return setError('Bu email artıq qeydiyyatdan keçib. Daxil olun.');
    if (data.session) return router.push('/account');
    setDone(true); // email confirmation turned on in Supabase
  };

  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title={t('Bizə qoşul')} subtitle={t('Hesab yaradın: akademiya və klub xəbərləri üçün şəxsi kabinetinizə daxil olun.')} />
      <div className="container">
        <AuthCard>
          {done ? (
            <Notice kind="success">{t('Qeydiyyat tamamlandı. Emailinizə göndərilən təsdiq linkinə klikləyin, sonra daxil olun.')}</Notice>
          ) : (
            <form onSubmit={submit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Ad" required><input className={inputCls} autoComplete="given-name" value={v.first_name} onChange={set('first_name')} maxLength={80} /></Field>
                <Field label="Soyad" required><input className={inputCls} autoComplete="family-name" value={v.last_name} onChange={set('last_name')} maxLength={80} /></Field>
                <Field label="Cins" required>
                  <select className={inputCls} value={v.gender} onChange={set('gender')}>
                    <option value="">{t('Seçin...')}</option>
                    {GENDERS.map(g => <option key={g.value} value={g.value}>{t(g.label)}</option>)}
                  </select>
                </Field>
                <Field label="Doğum tarixi" required><input type="date" className={inputCls} value={v.birth_date} max={today} min="1920-01-01" onChange={set('birth_date')} /></Field>
                <Field label="Telefon nömrəsi" required><input type="tel" className={inputCls} autoComplete="tel" placeholder="050 000 00 00" value={v.phone} onChange={set('phone')} maxLength={25} /></Field>
                <Field label="Email" required><input type="email" className={inputCls} autoComplete="email" value={v.email} onChange={set('email')} maxLength={120} /></Field>
                <Field label="Parol" required hint="Ən azı 6 simvol"><input type="password" className={inputCls} autoComplete="new-password" value={v.password} onChange={set('password')} maxLength={72} /></Field>
                <Field label="Parolu təkrarlayın" required><input type="password" className={inputCls} autoComplete="new-password" value={v.password2} onChange={set('password2')} maxLength={72} /></Field>
              </div>
              {/* honeypot */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                <label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} /></label>
              </div>
              <label className="flex items-start gap-3 text-sm text-text-sec cursor-pointer">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-1 w-4 h-4 accent-[var(--accent)]" />
                <span>{t('Şəxsi məlumatlarımın emalına razıyam.')} <Link href="/privacy" className="text-accent underline">{t('Məxfilik siyasəti')}</Link></span>
              </label>
              {error && <Notice kind="error">{t(error)}</Notice>}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button type="submit" disabled={busy} className="btn-fx led-border inline-flex items-center justify-center gap-2 bg-accent text-on-accent font-bold px-8 py-3.5 rounded-xl disabled:opacity-60">
                  <UserPlus className="w-4 h-4" /> {busy ? t('Gözləyin...') : t('Qeydiyyatdan keç')}
                </button>
                <span className="text-sm text-text-sec">{t('Artıq hesabınız var?')} <Link href="/login" className="text-accent font-semibold hover:underline">{t('Daxil olun')}</Link></span>
              </div>
            </form>
          )}
        </AuthCard>
      </div>
    </div>
  );
}
