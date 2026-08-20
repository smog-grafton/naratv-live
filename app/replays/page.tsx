import Link from 'next/link';
import { Clock, Filter, Lock, Play, Search, Trophy } from 'lucide-react';
import ContentRail from '@/components/blocks/ContentRail';
import ScrollFadeOverlay from '@/components/blocks/ScrollFadeOverlay';
import { getHomeRails, getReplays } from '@/services/home';
import NaraImage from '@/components/media/NaraImage';

export const revalidate = 60;

export default async function ReplaysPage() {
  const [replays, rails] = await Promise.all([
    getReplays({ per_page: 24 }),
    getHomeRails(),
  ]);
  const featured = replays[0];
  const supportingRails = rails.filter((rail) => /highlight|interview|archive|replay/i.test(`${rail.id} ${rail.title}`)).slice(0, 3);

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-nara-black">
      <div className="sticky top-0 left-0 w-full z-0 h-[92vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <NaraImage
            src={featured?.thumbnail_url || '/assets/images/banner/videos_banner.jpg'}
            className="w-full h-full object-cover object-top"
            alt={featured?.title || 'Nara TV replays'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nara-black via-nara-black/75 to-nara-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-nara-black/85 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-12 flex flex-col justify-end h-full pt-[120px] pb-[9vh]">
          <div className="w-full xl:w-2/3 animate-in slide-in-from-bottom-5 duration-700 fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 uppercase leading-[0.9]">
              Watch the fights<br />you missed
            </h1>
            <p className="text-gray-300 text-sm md:text-lg mb-6 md:mb-8 max-w-2xl font-medium">
              Full event replays, highlights, interviews, weigh-ins, and post-fight coverage from NaraTV fight nights.
            </p>

            {featured && (
              <Link
                href={`/watch/${featured.slug}`}
                className="bg-[#0B1626]/90 backdrop-blur-md border border-nara-border/50 rounded-[2px] w-full max-w-3xl mb-6 md:mb-8 flex flex-row items-stretch hover:bg-nara-black transition-colors min-h-[120px] md:min-h-[160px]"
              >
                <div className="w-[120px] md:w-[240px] relative flex-shrink-0 border-r border-[#172338]">
                  <NaraImage src={featured.thumbnail_url} className="w-full h-full object-cover" alt={featured.title} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 border border-white rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white translate-x-[2px]" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 md:p-6 flex flex-col justify-center">
                  <div className="inline-flex items-center text-[#6F88FC] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2 gap-1">
                    <Trophy className="w-3 h-3" /> Latest Replay
                  </div>
                  <h2 className="text-base md:text-2xl font-black text-white mb-2 uppercase tracking-tight leading-tight">{featured.title}</h2>
                  <p className="hidden md:block text-sm text-gray-400 leading-normal line-clamp-2">{featured.description || featured.source_label || 'Replay available on NaraTV.'}</p>
                  {featured.is_premium && (
                    <span className="mt-3 inline-flex w-fit items-center gap-1 bg-[#6F88FC] text-black text-[10px] font-black uppercase tracking-widest px-2 py-1">
                      <Lock className="w-3 h-3" /> Premium
                    </span>
                  )}
                </div>
              </Link>
            )}

            <div className="flex flex-row md:flex-wrap gap-3 md:gap-4 w-full sm:w-auto">
              <Link href="#latest-replays" className="flex-1 sm:flex-none text-center bg-white text-nara-black hover:bg-gray-200 font-bold px-4 md:px-8 py-3.5 text-xs md:text-sm uppercase tracking-wider rounded-[2px] transition-colors">
                Browse Latest
              </Link>
              <Link href="/subscriptions" className="flex-1 sm:flex-none justify-center flex items-center bg-[#172338]/80 backdrop-blur-sm text-white hover:bg-[#22314B] font-bold px-4 md:px-8 py-3.5 text-xs md:text-sm uppercase tracking-wider rounded-[2px] transition-colors border border-nara-border">
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ScrollFadeOverlay />

      <div id="latest-replays" className="relative z-20 bg-[linear-gradient(to_bottom,transparent,rgba(10,10,12,0.9)_5vh,#050B12_12vh)] w-full min-h-screen pb-24 mt-[-8vh]">
        <div className="sticky top-[56px] md:top-16 z-30 bg-nara-black/95 backdrop-blur-md border-b border-nara-border w-full">
          <div className="max-w-[1920px] mx-auto px-4 md:px-12 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="hide-scrollbar overflow-x-auto whitespace-nowrap flex items-center gap-6 md:gap-8">
              {['Full Events', 'Highlights', 'Interviews', 'Weigh-ins', 'Press Conferences'].map((cat, index) => (
                <span key={cat} className={`text-xs md:text-sm font-bold uppercase tracking-wider min-w-max ${index === 0 ? 'text-white border-b-2 border-nara-red pb-1' : 'text-gray-500'}`}>
                  {cat}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Filter className="w-4 h-4" />
              <Search className="w-4 h-4" />
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="pt-8 md:pt-12 space-y-12">
          <section className="max-w-[1920px] mx-auto px-4 md:px-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#45E3FF]">Archive</p>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-tighter text-white md:text-3xl">Full Event Replays</h2>
              </div>
              <span className="hidden text-xs font-bold uppercase tracking-widest text-gray-500 sm:block">{replays.length} available</span>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {replays.map((replay) => (
                <Link
                  key={replay.id}
                  href={`/watch/${replay.slug}`}
                  className="group grid min-h-[150px] grid-cols-[132px_1fr] overflow-hidden rounded-sm border border-white/10 bg-[#0B1626] transition-colors hover:border-[#45E3FF]/60 sm:grid-cols-[220px_1fr]"
                >
                  <div className="relative min-h-[150px] bg-black">
                    <NaraImage src={replay.thumbnail_url} alt={replay.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B1626]/30" />
                    <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black sm:h-11 sm:w-11">
                      <Play className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="bg-[#45E3FF] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-black">{replay.category || 'Replay'}</span>
                        {replay.is_premium ? <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400"><Lock className="h-3 w-3" /> Premium</span> : null}
                      </div>
                      <h3 className="line-clamp-2 text-sm font-black uppercase leading-tight tracking-tight text-white sm:text-lg">{replay.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-400 sm:text-sm">{replay.description || replay.source_label || 'Replay available on NaraTV.'}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="truncate text-[10px] font-bold uppercase tracking-widest text-gray-500">{replay.source_label || 'NaraTV'}</span>
                      <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-[#45E3FF]">Watch</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {supportingRails.map((rail, index) => (
            <ContentRail key={rail.id} rail={rail} index={index + 1} />
          ))}

          {replays.length === 0 && (
            <div className="max-w-4xl mx-auto px-4 text-center border border-white/10 bg-[#0B1626] p-10">
              <h2 className="text-white text-xl font-black uppercase">No replays yet</h2>
              <p className="text-gray-400 mt-2">Completed events and replay videos will appear here as soon as they are ready.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
