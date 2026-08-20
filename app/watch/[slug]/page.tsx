import WatchExperience from '@/components/watch/WatchExperience';
import type { Metadata } from 'next';
import { getEvent, getHomeRails, getVideo } from '@/services/home';
import { shareMetadata } from '@/lib/seo';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [video, event] = await Promise.all([
    getVideo(slug).catch(() => null),
    getEvent(slug).catch(() => null),
  ]);
  const content = video || event;

  if (!content) {
    return { title: 'Watch | Nara TV' };
  }

  const title = content.seo?.title || `${content.title} | NaraTV`;
  const description = content.seo?.description || content.description || `Watch ${content.title} on NaraTV.`;
  const image = content.seo?.og_image || ('thumbnail_url' in content ? content.thumbnail_url : content.banner_url || content.poster_url);
  return shareMetadata({ title, description, path: content.seo?.canonical || `/watch/${content.slug}`, image });
}

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [video, event, rails] = await Promise.all([
    getVideo(slug).catch(() => null),
    getEvent(slug).catch(() => null),
    getHomeRails(),
  ]);
  const relatedRail = rails.find((rail) => /highlight|replay|archive|coming|live/i.test(`${rail.id} ${rail.title}`));

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': video ? 'VideoObject' : 'SportsEvent', name: contentTitle(video, event), description: video?.description || event?.description || undefined, thumbnailUrl: video?.thumbnail_url || event?.poster_url || undefined, uploadDate: video?.published_at || undefined, url: `/watch/${slug}` }) }} />
    <WatchExperience slug={slug} initialVideo={video} initialEvent={event} relatedRail={relatedRail} />
  </>;
}

function contentTitle(video: Awaited<ReturnType<typeof getVideo>> | null, event: Awaited<ReturnType<typeof getEvent>> | null) {
  return video?.title || event?.title || 'NaraTV fight coverage';
}
