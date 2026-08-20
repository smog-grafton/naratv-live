'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-nara-black px-4 py-28 text-white">
      <div className="w-full max-w-lg border border-white/10 bg-[#0B1626] p-8 text-center shadow-2xl md:p-12">
        <AlertTriangle className="mx-auto h-10 w-10 text-nara-red" />
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-nara-cyan">NaraTV</p>
        <h1 className="mt-3 text-2xl font-black uppercase tracking-tight">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-gray-400">This round did not load correctly. Try again or return to the NaraTV home page.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 bg-nara-cyan px-5 py-3 text-sm font-black uppercase tracking-wider text-black hover:bg-white"><RefreshCcw size={16} /> Try again</button>
          <Link href="/" className="inline-flex items-center justify-center border border-white/15 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white hover:border-white/40">Return home</Link>
        </div>
      </div>
    </main>
  );
}
