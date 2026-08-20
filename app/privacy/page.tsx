import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsPageView from '@/components/cms/CmsPageView';
import { getCmsPage } from '@/services/home';
import { shareMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCmsPage('privacy');
    return shareMetadata({ title: page.seo?.title || page.title, description: page.seo?.description || page.excerpt || '', path: '/privacy', image: page.seo?.og_image, robotsIndex: page.seo?.robots_index, robotsFollow: page.seo?.robots_follow });
  } catch {
    return shareMetadata({ title: 'Privacy Policy | NaraTV', description: 'How NaraTV handles account and viewing data.', path: '/privacy' });
  }
}

export default async function PrivacyPage() {
  try {
    return <CmsPageView page={await getCmsPage('privacy')} />;
  } catch {
    notFound();
  }
}
