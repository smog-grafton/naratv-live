import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Calendar, Trophy } from 'lucide-react';
import ContentRail from '@/components/blocks/ContentRail';
import ScrollFadeOverlay from '@/components/blocks/ScrollFadeOverlay';
import { getFighter } from '@/services/home';
import NaraImage from '@/components/media/NaraImage';
import { shareMetadata } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fighter = await getFighter(slug).catch(() => null);

  if (!fighter) {
    return { title: 'Fighter Profile | Nara TV' };
  }

  const record = fighter.record;
  const recordLabel = record?.display || `${record?.wins ?? fighter.record_wins ?? 0}-${record?.losses ?? fighter.record_losses ?? 0}-${record?.draws ?? fighter.record_draws ?? 0}`;
  const title = fighter.seo?.title || `${fighter.name} — ${recordLabel} Boxer Profile | NaraTV`;
  const description = fighter.seo?.description || `${fighter.name}${fighter.ring_name ? ` (${fighter.ring_name})` : ''} boxing profile, ${fighter.weight_class || 'division'} record, ranking and fight history on NaraTV.`;
  return shareMetadata({ title, description, path: fighter.seo?.canonical || `/boxers/${fighter.slug}`, image: fighter.seo?.og_image || fighter.backdrop_url || fighter.portrait_url || fighter.image_url, type: 'profile' });
}

export default async function BoxerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fighter = await getFighter(slug).catch(() => null);

  if (!fighter) notFound();

  const record = fighter.record || {
    wins: fighter.record_wins || 0,
    losses: fighter.record_losses || 0,
    draws: fighter.record_draws || 0,
    knockouts: fighter.knockouts || 0,
    display: `${fighter.record_wins || 0}-${fighter.record_losses || 0}-${fighter.record_draws || 0}`,
  };
  const videoRail = fighter.videos?.length
    ? [{
        id: `fighter-${fighter.id}-videos`,
        title: `${fighter.name} on NaraTV`,
        titlePrefix: 'Featured',
        type: 'videos' as const,
        layout: 'video' as const,
        items: fighter.videos,
      }]
    : [];
  const backdrop = fighter.backdrop_url || '/assets/images/banner/event_banner.jpg';
  const portrait = fighter.portrait_url || fighter.image_url || '/assets/images/boxers/boxer-1.jpg';

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-nara-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: fighter.name, alternateName: fighter.ring_name || undefined, image: fighter.portrait_url || fighter.image_url || undefined, url: `/boxers/${fighter.slug}`, description: fighter.bio || undefined }) }} />
      <div className="relative w-full min-h-[78vh] md:min-h-[84vh] flex flex-col justify-end bg-[#080b10] overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <NaraImage src={backdrop} className="w-full h-full object-cover opacity-45" alt={`${fighter.name} background`} />
          <div className="absolute inset-0 bg-gradient-to-r from-nara-black via-nara-black/78 to-nara-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-nara-black via-nara-black/45 to-transparent" />
        </div>

        <div className="absolute bottom-0 right-[-14%] sm:right-[-6%] md:right-4 xl:right-20 w-[86vw] max-w-[520px] md:max-w-[680px] h-[82%] flex items-end justify-end opacity-95 z-10 pointer-events-none">
          <NaraImage
            src={portrait}
            alt={fighter.name}
            className="max-h-full w-auto object-contain drop-shadow-[0_28px_80px_rgba(0,0,0,0.75)]"
            fallbackClassName="h-full w-full object-contain drop-shadow-[0_28px_80px_rgba(0,0,0,0.75)]"
            style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 18%)' }}
          />
        </div>

        <div className="relative z-20 w-full max-w-[1920px] mx-auto px-4 md:px-12 pb-10 md:pb-14 border-b border-white/5">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block bg-[#6F88FC] text-black font-black uppercase text-xs md:text-sm tracking-widest px-3 py-1 mb-4 rounded-sm">
              {fighter.weight_class || 'Boxer Profile'}
            </div>
            <h1 className="max-w-[11ch] text-5xl md:text-7xl xl:text-8xl font-black text-white uppercase tracking-tight mb-7 leading-[0.9]">
              {fighter.name}
            </h1>

            <div className="grid grid-cols-4 max-w-xl gap-3 md:gap-5 mb-8">
              {[
                ['Wins', record.wins, 'text-green-500'],
                ['KOs', record.knockouts, 'text-[#6F88FC]'],
                ['Draws', record.draws, 'text-blue-500'],
                ['Losses', record.losses, 'text-nara-red'],
              ].map(([label, value, color]) => (
                <div key={label} className="min-w-0">
                  <div className={`text-3xl md:text-4xl font-black ${color}`}>{value}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 font-bold border-t border-white/10 pt-1 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6 md:gap-12 text-sm md:text-base border-t border-white/10 pt-6 max-w-3xl">
              {[
                ['Stance', fighter.stance],
                ['Age', fighter.age],
                ['Height', fighter.height],
                ['Reach', fighter.reach],
                ['Country', fighter.country || fighter.nationality],
              ].filter(([, value]) => value).map(([label, value]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-gray-500 uppercase tracking-widest font-bold text-xs mb-1">{label}</span>
                  <span className="text-white font-bold tracking-wide">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link href="/rankings" className="bg-white text-black font-black uppercase tracking-widest px-8 py-3 rounded-sm text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Trophy className="w-4 h-4" /> View Rankings
              </Link>
              <Link href="/schedule" className="bg-[#172338]/80 backdrop-blur-md text-white border border-[#22314B] font-bold uppercase tracking-wider py-3 px-8 rounded-sm text-sm hover:bg-[#22314B] transition-colors flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ScrollFadeOverlay />

      <div className="w-full relative z-20 pb-24 mt-8 space-y-8">
        {fighter.bio && (
          <section className="max-w-[1100px] mx-auto px-4 md:px-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Profile</h2>
            <p className="text-gray-300 leading-7">{fighter.bio}</p>
          </section>
        )}

        {fighter.related_events && fighter.related_events.length > 0 && (
          <section className="max-w-[1100px] mx-auto px-4 md:px-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Event History</h2>
            <div className="grid gap-3">
              {fighter.related_events.map((event: any) => (
                <Link key={event.id} href={`/events/${event.slug}`} className="border border-white/10 bg-[#0B1626] p-4 hover:border-[#45E3FF]/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h3 className="text-white font-black uppercase">{event.name || event.title}</h3>
                      <p className="text-gray-400 text-sm">{[event.venue, event.city].filter(Boolean).join(', ') || event.status}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-bold uppercase">{event.event_date || event.start_time || 'Date TBA'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {videoRail.map((rail, index) => (
          <ContentRail key={rail.id} rail={rail} index={index} />
        ))}
      </div>
    </div>
  );
}
