import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsPageView from '@/components/cms/CmsPageView';
import { getCmsPage } from '@/services/home';
import { shareMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCmsPage('terms');
    return shareMetadata({ title: page.seo?.title || page.title, description: page.seo?.description || page.excerpt || '', path: '/terms', image: page.seo?.og_image, robotsIndex: page.seo?.robots_index, robotsFollow: page.seo?.robots_follow });
  } catch {
    return shareMetadata({ title: 'Terms of Use | NaraTV', description: 'Terms for using NaraTV.', path: '/terms' });
  }
}

export default async function TermsPage() {
  try {
    return <CmsPageView page={await getCmsPage('terms')} />;
  } catch {
    notFound();
  }
}
