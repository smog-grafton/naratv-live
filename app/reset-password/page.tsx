'use client';

import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { resetPassword } from '@/services/home';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get('email') || '');
    setToken(params.get('token') || '');
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await resetPassword({ email, token, password, password_confirmation: confirmation });
      setMessage(result.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not reset your password.');
    } finally {
      setLoading(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#050b12] px-4 py-20 text-white"><div className="w-full max-w-md"><Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft size={16} /> Back to login</Link><h1 className="mt-10 text-3xl font-black uppercase">Choose a new password</h1><form onSubmit={submit} className="mt-8 grid gap-4"><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="border border-[#172338] bg-transparent px-4 py-3.5 text-white outline-none focus:border-[#45E3FF]" /><input required value={token} onChange={(event) => setToken(event.target.value)} placeholder="Reset token" className="border border-[#172338] bg-transparent px-4 py-3.5 text-white outline-none focus:border-[#45E3FF]" /><input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="border border-[#172338] bg-transparent px-4 py-3.5 text-white outline-none focus:border-[#45E3FF]" /><input type="password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Confirm new password" className="border border-[#172338] bg-transparent px-4 py-3.5 text-white outline-none focus:border-[#45E3FF]" />{message ? <p className="border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">{message} <Link href="/login" className="font-bold underline">Log in</Link></p> : null}{error ? <p className="border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">{error}</p> : null}<button disabled={loading} className="flex items-center justify-center gap-2 bg-[#45E3FF] px-5 py-3.5 text-sm font-black uppercase text-black disabled:opacity-50">{loading ? <Loader2 className="animate-spin" size={18} /> : null} Update password</button></form></div></main>;
}
