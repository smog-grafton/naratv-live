import Link from 'next/link';
import { Calendar, Home, Play } from 'lucide-react';
import { getEvents, getReplays } from '@/services/home';
import NaraImage from '@/components/media/NaraImage';

export default async function NotFound() {
  const [events, replays] = await Promise.all([
    getEvents({ status: 'upcoming', per_page: 3 }).catch(() => []),
    getReplays({ per_page: 3 }).catch(() => []),
  ]);
  const recommendations = [...events, ...replays].slice(0, 4);

  return (
    <main className="min-h-screen bg-[#050B12] px-4 py-28 text-white">
      <section className="mx-auto max-w-[1200px]">
        <div className="max-w-2xl">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#45E3FF]">404</p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">This page left the ring</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400 md:text-base">
            The link may have changed, but the fight-night library is still open. Jump back to NaraTV or pick a live card, event, or replay below.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-black uppercase tracking-wider text-black">
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link href="/schedule" className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-wider text-white">
              <Calendar className="h-4 w-4" /> Schedule
            </Link>
            <Link href="/replays" className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-wider text-white">
              <Play className="h-4 w-4 fill-current" /> Replays
            </Link>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {recommendations.map((item: any) => (
              <Link key={`${item.id}-${item.slug}`} href={item.poster_url ? `/events/${item.slug}` : `/watch/${item.slug}`} className="group overflow-hidden border border-white/10 bg-[#0B1626] transition-colors hover:border-[#45E3FF]/60">
                <div className="relative aspect-video bg-black">
                  <NaraImage src={item.poster_url || item.thumbnail_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-widest text-[#45E3FF]">{item.status || item.category || 'NaraTV'}</span>
                </div>
                <div className="p-4">
                  <h2 className="line-clamp-2 text-sm font-black uppercase leading-tight text-white">{item.title}</h2>
                  <p className="mt-2 line-clamp-1 text-xs text-gray-400">{item.venue || item.source_label || 'NaraTV'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
