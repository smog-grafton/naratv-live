import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsPageView from '@/components/cms/CmsPageView';
import { getCmsPage } from '@/services/home';
import { shareMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCmsPage('about');
    return shareMetadata({ title: page.seo?.title || page.title, description: page.seo?.description || page.excerpt || '', path: '/about', image: page.seo?.og_image, robotsIndex: page.seo?.robots_index, robotsFollow: page.seo?.robots_follow });
  } catch {
    return shareMetadata({ title: 'About NaraTV', description: 'NaraTV streaming, events, replays, and boxing coverage.', path: '/about' });
  }
}

export default async function AboutPage() {
  try {
    return <CmsPageView page={await getCmsPage('about')} />;
  } catch {
    notFound();
  }
}
