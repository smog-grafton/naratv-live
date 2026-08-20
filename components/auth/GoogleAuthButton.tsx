'use client';

import { useState } from 'react';
import { Chrome, Loader2 } from 'lucide-react';
import { getGoogleRedirectUrl } from '@/services/home';

export default function GoogleAuthButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const continueWithGoogle = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const url = await getGoogleRedirectUrl();
      window.location.assign(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Google sign-in is temporarily unavailable.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={continueWithGoogle} disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-[4px] border border-white/15 bg-white px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-[#f0f3f6] disabled:cursor-wait disabled:opacity-60" aria-label="Continue with Google">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Chrome className="h-5 w-5" />}
        {loading ? 'Opening Google…' : 'Continue with Google'}
      </button>
      {error ? <p role="alert" className="mt-2 rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-100">{error}</p> : null}
    </div>
  );
}
