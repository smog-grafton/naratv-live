import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsPageView from '@/components/cms/CmsPageView';
import { getCmsPage } from '@/services/home';
import { shareMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCmsPage('refunds');
    return shareMetadata({ title: page.seo?.title || page.title, description: page.seo?.description || page.excerpt || '', path: '/refunds', image: page.seo?.og_image, robotsIndex: page.seo?.robots_index, robotsFollow: page.seo?.robots_follow });
  } catch {
    return shareMetadata({ title: 'Refund Policy | NaraTV', description: 'NaraTV refund policy.', path: '/refunds' });
  }
}

export default async function RefundsPage() {
  try {
    return <CmsPageView page={await getCmsPage('refunds')} />;
  } catch {
    notFound();
  }
}
