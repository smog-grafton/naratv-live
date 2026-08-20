import Link from 'next/link';
import { Search, ShieldCheck, Ticket, Tv } from 'lucide-react';

const topics = [
  {
    icon: Tv,
    title: 'Watching live cards',
    body: 'Live events appear only when the backend has an active stream window. Open the event page or watch page to confirm access.',
  },
  {
    icon: Ticket,
    title: 'Tickets and passes',
    body: 'Eligible event tickets, PPV access, and active NaraTV passes are checked before playback opens.',
  },
  {
    icon: ShieldCheck,
    title: 'Account and devices',
    body: 'Your account keeps subscriptions, purchases, and trusted devices together for future access controls.',
  },
];

export const metadata = {
  title: 'Help Center | NaraTV',
  description: 'Get help with NaraTV live streams, replays, tickets, subscriptions, accounts, and device access.',
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#050b12] pt-24 text-white">
      <section className="border-b border-white/10 px-4 pb-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#45E3FF]">Support</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">Help Center</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
            Find answers for playback, event access, payments, and account management.
          </p>
          <Link href="/search" className="mt-8 inline-flex items-center gap-2 rounded-sm bg-white px-5 py-3 text-sm font-black uppercase tracking-wider text-black hover:bg-[#45E3FF]">
            <Search className="h-4 w-4" /> Search NaraTV
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-12 md:grid-cols-3 md:px-8">
        {topics.map((topic) => (
          <article key={topic.title} className="border border-white/10 bg-white/[0.03] p-6">
            <topic.icon className="mb-5 h-6 w-6 text-[#45E3FF]" />
            <h2 className="mb-3 text-lg font-black">{topic.title}</h2>
            <p className="text-sm leading-relaxed text-zinc-300">{topic.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
