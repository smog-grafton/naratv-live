import ContentRail from '@/components/blocks/ContentRail';
import { getHomeRails, getVideos } from '@/services/home';

export const revalidate = 60;

export default async function VideosPage() {
  const [videos, rails] = await Promise.all([
    getVideos({ per_page: 24 }),
    getHomeRails(),
  ]);

  return (
    <main className="min-h-screen bg-nara-black pt-24 pb-24">
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 mb-10">
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Videos</h1>
        <p className="text-gray-400 mt-3 max-w-2xl">
          Highlights, interviews, originals, archives, and replays from the NaraTV fight-night library.
        </p>
      </section>

      <ContentRail
        rail={{
          id: 'latest-videos',
          title: 'Latest Videos',
          titlePrefix: 'NaraTV',
          type: 'videos',
          layout: 'video',
          items: videos,
        }}
      />

      {rails
        .filter((rail) => /original|highlight|interview|archive/i.test(`${rail.id} ${rail.title}`))
        .slice(0, 4)
        .map((rail, index) => (
          <ContentRail key={rail.id} rail={rail} index={index + 1} />
        ))}
    </main>
  );
}
