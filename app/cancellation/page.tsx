import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsPageView from '@/components/cms/CmsPageView';
import { getCmsPage } from '@/services/home';
import { shareMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('cancellation').catch(() => null);
  return shareMetadata({ title: page?.seo?.title || page?.title || 'Cancellation Policy | NaraTV', description: page?.seo?.description || page?.excerpt || 'NaraTV cancellation policy.', path: '/cancellation', image: page?.seo?.og_image, robotsIndex: page?.seo?.robots_index, robotsFollow: page?.seo?.robots_follow });
}

export default async function CancellationPage() {
  const page = await getCmsPage('cancellation').catch(() => null);
  if (!page) notFound();
  return <CmsPageView page={page} />;
}
