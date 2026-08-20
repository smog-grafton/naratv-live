'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { getMe, storeSession } from '@/services/home';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    async function finishSignIn() {
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const query = new URLSearchParams(window.location.search);
      const token = hash.get('token') || query.get('token');
      const next = hash.get('next') || query.get('next') || '/my-account';

      if (!token) {
        setState('failed');
        return;
      }

      try {
        const user = await getMe(token);
        storeSession({ token, user });
      } catch {
        setState('failed');
        return;
      }

      setState('ready');
      router.replace(next.startsWith('/') ? next : '/my-account');
    }

    finishSignIn();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#050B12] px-4 py-28 text-white">
      <div className="mx-auto max-w-xl border border-white/10 bg-[#0B1626] p-8 text-center">
        {state === 'loading' ? <Loader2 className="mx-auto animate-spin text-[#6F88FC]" size={34} /> : null}
        {state === 'ready' ? <CheckCircle2 className="mx-auto text-[#6F88FC]" size={34} /> : null}
        <h1 className="mt-5 text-3xl font-black uppercase text-white">
          {state === 'failed' ? 'Sign-in needs another try' : 'Finishing your sign in'}
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          {state === 'failed'
            ? 'We could not complete Google sign-in this time. You can still sign in with email or phone access.'
            : 'Your NaraTV account is opening with your tickets, watch access, and fight-night rewards close by.'}
        </p>
        {state === 'failed' ? (
          <Link href="/login" className="mt-6 inline-flex justify-center bg-white px-6 py-3 text-sm font-black uppercase tracking-wider text-black">
            Return to sign in
          </Link>
        ) : null}
      </div>
    </main>
  );
}
