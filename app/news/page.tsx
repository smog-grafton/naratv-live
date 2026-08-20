import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Flame, Newspaper, Play } from 'lucide-react';
import { getArticles, getEvents, getVideos } from '@/services/home';
import type { Article, ContentRail } from '@/services/types';
import ContentRailComponent from '@/components/blocks/ContentRail';
import EventCard from '@/components/boxing/EventCard';
import NewsCard from '@/components/news/NewsCard';
import SectionHeader from '@/components/ui/SectionHeader';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Boxing News & Fight Coverage | NaraTV',
  description: 'Original NaraTV boxing news, fight-week coverage, interviews, previews, and stories from African boxing.',
};

const categoryTabs = [
  { key: 'top', label: 'Top stories' },
  { key: 'fight-week', label: 'Fight week' },
  { key: 'african-boxing', label: 'African boxing' },
  { key: 'interviews', label: 'Interviews' },
  { key: 'results', label: 'Results' },
  { key: 'analysis', label: 'Analysis' },
];

function categoryNames(article: Article) {
  return (article.categories || []).map((category) => typeof category === 'string' ? category : category.name);
}

function matchesCategory(article: Article, category: string) {
  const text = [article.title, article.excerpt, article.content_type, ...categoryNames(article)].filter(Boolean).join(' ').toLowerCase();
  if (category === 'african-boxing') return /uganda|africa|kenya|tanzania|ghana|nigeria|south africa|east africa|west africa/.test(text);
  if (category === 'fight-week') return Boolean(article.event) || /fight|card|bout|schedule|weigh|upcoming|comeback/.test(text);
  if (category === 'interviews') return /interview|talks|conversation|exclusive| Q&A /.test(` ${text} `);
  if (category === 'results') return /result|win|victory|knockout|debut|defeat/.test(text);
  if (category === 'analysis') return /analysis|preview|ahead|report|breakdown|signs|deal|title shot/.test(text);
  return true;
}

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const requestedCategory = params.category || 'top';
  const activeTab = categoryTabs.some((tab) => tab.key === requestedCategory) ? requestedCategory : 'top';
  const [allArticles, videos, upcomingEvents] = await Promise.all([
    getArticles({ limit: 50 }).catch(() => []),
    getVideos({ limit: 12 }).catch(() => []),
    getEvents({ status: 'upcoming', limit: 8 }).catch(() => []),
  ]);
  const articles = activeTab === 'top' ? allArticles : allArticles.filter((article) => matchesCategory(article, activeTab));
  const lead = articles.find((article) => article.is_featured) || articles[0];
  const leadId = lead?.id;
  const secondary = articles.filter((article) => article.id !== leadId).slice(0, 2);
  const excludedIds = new Set([leadId, ...secondary.map((article) => article.id)]);
  const latest = articles.filter((article) => !excludedIds.has(article.id)).slice(0, 6);
  const africa = allArticles.filter((article) => matchesCategory(article, 'african-boxing')).slice(0, 4);
  const boxing = allArticles.filter((article) => /boxing|fight|championship/i.test(categoryNames(article).join(' '))).filter((article) => !africa.some((item) => item.id === article.id)).slice(0, 4);
  const selectedLabel = categoryTabs.find((tab) => tab.key === activeTab)?.label || 'Top stories';
  const videoRail: ContentRail = {
    id: 'news-latest-video',
    title: 'Latest video stories',
    titlePrefix: 'Watch',
    type: 'videos',
    layout: 'video',
    items: videos,
    viewAllHref: '/videos',
    viewAllLabel: 'View all videos',
  };

  return (
    <main className="min-h-screen bg-[#050b12] pb-20 pt-20 md:pt-24">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_75%_0%,rgba(69,227,255,0.12),transparent_35%),#07111f]">
        <div className="mx-auto max-w-[1920px] px-4 pb-5 pt-4 md:px-12 md:pb-7 md:pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#45E3FF]"><Newspaper className="h-4 w-4" /> The NaraTV desk</p>
              <h1 className="mt-2 text-3xl font-black uppercase leading-none tracking-tight text-white md:text-5xl">Boxing, beyond the bell.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">The stories, rivalries, results, and fight-week details shaping the sport in Africa and around the world.</p>
            </div>
            <Link href="#all-news" className="inline-flex min-h-10 items-center gap-2 self-start border border-white/20 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:border-[#45E3FF] hover:text-[#45E3FF] md:self-auto">Browse all stories <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <nav aria-label="News categories" className="mt-5 flex snap-x gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {categoryTabs.map((tab) => {
              const href = tab.key === 'top' ? '/news#top-stories' : '/news?category=' + tab.key + '#top-stories';
              const isActive = activeTab === tab.key;
              return <Link key={tab.key} href={href} aria-current={isActive ? 'page' : undefined} className={'min-h-9 shrink-0 snap-start border px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ' + (isActive ? 'border-[#45E3FF] bg-[#45E3FF] text-black' : 'border-white/15 text-gray-300 hover:border-[#45E3FF] hover:text-[#45E3FF]')}>{tab.label}</Link>;
            })}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-[1920px] space-y-10 px-4 pt-6 md:space-y-14 md:px-12 md:pt-9">
        <section id="top-stories">
          <SectionHeader eyebrow={activeTab === 'top' ? 'Top stories' : selectedLabel} title={activeTab === 'top' ? 'What matters now' : selectedLabel} description={activeTab === 'top' ? undefined : 'Stories selected from the published NaraTV desk feed.'} />
          {lead ? <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.75fr)]"><NewsCard article={lead} variant="lead" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">{secondary.map((article) => <NewsCard key={article.id} article={article} variant="feature" />)}</div></div> : <div className="border border-white/10 bg-[#0B1626] p-8 text-center text-sm text-gray-400">No {selectedLabel.toLowerCase()} stories are published yet. Try Top stories.</div>}
        </section>

        {(activeTab === 'top' || activeTab === 'fight-week') && upcomingEvents.length ? (
          <section>
            <SectionHeader eyebrow="Fight week" title="What is coming next" description="Stay close to the next bell, the next card, and the next story worth following." href="/events" actionLabel="Full schedule" />
            <div className="grid gap-3 lg:grid-cols-2">{upcomingEvents.slice(0, 4).map((event) => <EventCard key={event.id} event={event} variant="row" />)}</div>
          </section>
        ) : null}

        {latest.length ? <section><SectionHeader eyebrow="Fresh from the desk" title={activeTab === 'top' ? 'Latest stories' : 'More stories'} href="#all-news" /><div className="grid gap-x-8 divide-y divide-white/10 border-y border-white/10 lg:grid-cols-2 lg:divide-y-0">{latest.map((article) => <NewsCard key={article.id} article={article} variant="row" />)}</div></section> : null}

        {activeTab === 'top' && africa.length ? <section><SectionHeader eyebrow="Closer to home" title="African boxing" description="Fighters, gyms, promoters, and fight nights moving the sport forward across the continent." href="/news?category=african-boxing#top-stories" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{africa.map((article) => <NewsCard key={article.id} article={article} variant="grid" />)}</div></section> : null}

        {activeTab === 'top' && boxing.length ? <section><SectionHeader eyebrow="The wider fight game" title="World boxing" href="#all-news" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{boxing.map((article) => <NewsCard key={article.id} article={article} variant="grid" />)}</div></section> : null}

        {activeTab === 'top' && videos.length ? <section><ContentRailComponent rail={videoRail} /></section> : null}

        {articles.length ? <section id="all-news"><SectionHeader eyebrow="Archive" title={activeTab === 'top' ? 'All NaraTV coverage' : selectedLabel + ' archive'} description="Catch up on the stories you missed, from fight announcements to the people behind the gloves." /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{articles.slice(0, 24).map((article) => <NewsCard key={article.id} article={article} variant="grid" />)}</div></section> : null}

        <section className="border-l-4 border-[#45E3FF] bg-[#0B1626] p-4 md:flex md:items-center md:justify-between md:p-6"><div><p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#45E3FF]"><Flame className="h-4 w-4" /> Keep exploring</p><h2 className="mt-1 text-xl font-black uppercase text-white md:text-2xl">Your next fight story is waiting.</h2></div><Link href="/replays" className="mt-4 inline-flex min-h-10 items-center gap-2 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black hover:bg-[#45E3FF] md:mt-0">Watch the archive <Play className="h-3.5 w-3.5 fill-current" /></Link></section>
      </div>
    </main>
  );
}
