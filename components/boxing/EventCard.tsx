import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin, Play, Ticket } from 'lucide-react';
import type { Event, Fighter } from '@/services/types';
import NaraImage from '@/components/media/NaraImage';

type Variant = 'featured' | 'row' | 'compact';

function fightersFor(event: Event): Fighter[] {
  return (event.fighters || [event.fighter_a, event.fighter_b]).filter(Boolean) as Fighter[];
}

function eventDate(event: Event) {
  if (!event.start_time) return 'Date TBA';
  return new Date(event.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function eventTime(event: Event) {
  if (!event.start_time) return '';
  return new Date(event.start_time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function statusFor(event: Event) {
  if (event.is_live || event.status === 'live') return { label: 'Live now', className: 'bg-[#ff284d] text-white' };
  if (event.status === 'completed') return { label: event.streaming?.replay_available || event.replay_url ? 'Replay available' : 'Result', className: 'bg-white/15 text-white' };
  if (event.is_ppv) return { label: 'PPV', className: 'bg-[#45E3FF] text-black' };
  if (event.is_free) return { label: 'Free to watch', className: 'bg-white text-black' };
  return { label: 'Upcoming', className: 'bg-white/15 text-white' };
}

export default function EventCard({ event, variant = 'row' }: { event: Event; variant?: Variant }) {
  const fighters = fightersFor(event);
  const status = statusFor(event);
  const names = fighters.length >= 2 ? fighters[0].name + ' vs ' + fighters[1].name : event.title;
  const dateTime = eventDate(event) + (eventTime(event) ? ' · ' + eventTime(event) : '');
  const action = event.status === 'completed' ? 'Watch replay' : event.is_live ? 'Watch live' : event.is_ppv ? 'Buy access' : 'View event';
  const statusClass = 'px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] ' + status.className;

  if (variant === 'compact') {
    return (
      <Link href={'/events/' + event.slug} className="group flex min-w-[275px] items-center gap-3 border border-white/10 bg-[#0B1626] p-3 transition-colors hover:border-[#45E3FF]/60">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-black"><NaraImage src={event.thumbnail_url || event.poster_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        <div className="min-w-0"><span className={statusClass}>{status.label}</span><h3 className="mt-1 truncate text-sm font-black uppercase text-white">{names}</h3><p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wider text-gray-500">{dateTime}</p></div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="relative overflow-hidden border border-white/15 bg-[#0B1626]">
        <div className="absolute inset-0"><NaraImage src={event.banner_url || event.poster_url} alt={event.title} className="h-full w-full object-cover opacity-40" /><div className="absolute inset-0 bg-gradient-to-r from-[#050b12] via-[#050b12]/75 to-[#050b12]/20" /><div className="absolute inset-0 bg-gradient-to-t from-[#050b12] via-transparent to-transparent" /></div>
        <div className="relative grid min-h-[410px] items-end gap-8 p-5 md:min-h-[470px] md:grid-cols-[1fr_auto] md:p-10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2"><span className={statusClass}>{status.label}</span><span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{event.source_label || 'NaraTV fight night'}</span></div>
            <p className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-300"><CalendarDays className="h-4 w-4 text-[#45E3FF]" /> {dateTime}<span className="text-white/20">|</span><MapPin className="h-4 w-4 text-[#45E3FF]" /> {event.venue || event.country || 'Venue TBA'}</p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-7xl">{names}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 md:text-base">{event.description || event.tagline || 'Follow the fight night, access the card, and stay close to every bell.'}</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link href={'/events/' + event.slug} className="inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-[#45E3FF]">{action} <ArrowUpRight className="h-4 w-4" /></Link>{event.is_ppv ? <Link href={'/checkout?event=' + event.slug} className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white/20"><Ticket className="h-4 w-4" /> {event.price ? (event.currency || 'UGX') + ' ' + Number(event.price).toLocaleString() : 'Get pass'}</Link> : null}</div>
          </div>
          {fighters.length >= 2 ? <div className="hidden min-w-[220px] text-right md:block"><p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45E3FF]">Main event</p><p className="mt-2 text-2xl font-black uppercase text-white">{fighters[0].name}</p><p className="my-1 text-sm font-black text-[#45E3FF]">VS</p><p className="text-2xl font-black uppercase text-white">{fighters[1].name}</p></div> : null}
        </div>
      </article>
    );
  }

  return (
    <Link href={'/events/' + event.slug} className="group flex items-center gap-4 border-b border-white/10 bg-[#0B1626]/70 p-4 transition-colors hover:border-[#45E3FF]/50 hover:bg-[#101e31] md:p-5">
      <div className="hidden h-16 w-24 shrink-0 overflow-hidden bg-black sm:block"><NaraImage src={event.thumbnail_url || event.poster_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
      <div className="flex min-w-0 flex-1 items-start gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={statusClass}>{status.label}</span><span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{event.source_label || 'NaraTV'}</span></div><h3 className="mt-1 truncate text-base font-black uppercase text-white md:text-lg">{names}</h3><p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500"><CalendarDays className="h-3.5 w-3.5" /> {dateTime} <span className="hidden text-white/20 sm:inline">|</span> <span>{event.venue || event.country || 'Venue TBA'}</span></p></div></div>
      <div className="hidden shrink-0 items-center gap-2 text-xs font-black uppercase tracking-widest text-[#45E3FF] md:flex">{event.status === 'live' ? <Play className="h-4 w-4 fill-current" /> : null}{action}<ArrowUpRight className="h-4 w-4" /></div>
    </Link>
  );
}
