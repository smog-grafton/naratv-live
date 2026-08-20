import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Search, Trophy, Users } from 'lucide-react';
import { getFighters } from '@/services/home';
import FighterCard from '@/components/boxing/FighterCard';
import SectionHeader from '@/components/ui/SectionHeader';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Fighter Profiles & Boxing Roster | NaraTV',
  description: 'Explore NaraTV fighter profiles, records, divisions, rankings, and the athletes coming through the African boxing scene.',
};

type Props = { searchParams: Promise<{ division?: string }> };

export default async function BoxersPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedDivision = params.division ? decodeURIComponent(params.division) : '';
  const [fighters, featured, ranked] = await Promise.all([
    getFighters({ per_page: 50, division: selectedDivision || undefined }).catch(() => []),
    getFighters({ per_page: 8, featured: 1 }).catch(() => []),
    getFighters({ per_page: 8, ranked: 1 }).catch(() => []),
  ]);

  const divisions = Array.from(new Set(fighters.map((fighter) => fighter.weight_class).filter(Boolean))) as string[];
  const spotlight = featured[0] || fighters[0];
  const featuredIds = new Set(featured.map((fighter) => fighter.id));
  const regional = fighters.filter((fighter) => /uganda|kenya|tanzania|ghana|nigeria|south africa/i.test(fighter.country || '')).slice(0, 6);
  const discovery = fighters.filter((fighter) => !featuredIds.has(fighter.id)).slice(0, 8);

  return (
    <main className="min-h-screen bg-[#050b12] pb-24 pt-24 md:pt-28">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_15%_0%,rgba(111,136,252,0.16),transparent_35%),#07111f]">
        <div className="mx-auto max-w-[1920px] px-4 pb-8 pt-6 md:px-12 md:pb-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#45E3FF]"><Users className="h-4 w-4" /> The NaraTV roster</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-black uppercase leading-none tracking-tight text-white md:text-7xl">Meet the fighters.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">Records, rivalries, rankings, and the next generation of boxers shaping fight night.</p>
            </div>
            <Link href="/search" className="inline-flex min-h-11 items-center gap-2 self-start border border-white/20 px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:border-[#45E3FF] hover:text-[#45E3FF] lg:self-auto"><Search className="h-4 w-4" /> Search fighters</Link>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3 border-t border-white/10 pt-5">
            <div><span className="block text-2xl font-black text-white md:text-3xl">{fighters.length}</span><span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Profiles shown</span></div>
            <div><span className="block text-2xl font-black text-[#45E3FF] md:text-3xl">{divisions.length}</span><span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Divisions</span></div>
            <div><span className="block text-2xl font-black text-white md:text-3xl">{ranked.length}</span><span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Ranked</span></div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1920px] space-y-14 px-4 pt-8 md:space-y-20 md:px-12 md:pt-12">
        <nav aria-label="Weight divisions" className="sticky top-16 z-30 -mx-4 border-y border-white/10 bg-[#050b12]/95 px-4 py-3 backdrop-blur-md md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
          <div className="flex snap-x gap-2 overflow-x-auto pb-1 hide-scrollbar">
            <Link href="/boxers" className={'min-h-10 shrink-0 snap-start border px-4 py-2.5 text-[10px] font-black uppercase tracking-widest ' + (!selectedDivision ? 'border-[#45E3FF] bg-[#45E3FF] text-black' : 'border-white/15 text-gray-300 hover:border-[#45E3FF]')}>All fighters</Link>
            {divisions.map((division) => <Link key={division} href={'/boxers?division=' + encodeURIComponent(division)} className={'min-h-10 shrink-0 snap-start border px-4 py-2.5 text-[10px] font-black uppercase tracking-widest ' + (selectedDivision === division ? 'border-[#45E3FF] bg-[#45E3FF] text-black' : 'border-white/15 text-gray-300 hover:border-[#45E3FF]')}>{division}</Link>)}
          </div>
        </nav>

        {spotlight ? (
          <section>
            <SectionHeader eyebrow="Fighter spotlight" title="One to watch" href="/rankings" actionLabel="View rankings" />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.8fr)]">
              <FighterCard fighter={spotlight} variant="spotlight" />
              <div className="grid grid-cols-2 gap-4">{featured.slice(1, 5).map((fighter) => <FighterCard key={fighter.id} fighter={fighter} variant="portrait" />)}</div>
            </div>
          </section>
        ) : null}

        {ranked.length ? (
          <section>
            <SectionHeader eyebrow="The leaderboard" title="Top ranked" description="NaraTV’s editorial ranking is shown separately from external sanctioning-body lists." href="/rankings" actionLabel="Full rankings" />
            <div className="flex snap-x gap-3 overflow-x-auto pb-2 hide-scrollbar">{ranked.slice(0, 6).map((fighter) => <FighterCard key={fighter.id} fighter={fighter} variant="compact" />)}</div>
          </section>
        ) : null}

        {regional.length ? (
          <section>
            <SectionHeader eyebrow="Closer to home" title="African fighters to watch" description="Discover the athletes carrying local gyms and national fight scenes into the wider conversation." href="/boxers" actionLabel="View roster" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{regional.map((fighter) => <FighterCard key={fighter.id} fighter={fighter} variant="portrait" />)}</div>
          </section>
        ) : null}

        <section id="fighter-roster">
          <SectionHeader eyebrow={selectedDivision || 'Full roster'} title={selectedDivision ? selectedDivision + ' fighters' : 'Explore the roster'} description="Compare records, divisions, and ranking context at a glance." />
          {fighters.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">{fighters.map((fighter) => <FighterCard key={fighter.id} fighter={fighter} variant="portrait" />)}</div> : <div className="border border-white/10 bg-[#0B1626] p-10 text-center text-gray-400">No fighters are published in this division yet.</div>}
        </section>

        {discovery.length ? (
          <section>
            <SectionHeader eyebrow="Keep exploring" title="More from the roster" href="#fighter-roster" actionLabel="View all fighters" />
            <div className="flex snap-x gap-3 overflow-x-auto pb-2 hide-scrollbar">{discovery.map((fighter) => <FighterCard key={fighter.id} fighter={fighter} variant="compact" />)}</div>
          </section>
        ) : null}

        <section className="flex flex-col gap-4 border-l-4 border-[#6F88FC] bg-[#0B1626] p-5 md:flex-row md:items-center md:justify-between md:p-8">
          <div><p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#6F88FC]"><Trophy className="h-4 w-4" /> Beyond the card</p><h2 className="mt-2 text-2xl font-black uppercase text-white md:text-3xl">Every fighter has a next chapter.</h2></div>
          <Link href="/events" className="inline-flex min-h-11 items-center gap-2 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-[#45E3FF]">See upcoming fights <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </div>
    </main>
  );
}
