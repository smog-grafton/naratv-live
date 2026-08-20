'use client';

import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import { submitContactMessage } from '@/services/home';

const categories = [
  ['general', 'General enquiry'], ['streaming', 'Streaming or replay'], ['payment', 'Payment'],
  ['tickets', 'Tickets'], ['subscription', 'Subscription'], ['partnership', 'Partnership'],
  ['advertising', 'Advertising'], ['media', 'Media'], ['copyright', 'Copyright or rights'], ['other', 'Other'],
];

export default function ContactForm() {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      category: String(form.get('category') || 'general'),
      subject: String(form.get('subject') || '').trim(),
      message: String(form.get('message') || '').trim(),
      website: String(form.get('website') || ''),
    };
    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setFeedback({ type: 'error', text: 'Please complete your name, email, subject, and message.' });
      return;
    }
    setPending(true);
    setFeedback(null);
    try {
      const result = await submitContactMessage(payload);
      setFeedback({ type: 'success', text: result.message });
      event.currentTarget.reset();
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'We could not send your message. Please try again.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-white/10 bg-white/[0.03] p-6 md:p-8">
      {feedback ? <div role="status" className={feedback.type === 'success' ? 'mb-5 border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100' : 'mb-5 border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100'}>{feedback.text}</div> : null}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm font-bold text-zinc-200">Name<input required name="name" autoComplete="name" className="mt-2 w-full border border-white/10 bg-[#050b12] px-4 py-3 text-white outline-none focus:border-[#45E3FF]" /></label>
        <label className="text-sm font-bold text-zinc-200">Email<input required name="email" type="email" autoComplete="email" className="mt-2 w-full border border-white/10 bg-[#050b12] px-4 py-3 text-white outline-none focus:border-[#45E3FF]" /></label>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm font-bold text-zinc-200">Phone <span className="font-normal text-zinc-500">(optional)</span><input name="phone" type="tel" autoComplete="tel" className="mt-2 w-full border border-white/10 bg-[#050b12] px-4 py-3 text-white outline-none focus:border-[#45E3FF]" /></label>
        <label className="text-sm font-bold text-zinc-200">Category<select name="category" className="mt-2 w-full border border-white/10 bg-[#050b12] px-4 py-3 text-white outline-none focus:border-[#45E3FF]">{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>
      <label className="mt-4 block text-sm font-bold text-zinc-200">Subject<input required name="subject" className="mt-2 w-full border border-white/10 bg-[#050b12] px-4 py-3 text-white outline-none focus:border-[#45E3FF]" /></label>
      <label className="mt-4 block text-sm font-bold text-zinc-200">Message<textarea required name="message" rows={7} className="mt-2 w-full resize-y border border-white/10 bg-[#050b12] px-4 py-3 text-white outline-none focus:border-[#45E3FF]" /></label>
      <button type="submit" disabled={pending} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-black uppercase tracking-wider text-black transition-colors hover:bg-[#45E3FF] disabled:cursor-wait disabled:opacity-60"><Send className="h-4 w-4" /> {pending ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
