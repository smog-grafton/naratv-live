import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { getArticle } from '@/services/home';
import NaraImage from '@/components/media/NaraImage';
import { shareMetadata } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug).catch(() => null);
  if (!article) return { title: 'News | NaraTV' };
  const title = article.seo?.title || `${article.title} | NaraTV`;
  const description = article.seo?.description || article.excerpt || `Read ${article.title} on NaraTV.`;
  return shareMetadata({ title, description, path: article.seo?.canonical || `/news/${article.slug}`, image: article.seo?.og_image || article.featured_image_url, type: 'article', publishedTime: article.published_at });
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug).catch(() => null);
  if (!article) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || undefined,
    image: article.featured_image_url || undefined,
    datePublished: article.published_at || undefined,
    author: { '@type': 'Organization', name: 'NaraTV' },
    publisher: { '@type': 'Organization', name: 'NaraTV' },
    mainEntityOfPage: `/news/${article.slug}`,
  };

  return (
    <main className="min-h-screen bg-[#050b12] pb-24 pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <article className="mx-auto max-w-4xl px-4 md:px-8">
        <Link href="/news" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#45E3FF]"><ArrowLeft size={15} /> All news</Link>
        <p className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500"><CalendarDays size={14} /> {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'NaraTV editorial'}</p>
        <h1 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-7xl">{article.title}</h1>
        {article.excerpt ? <p className="mt-6 text-lg leading-8 text-gray-300">{article.excerpt}</p> : null}
        <NaraImage src={article.featured_image_url} alt={article.title} className="mt-10 aspect-[16/8] w-full object-cover" />
        <div className="mt-10 whitespace-pre-wrap text-base leading-8 text-gray-300">{article.content || article.excerpt || 'This story does not have published copy yet.'}</div>
      </article>
    </main>
  );
}
