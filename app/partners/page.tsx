import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsPageView from '@/components/cms/CmsPageView';
import { getCmsPage } from '@/services/home';
import { shareMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('partners').catch(() => null);
  return shareMetadata({ title: page?.seo?.title || page?.title || 'Partner With NaraTV', description: page?.seo?.description || page?.excerpt || 'Partner with NaraTV.', path: '/partners', image: page?.seo?.og_image, robotsIndex: page?.seo?.robots_index, robotsFollow: page?.seo?.robots_follow });
}

export default async function PartnersPage() {
  const page = await getCmsPage('partners').catch(() => null);
  if (!page) notFound();
  return <CmsPageView page={page} />;
}
