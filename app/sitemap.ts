import type { MetadataRoute } from 'next';
import { getArticles, getEvents, getFighters, getReplays, getVideos } from '@/services/home';

export const revalidate = 300;

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.naratv.live').replace(/\/$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, fighters, videos, replays, articles] = await Promise.all([
    getEvents({ limit: 100 }),
    getFighters({ limit: 100 }),
    getVideos({ limit: 100 }),
    getReplays({ limit: 100 }),
    getArticles({ limit: 100 }),
  ]);
  const base = siteUrl();
  const now = new Date();

  return [
    '/',
    '/live',
    '/events',
    '/boxers',
    '/videos',
    '/replays',
    '/schedule',
    '/about',
    '/contact',
    '/help',
    '/privacy',
    '/terms',
    ...events.map((event) => `/events/${event.slug}`),
    ...fighters.map((fighter) => `/boxers/${fighter.slug}`),
    ...videos.map((video) => `/watch/${video.slug}`),
    ...replays.map((video) => `/replays/${video.slug}`),
    ...articles.map((article) => `/news/${article.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/' || path === '/live' ? 'hourly' as const : 'daily' as const,
    priority: path === '/' ? 1 : 0.7,
  }));
}
