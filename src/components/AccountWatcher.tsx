'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserX, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { signOutMember, useMember } from '@/lib/member';
import { useLang } from '@/lib/i18n';

const CHECK_GAP = 60_000;

// If the admin deletes a member, every page the member has open signs out at once and says so.
// Instant path: a Realtime message on the member's own channel. Fallback: the account is re-checked
// with Supabase when a page opens and when the tab becomes visible again.
export default function AccountWatcher() {
  const { user } = useMember();
  const { t } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const [notice, setNotice] = useState(false);
  const pathRef = useRef(pathname);
  pathRef.current = pathname;
  const lastCheck = useRef(0);

  useEffect(() => {
    if (!user) return;
    let done = false;

    const kickOut = async () => {
      if (done) return;
      done = true;
      await signOutMember();
      setNotice(true); // this component lives in the layout, so the message stays after the redirect
      if (pathRef.current.startsWith('/account')) router.replace('/');
    };

    const check = async () => {
      if (done || Date.now() - lastCheck.current < CHECK_GAP) return;
      lastCheck.current = Date.now();
      const { error } = await supabase.auth.getUser();
      // only a definite "this user no longer exists" answer counts — never a network error
      if (error && (error.status === 403 || error.status === 404 || /not.?exist|not.?found|user_not_found/i.test(`${error.message} ${(error as { code?: string }).code ?? ''}`))) {
        kickOut();
      }
    };

    const ch = supabase.channel?.(`member-${user.id}`);
    ch?.on?.('broadcast', { event: 'account-deleted' }, kickOut).subscribe?.();
    check();
    const onVisible = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      done = true;
      document.removeEventListener('visibilitychange', onVisible);
      if (ch) supabase.removeChannel?.(ch);
    };
  }, [user, router]);

  if (!notice) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="alertdialog" aria-modal="true" aria-labelledby="acc-del-title">
      <div className="w-full max-w-md rounded-2xl border border-bg-border bg-bg-sec p-6 shadow-2xl text-center animate-[fade-in_.25s_ease-out_both]">
        <span className="mx-auto mb-4 flex w-14 h-14 items-center justify-center rounded-full bg-red-500/15 text-red-500"><UserX className="w-7 h-7" /></span>
        <h2 id="acc-del-title" className="text-xl font-extrabold text-text-main">{t('Hesabınız silindi')}</h2>
        <p className="mt-2 text-sm text-text-sec">{t('Hesabınız klub tərəfindən silindiyi üçün sistemdən çıxış edildi. Suallarınız varsa, bizimlə əlaqə saxlayın.')}</p>
        <button onClick={() => setNotice(false)} className="btn-fx mt-6 inline-flex items-center gap-2 bg-accent text-on-accent font-bold px-6 py-3 rounded-xl">
          <X className="w-4 h-4" /> {t('Bağla')}
        </button>
      </div>
    </div>
  );
}
