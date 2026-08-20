'use client';

import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { requestPasswordReset } from '@/services/home';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not start the password reset.');
    } finally {
      setLoading(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#050b12] px-4 py-20 text-white"><div className="w-full max-w-md"><Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft size={16} /> Back to login</Link><h1 className="mt-10 text-3xl font-black uppercase">Reset your password</h1><p className="mt-3 text-sm leading-6 text-gray-400">Enter your email and we&apos;ll send a secure reset link if the account exists.</p><form onSubmit={submit} className="mt-8 grid gap-4"><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="border border-[#172338] bg-transparent px-4 py-3.5 text-white outline-none focus:border-[#45E3FF]" />{message ? <p className="border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">{message}</p> : null}{error ? <p className="border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">{error}</p> : null}<button disabled={loading} className="flex items-center justify-center gap-2 bg-[#45E3FF] px-5 py-3.5 text-sm font-black uppercase text-black disabled:opacity-50">{loading ? <Loader2 className="animate-spin" size={18} /> : null} Send reset link</button></form></div></main>;
}
