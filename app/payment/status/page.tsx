'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { getPaymentStatus, getStoredToken } from '@/services/home';

type State = 'loading' | 'pending' | 'success' | 'failed' | 'error';

export default function PaymentStatusPage() {
  const [reference, setReference] = useState('');
  const [state, setState] = useState<State>('loading');
  const [message, setMessage] = useState('Confirm the payment prompt on your phone.');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentReference = params.get('reference') || params.get('tx_ref') || '';
    setReference(paymentReference);
    if (!paymentReference) {
      setState(params.get('status') === 'success' ? 'success' : 'error');
      setMessage('No payment reference was returned. Check your account before trying again.');
      return;
    }

    let active = true;
    let attempts = 0;
    const poll = async () => {
      try {
        const payment = await getPaymentStatus(paymentReference, getStoredToken());
        if (!active) return;
        if (payment.status === 'paid' || payment.status === 'successful') {
          setState('success');
          return;
        }
        if (['failed', 'cancelled', 'expired'].includes(payment.status)) {
          setState('failed');
          setMessage('The payment was not completed. You can try again with another payment method.');
          return;
        }
        setState('pending');
        attempts += 1;
        if (attempts < 24) window.setTimeout(poll, 5000);
        else setMessage('Payment is still pending. Check your account shortly; do not pay twice.');
      } catch (error) {
        if (active) {
          setState('error');
          setMessage(error instanceof Error ? error.message : 'Payment status could not be checked.');
        }
      }
    };
    poll();
    return () => { active = false; };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050b12] p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-sm border border-white/10 bg-[#0B1626] p-8 text-center shadow-2xl">
        {state === 'loading' || state === 'pending' ? <Loader2 className="mx-auto mb-6 h-16 w-16 animate-spin text-[#45E3FF]" strokeWidth={1.5} /> : null}
        {state === 'success' ? <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-green-500" strokeWidth={1.5} /> : null}
        {state === 'failed' || state === 'error' ? <AlertCircle className="mx-auto mb-6 h-16 w-16 text-nara-red" strokeWidth={1.5} /> : null}
        <h1 className="text-2xl font-black uppercase tracking-tighter text-white">{state === 'success' ? 'Access active' : state === 'failed' ? 'Payment failed' : state === 'error' ? 'Status unavailable' : 'Checking payment'}</h1>
        <p className="mb-8 mt-3 text-gray-400">{message}</p>
        {reference && <p className="mb-6 break-all border-t border-white/10 pt-4 text-xs uppercase tracking-widest text-gray-500">Reference: {reference}</p>}
        <div className="flex flex-col gap-3">
          {state === 'success' ? <Link href="/dashboard" className="w-full rounded-sm bg-[#45E3FF] py-4 font-black uppercase tracking-widest text-black hover:bg-white">Open Account</Link> : null}
          {state === 'failed' ? <Link href="/subscriptions" className="w-full rounded-sm bg-white py-4 font-black uppercase tracking-widest text-black hover:bg-gray-200">Try Again</Link> : null}
          <Link href="/" className="w-full rounded-sm border border-white/10 py-4 font-bold uppercase tracking-widest text-gray-400 hover:border-white/30 hover:text-white">Return Home</Link>
        </div>
      </div>
    </main>
  );
}
