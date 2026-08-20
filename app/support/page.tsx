import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsPageView from '@/components/cms/CmsPageView';
import { getCmsPage } from '@/services/home';
import { shareMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('support').catch(() => null);
  return shareMetadata({ title: page?.seo?.title || page?.title || 'Help and Support | NaraTV', description: page?.seo?.description || page?.excerpt || 'Get help with NaraTV.', path: '/support', image: page?.seo?.og_image, robotsIndex: page?.seo?.robots_index, robotsFollow: page?.seo?.robots_follow });
}

export default async function SupportPage() {
  const page = await getCmsPage('support').catch(() => null);
  if (!page) notFound();
  return <CmsPageView page={page} />;
}
