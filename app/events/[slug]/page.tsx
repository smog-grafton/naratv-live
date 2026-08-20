import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Calendar, Lock, MapPin, Play, Ticket, Trophy, Users } from 'lucide-react';
import ContentRail from '@/components/blocks/ContentRail';
import ScrollFadeOverlay from '@/components/blocks/ScrollFadeOverlay';
import { getEvent } from '@/services/home';
import NaraImage from '@/components/media/NaraImage';
import { shareMetadata } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug).catch(() => null);

  if (!event) {
    return { title: 'Event | Nara TV' };
  }

  const title = event.seo?.title || `${event.title} | Live Boxing on NaraTV`;
  const description = event.seo?.description || event.description || `${event.title} fight card, stream access, tickets and replays on NaraTV.`;
  return shareMetadata({ title, description, path: event.seo?.canonical || `/events/${event.slug}`, image: event.seo?.og_image || event.featured_image_url || event.banner_url || event.poster_url });
}

function formatDate(value?: string | null) {
  if (!value) return 'Date TBA';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug).catch(() => null);

  if (!event) notFound();

  const fighters = event.fighters || [event.fighter_a, event.fighter_b].filter(Boolean);
  const fightCard = (event.fight_card || []).slice().sort((a, b) => (a.bout_order || 0) - (b.bout_order || 0));
  const mainBout = event.main_bout || fightCard.find((bout) => bout.is_main_event) || fightCard[0];
  const eventCoverage = event.videos?.length
    ? [{
        id: `event-${event.id}-coverage`,
        title: 'Event Coverage',
        titlePrefix: event.source_label,
        type: 'videos' as const,
        layout: 'video' as const,
        items: event.videos,
      }]
    : [];
  const price = event.price && event.price > 0 ? `${event.currency || 'UGX'} ${Number(event.price).toLocaleString()}` : 'Free';
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: event.title,
    description: event.description || `${event.title} on NaraTV`,
    startDate: event.start_time || undefined,
    eventStatus: event.status === 'completed' ? 'https://schema.org/EventCompleted' : event.is_live ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: event.venue || event.country || 'NaraTV' },
    organizer: { '@type': 'Organization', name: event.source_label || 'NaraTV' },
    url: `/events/${event.slug}`,
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#050b12]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      <div className="relative w-full h-[68vh] md:h-[78vh] flex flex-col justify-end bg-black">
        <div className="absolute inset-0 z-0">
          <NaraImage src={event.banner_url || event.poster_url} alt={event.title} className="w-full h-full object-cover object-top opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b12] via-[#050b12]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-nara-black/90 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-12 pb-16 pt-32 md:pt-44 flex flex-col md:flex-row gap-12 md:items-end justify-between">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 mt-20 md:mt-0">
            <div className="bg-[#45E3FF] text-black font-black uppercase text-xs md:text-sm tracking-widest px-3 py-1 mb-4 rounded-sm inline-block">
              {event.is_live ? 'Live Now' : event.status}
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Presented by {event.source_label || 'Nara Promotionz'}</p>

            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
              {event.title}
            </h1>
            {fighters.length >= 2 && (
              <h2 className="text-xl md:text-3xl font-black text-nara-red uppercase mb-6 tracking-tight">
                {fighters[0]?.name} vs {fighters[1]?.name}
              </h2>
            )}

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-300 font-bold tracking-wide mb-8 text-sm md:text-base">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatDate(event.start_time)}</span>
              <span className="hidden md:inline text-white/20">|</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {[event.venue, event.city, event.country].filter(Boolean).join(', ') || 'Venue TBA'}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href={`/watch/${event.slug}`} className="bg-[#45E3FF] text-black font-bold uppercase tracking-wider py-4 px-10 rounded-sm text-sm hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#45E3FF]/20">
                <Play className="w-4 h-4 fill-black text-black" /> {event.is_live ? 'Watch Live' : event.status === 'completed' ? 'Watch Replay' : event.is_free ? 'Event Details' : 'Buy Event Pass'}
              </Link>
              <Link href={`/checkout?event=${event.slug}`} className="bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold uppercase tracking-wider py-4 px-10 rounded-sm text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <Ticket className="w-4 h-4" /> {price}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ScrollFadeOverlay />

      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 relative z-20 pb-24 mt-8 flex flex-col min-h-[40vh] gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Official Fight Card</h2>
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{fightCard.length || fighters.length} bouts</span>
            </div>

            <div className="space-y-4">
              {fightCard.length > 0 ? fightCard.map((bout, index) => {
                const red = bout.red_corner;
                const blue = bout.blue_corner;
                const winner = bout.winner?.id ? String(bout.winner.id) : null;
                const label = bout.is_main_event || index === 0 ? 'Main Event' : index === 1 ? 'Co-Main Event' : `Bout ${bout.bout_order || index + 1}`;

                return (
                  <div
                    key={bout.id}
                    className={`border rounded-md p-4 md:p-6 transition-colors ${bout.is_main_event || index === 0 ? 'bg-[#151a20] border-[#45E3FF]/40' : 'bg-[#0B1626] border-nara-border'}`}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#45E3FF] font-bold">{label}</p>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {bout.title_fight ? <Trophy className="h-3.5 w-3.5 text-[#45E3FF]" /> : null}
                        {bout.belt_title || bout.weight_class || bout.status}
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6">
                      <Link href={`/boxers/${red?.slug || ''}`} className="min-w-0 text-left">
                        <h3 className={`truncate text-lg md:text-2xl font-black uppercase tracking-tight ${winner && winner === String(red?.id) ? 'text-[#45E3FF]' : 'text-white'}`}>{red?.name || 'Red Corner'}</h3>
                        <p className="mt-1 truncate text-xs md:text-sm text-gray-400">{red?.record?.display || red?.weight_class || red?.country || 'Fighter profile'}</p>
                      </Link>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black text-[11px] font-black uppercase text-gray-300">VS</div>
                      <Link href={`/boxers/${blue?.slug || ''}`} className="min-w-0 text-right">
                        <h3 className={`truncate text-lg md:text-2xl font-black uppercase tracking-tight ${winner && winner === String(blue?.id) ? 'text-[#45E3FF]' : 'text-white'}`}>{blue?.name || 'Blue Corner'}</h3>
                        <p className="mt-1 truncate text-xs md:text-sm text-gray-400">{blue?.record?.display || blue?.weight_class || blue?.country || 'Fighter profile'}</p>
                      </Link>
                    </div>
                    {(bout.rounds || bout.result?.method || bout.result?.details) && (
                      <div className="mt-5 border-t border-white/10 pt-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                        {bout.result?.result && bout.result.result !== 'scheduled' ? `${bout.result.result}${bout.result.method ? ` by ${bout.result.method}` : ''}` : `${bout.rounds || 12} scheduled rounds`}
                      </div>
                    )}
                  </div>
                );
              }) : fighters.length > 0 ? fighters.map((fighter, index) => (
                <Link
                  key={fighter?.id || index}
                  href={`/boxers/${fighter?.slug || ''}`}
                  className="bg-[#0B1626] border border-nara-border rounded-md p-4 md:p-6 flex items-center justify-between gap-4 hover:border-white/20 transition-colors"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">{index === 0 ? 'Main Event' : 'Featured Boxer'}</p>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1">{fighter?.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{fighter?.weight_class || fighter?.country || 'Boxer profile'}</p>
                  </div>
                  <Users className="w-5 h-5 text-gray-500" />
                </Link>
              )) : (
                <div className="bg-[#0B1626] border border-nara-border rounded-md p-6 text-gray-400">
                  The fight card will be announced soon.
                </div>
              )}
            </div>

            {mainBout?.red_corner && mainBout?.blue_corner && (
              <div className="mt-10 border border-white/10 bg-[#0a0f16] p-6 rounded-md">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-5">Tale of the Tape</h3>
                {[
                  ['Record', mainBout.red_corner.record?.display || '-', mainBout.blue_corner.record?.display || '-'],
                  ['Weight Class', mainBout.red_corner.weight_class || mainBout.weight_class || '-', mainBout.blue_corner.weight_class || mainBout.weight_class || '-'],
                  ['Stance', mainBout.red_corner.stance || '-', mainBout.blue_corner.stance || '-'],
                  ['Height', mainBout.red_corner.height || '-', mainBout.blue_corner.height || '-'],
                  ['Reach', mainBout.red_corner.reach || '-', mainBout.blue_corner.reach || '-'],
                ].map(([label, redValue, blueValue]) => (
                  <div key={label} className="grid grid-cols-[1fr_auto_1fr] gap-4 border-t border-white/5 py-3 text-sm">
                    <span className="text-white font-bold">{redValue}</span>
                    <span className="text-gray-500 uppercase tracking-widest text-[10px] font-black">{label}</span>
                    <span className="text-right text-white font-bold">{blueValue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-[#0a0f16] border border-nara-border p-6 rounded-md">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Watch Access</h3>
              <div className="p-4 border border-[#45E3FF]/50 bg-[#45E3FF]/5 rounded-sm">
                <div className="font-bold text-white">{event.access_type === 'free' ? 'Free Stream' : 'Event Pass'}</div>
                <div className="text-sm text-gray-400 mt-1 leading-relaxed">
                  {event.description || 'Watch this event on NaraTV with an eligible ticket, PPV unlock, or active pass.'}
                </div>
                <div className="text-lg font-black text-[#45E3FF] mt-3">{price}</div>
              </div>
              <Link href={`/checkout?event=${event.slug}`} className="w-full mt-6 bg-white text-black hover:bg-gray-200 py-4 font-black uppercase tracking-widest text-sm rounded-sm transition-colors flex justify-center">
                Checkout
              </Link>
              {(event.is_ppv || event.access_type === 'ticket_holder') && (
                <p className="text-xs text-gray-500 mt-3 flex gap-2"><Lock className="w-3 h-3 mt-0.5" /> Paid access unlocks the stream and eligible replays.</p>
              )}
            </div>
          </aside>
        </div>

        <div className="w-full mt-12 space-y-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter border-b border-white/10 pb-4">Event Coverage</h2>
          {eventCoverage.map((rail, index) => (
            <ContentRail key={rail.id} rail={rail} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
