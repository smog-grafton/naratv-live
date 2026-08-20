import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Info, Trophy } from 'lucide-react';
import { getRankings } from '@/services/home';
import RankingRow from '@/components/boxing/RankingRow';
import SectionHeader from '@/components/ui/SectionHeader';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Boxing Rankings by Division | NaraTV',
  description: 'Explore NaraTV editorial boxing rankings by weight division, record, country, and fighter profile.',
};

type Props = { searchParams: Promise<{ division?: string; organization?: string }> };

function dateLabel(value?: string | null) {
  return value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Current editorial list';
}

export default async function RankingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const division = params.division ? decodeURIComponent(params.division) : '';
  const organization = params.organization || 'naratv';
  const rankings = await getRankings({ organization, division: division || undefined, limit: 50 }).catch(() => ({ organization, label: 'Rankings unavailable', updated_at: null, divisions: [], entries: [] }));
  const topThree = rankings.entries.slice(0, 3);
  const remaining = rankings.entries.slice(3);
  const divisionOptions = rankings.divisions.length ? rankings.divisions : Array.from(new Set(rankings.entries.map((entry) => entry.fighter.weight_class).filter(Boolean))) as string[];

  return (
    <main className="min-h-screen bg-[#050b12] pb-24 pt-24 md:pt-28">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_80%_0%,rgba(69,227,255,0.12),transparent_35%),#07111f]">
        <div className="mx-auto max-w-[1920px] px-4 pb-8 pt-6 md:px-12 md:pb-12">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#45E3FF]"><Trophy className="h-4 w-4" /> The leaderboard</p>
              <h1 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight text-white md:text-7xl">Who is moving up?</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">A clear editorial view of the fighters NaraTV is watching. Rankings are separate from WBC, WBA, IBF, and WBO sanctioning-body lists.</p>
            </div>
            <Link href="/about" className="inline-flex min-h-11 items-center gap-2 self-start border border-white/20 px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:border-[#45E3FF] hover:text-[#45E3FF] lg:self-auto"><Info className="h-4 w-4" /> How rankings work</Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <span className="text-white">NaraTV Editorial</span><span className="text-white/20">·</span><span>Updated {dateLabel(rankings.updated_at)}</span><span className="text-white/20">·</span><span>{rankings.entries.length} fighters shown</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] space-y-12 px-4 pt-8 md:space-y-16 md:px-8 md:pt-12">
        <section>
          <div className="flex snap-x gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {[
              ['naratv', 'NaraTV'],
              ['wbc', 'WBC'],
              ['wba', 'WBA'],
              ['ibf', 'IBF'],
              ['wbo', 'WBO'],
              ['p4p', 'Pound for pound'],
            ].map(([value, label]) => value === 'naratv' ? (
              <Link key={value} href={'/rankings' + (division ? '?division=' + encodeURIComponent(division) : '')} className={'min-h-10 shrink-0 border px-4 py-2.5 text-[10px] font-black uppercase tracking-widest ' + (organization === value ? 'border-[#45E3FF] bg-[#45E3FF] text-black' : 'border-white/15 text-gray-300 hover:border-[#45E3FF]')}>{label}</Link>
            ) : (
              <span key={value} title="This source is not published in NaraTV yet" className="min-h-10 shrink-0 border border-white/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-600">{label} · soon</span>
            ))}
          </div>
        </section>

        {divisionOptions.length ? (
          <nav aria-label="Ranking divisions" className="sticky top-16 z-30 -mx-4 border-y border-white/10 bg-[#050b12]/95 px-4 py-3 backdrop-blur-md md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
            <div className="flex snap-x gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <Link href="/rankings" className={'min-h-10 shrink-0 snap-start border px-4 py-2.5 text-[10px] font-black uppercase tracking-widest ' + (!division ? 'border-[#45E3FF] bg-[#45E3FF] text-black' : 'border-white/15 text-gray-300 hover:border-[#45E3FF]')}>All divisions</Link>
              {divisionOptions.map((option) => <Link key={option} href={'/rankings?division=' + encodeURIComponent(option)} className={'min-h-10 shrink-0 snap-start border px-4 py-2.5 text-[10px] font-black uppercase tracking-widest ' + (division === option ? 'border-[#45E3FF] bg-[#45E3FF] text-black' : 'border-white/15 text-gray-300 hover:border-[#45E3FF]')}>{option}</Link>)}
            </div>
          </nav>
        ) : null}

        {topThree.length ? (
          <section>
            <SectionHeader eyebrow={division || 'The top three'} title="Front of the pack" description="A little more visual weight for the names setting the pace." href="/boxers" actionLabel="Explore fighters" />
            <div className="overflow-hidden border border-white/10 bg-[#0B1626]">{topThree.map((entry) => <RankingRow key={entry.fighter.id} entry={entry} featured />)}</div>
          </section>
        ) : null}

        <section>
          <SectionHeader eyebrow="The full list" title={division || 'NaraTV rankings'} description="Compact by design, readable on a phone, and ready to scale as more divisions and fighters are added." />
          {remaining.length ? (
            <div className="overflow-hidden border border-white/10 bg-[#0B1626]">
              <div className="hidden grid-cols-[64px_64px_minmax(0,1fr)_140px_90px] items-center gap-4 border-b border-white/10 px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 md:grid"><span>Rank</span><span>Photo</span><span>Fighter</span><span>Record</span><span className="text-right">Profile</span></div>
              {remaining.map((entry) => <RankingRow key={entry.fighter.id} entry={entry} />)}
            </div>
          ) : !topThree.length ? <div className="border border-white/10 bg-[#0B1626] p-10 text-center text-gray-400">No published rankings are available for this view yet.</div> : <p className="text-sm text-gray-500">The full list will expand as more ranked fighters are published.</p>}
        </section>

        <section className="flex flex-col gap-4 border-l-4 border-[#45E3FF] bg-[#0B1626] p-5 md:flex-row md:items-center md:justify-between md:p-8">
          <div><p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45E3FF]">Know the names</p><h2 className="mt-2 text-2xl font-black uppercase text-white md:text-3xl">Read the fighter stories behind the numbers.</h2></div>
          <Link href="/news" className="inline-flex min-h-11 items-center gap-2 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-[#45E3FF]">Read NaraTV news <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </div>
    </main>
  );
}
