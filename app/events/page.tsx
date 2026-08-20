import Link from 'next/link';
import type { Metadata } from 'next';
import { CalendarDays, Radio, Ticket, Trophy } from 'lucide-react';
import { getEvents } from '@/services/home';
import EventCard from '@/components/boxing/EventCard';
import SectionHeader from '@/components/ui/SectionHeader';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Boxing Events, PPV & Replays | NaraTV',
  description: 'Find live boxing, upcoming fight cards, PPV events, and official NaraTV replays.',
};

type Props = { searchParams: Promise<{ status?: string; ppv?: string }> };

const filters = [
  { label: 'All events', href: '/events', key: 'all' },
  { label: 'Live now', href: '/events?status=live', key: 'live' },
  { label: 'Upcoming', href: '/events?status=upcoming', key: 'upcoming' },
  { label: 'PPV cards', href: '/events?ppv=1', key: 'ppv' },
  { label: 'Replay archive', href: '/events?status=completed', key: 'completed' },
];

function isActiveFilter(status: string, ppv: string, key: string) {
  if (key === 'ppv') return ppv === '1';
  if (key === 'all') return !status && ppv !== '1';
  return status === key && ppv !== '1';
}

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedStatus = params.status || '';
  const selectedPpv = params.ppv || '';
  const [allEvents, liveEvents, upcomingEvents, ppvEvents, completedEvents] = await Promise.all([
    getEvents({ limit: 50 }).catch(() => []),
    getEvents({ status: 'live', limit: 12 }).catch(() => []),
    getEvents({ status: 'upcoming', limit: 24 }).catch(() => []),
    getEvents({ ppv: 1, limit: 12 }).catch(() => []),
    getEvents({ status: 'completed', limit: 24 }).catch(() => []),
  ]);

  const filteredEvents = selectedPpv === '1'
    ? ppvEvents
    : selectedStatus === 'live'
      ? liveEvents
      : selectedStatus === 'upcoming'
        ? upcomingEvents
        : selectedStatus === 'completed'
          ? completedEvents
          : allEvents;
  const featured = liveEvents[0] || upcomingEvents.find((event) => event.is_ppv) || upcomingEvents[0] || allEvents[0];
  const featuredId = featured?.id;
  const schedule = (selectedStatus || selectedPpv) ? filteredEvents : upcomingEvents;
  const ppvOnly = ppvEvents.filter((event) => event.id !== featuredId).slice(0, 6);
  const archive = completedEvents.filter((event) => event.id !== featuredId).slice(0, 8);

  return (
    <main className="min-h-screen bg-[#050b12] pb-24 pt-24 md:pt-28">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_80%_0%,rgba(255,40,77,0.14),transparent_34%),#07111f]">
        <div className="mx-auto max-w-[1920px] px-4 pb-8 pt-6 md:px-12 md:pb-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#45E3FF]"><CalendarDays className="h-4 w-4" /> The fight schedule</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-black uppercase leading-none tracking-tight text-white md:text-7xl">Know the next bell.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">Live cards, upcoming matchups, PPV access, and official NaraTV replays — organised around what you want to watch next.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-right lg:border-t-0 lg:pt-0">
              <div><span className="block text-2xl font-black text-white">{allEvents.length}</span><span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Cards</span></div>
              <div><span className="block text-2xl font-black text-[#ff284d]">{liveEvents.length}</span><span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Live</span></div>
              <div><span className="block text-2xl font-black text-[#45E3FF]">{upcomingEvents.length}</span><span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Upcoming</span></div>
            </div>
          </div>
          <nav aria-label="Event filters" className="mt-8 flex snap-x gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {filters.map((filter) => <Link key={filter.key} href={filter.href} className={'min-h-10 shrink-0 snap-start border px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ' + (isActiveFilter(selectedStatus, selectedPpv, filter.key) ? 'border-[#45E3FF] bg-[#45E3FF] text-black' : 'border-white/15 text-gray-300 hover:border-[#45E3FF] hover:text-[#45E3FF]')}>{filter.label}</Link>)}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-[1920px] space-y-14 px-4 pt-8 md:space-y-20 md:px-12 md:pt-12">
        {featured && !selectedStatus && !selectedPpv ? <section><SectionHeader eyebrow={featured.is_live ? 'On air now' : 'Next up'} title={featured.is_live ? 'The fight is live' : 'Featured fight night'} href={featured.is_live ? '/live' : '/events?status=upcoming'} actionLabel={featured.is_live ? 'Open live TV' : 'View schedule'} /><EventCard event={featured} variant="featured" /></section> : null}

        {selectedStatus === 'live' ? (
          <section>
            <SectionHeader eyebrow="On air now" title="Live cards" description="Watch active NaraTV broadcasts while the action is happening." href="/live" actionLabel="Open live TV" />
            {filteredEvents.length ? <div className="border border-white/10 bg-[#0B1626]">{filteredEvents.map((event) => <EventCard key={event.id} event={event} variant="row" />)}</div> : <EmptyEvents message="There are no live broadcasts at this moment." />}
          </section>
        ) : null}

        {(selectedStatus === 'upcoming' || (!selectedStatus && !selectedPpv)) && (
          <section id="upcoming">
            <SectionHeader eyebrow="Mark your calendar" title="Upcoming schedule" description="See the card, check access, and get ready for the next fight night." href="/events?status=upcoming" actionLabel="View all upcoming" />
            {schedule.length ? <div className="border border-white/10 bg-[#0B1626]">{schedule.slice(0, 12).map((event) => <EventCard key={event.id} event={event} variant="row" />)}</div> : <EmptyEvents message="No upcoming events are published yet." />}
          </section>
        )}

        {(selectedPpv === '1' || (!selectedStatus && !selectedPpv)) && (
          <section>
            <SectionHeader eyebrow="Premium fight nights" title="PPV & ticketed cards" description="Know exactly which events require a pass before you arrive at checkout." href="/events?ppv=1" actionLabel="View all PPV" />
            {selectedPpv === '1' ? (filteredEvents.length ? <div className="border border-white/10 bg-[#0B1626]">{filteredEvents.map((event) => <EventCard key={event.id} event={event} variant="row" />)}</div> : <EmptyEvents message="No PPV or ticketed events are published yet." />) : ppvOnly.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{ppvOnly.map((event) => <EventCard key={event.id} event={event} variant="compact" />)}</div> : <EmptyEvents message="Premium cards will appear here when access is configured." />}
          </section>
        )}

        {(selectedStatus === 'completed' || (!selectedStatus && !selectedPpv)) && (
          <section>
            <SectionHeader eyebrow="After the final bell" title="Replay archive" description="Return to the cards that already made their mark." href="/replays" actionLabel="Watch replays" />
            {selectedStatus === 'completed' ? (filteredEvents.length ? <div className="border border-white/10 bg-[#0B1626]">{filteredEvents.map((event) => <EventCard key={event.id} event={event} variant="row" />)}</div> : <EmptyEvents message="No completed events are available yet." />) : archive.length ? <div className="grid gap-3 md:grid-cols-2">{archive.slice(0, 6).map((event) => <EventCard key={event.id} event={event} variant="row" />)}</div> : <EmptyEvents message="Official replays will appear here after the next card." />}
          </section>
        )}

        {!featured && !filteredEvents.length ? <EmptyEvents message="The NaraTV event calendar is being prepared." /> : null}

        <section className="flex flex-col gap-4 border-l-4 border-[#45E3FF] bg-[#0B1626] p-5 md:flex-row md:items-center md:justify-between md:p-8">
          <div><p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#45E3FF]"><Trophy className="h-4 w-4" /> Stay close to fight night</p><h2 className="mt-2 text-2xl font-black uppercase text-white md:text-3xl">Choose your way into the action.</h2><p className="mt-2 max-w-2xl text-sm text-gray-400">Free broadcasts, subscription access, and event passes are labelled before you commit.</p></div>
          <Link href="/subscriptions" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-[#45E3FF]"><Ticket className="h-4 w-4" /> Explore passes</Link>
        </section>
      </div>
    </main>
  );
}

function EmptyEvents({ message }: { message: string }) {
  return <div className="border border-white/10 bg-[#0B1626] p-8 text-center"><Radio className="mx-auto mb-3 h-6 w-6 text-gray-600" /><p className="text-sm text-gray-400">{message}</p></div>;
}
