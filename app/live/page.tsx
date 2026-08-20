import Link from 'next/link';
import type { Metadata } from 'next';
import { CalendarClock, Radio, Sparkles } from 'lucide-react';
import { getEvents } from '@/services/home';
import EventCard from '@/components/boxing/EventCard';
import SectionHeader from '@/components/ui/SectionHeader';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Live Boxing | NaraTV',
  description: 'Watch active NaraTV boxing broadcasts and see what is coming up next.',
};

export default async function LivePage() {
  const [liveEvents, upcomingEvents] = await Promise.all([
    getEvents({ status: 'live', streamable: 1, limit: 12 }).catch(() => []),
    getEvents({ status: 'upcoming', streamable: 1, limit: 12 }).catch(() => []),
  ]);
  const featured = liveEvents[0] || upcomingEvents[0];

  return (
    <main className="min-h-screen bg-[#050b12] pb-24 pt-24 md:pt-28">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(255,40,77,0.15),transparent_34%),#07111f]">
        <div className="mx-auto max-w-[1920px] px-4 pb-8 pt-6 md:px-12 md:pb-12">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#ff284d]"><Radio className="h-4 w-4 animate-pulse" /> NaraTV live</p>
              <h1 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight text-white md:text-7xl">The action is here.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">Open broadcasts, scheduled cards, and the next place to be when the bell rings.</p>
            </div>
            <Link href="/events" className="inline-flex min-h-11 items-center gap-2 self-start border border-white/20 px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:border-[#45E3FF] hover:text-[#45E3FF] md:self-auto"><CalendarClock className="h-4 w-4" /> Full schedule</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1920px] space-y-14 px-4 pt-8 md:space-y-20 md:px-12 md:pt-12">
        {featured ? (
          <section>
            <SectionHeader eyebrow={featured.is_live ? 'On air now' : 'Next live window'} title={featured.is_live ? 'Watch live' : 'Get ready for the next card'} description={featured.is_live ? 'This is an active NaraTV broadcast. Playback and access are checked when you open the event.' : 'There is no active broadcast at this moment. Keep this page close for the next scheduled stream.'} href={featured.is_live ? '/watch/' + featured.slug : '/events?status=upcoming'} actionLabel={featured.is_live ? 'Open stream' : 'View event'} />
            <EventCard event={featured} variant="featured" />
          </section>
        ) : (
          <section className="border border-white/10 bg-[#0B1626] p-8 md:p-12">
            <Sparkles className="mb-4 h-7 w-7 text-[#45E3FF]" />
            <h2 className="text-2xl font-black uppercase text-white md:text-4xl">The next broadcast is being prepared.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">There is no live or scheduled stream published right now. Browse the event calendar or return when the next card is announced.</p>
            <Link href="/events" className="mt-6 inline-flex min-h-11 items-center bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-[#45E3FF]">Browse events</Link>
          </section>
        )}

        {liveEvents.length > 1 ? <section><SectionHeader eyebrow="On air now" title="More live coverage" href="/events?status=live" actionLabel="All live cards" /><div className="border border-white/10 bg-[#0B1626]">{liveEvents.slice(1).map((event) => <EventCard key={event.id} event={event} variant="row" />)}</div></section> : null}

        <section>
          <SectionHeader eyebrow="Coming up" title="Next on NaraTV" description="Plan your watch window before the broadcast starts." href="/events?status=upcoming" actionLabel="All upcoming" />
          {upcomingEvents.length ? <div className="border border-white/10 bg-[#0B1626]">{upcomingEvents.slice(0, 8).map((event) => <EventCard key={event.id} event={event} variant="row" />)}</div> : <div className="border border-white/10 bg-[#0B1626] p-8 text-center text-sm text-gray-400">No upcoming live windows are published yet.</div>}
        </section>
      </div>
    </main>
  );
}
