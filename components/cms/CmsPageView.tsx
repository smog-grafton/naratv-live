import Link from 'next/link';
import type { CmsPage } from '@/services/types';

function sanitizeHtml(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '');
}

export default function CmsPageView({ page }: { page: CmsPage }) {
  return (
    <main className="min-h-screen bg-[#050b12] pt-24 pb-20 text-white">
      <article className="mx-auto max-w-4xl px-4 md:px-8">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#45E3FF]">{page.navigation_group || 'NaraTV'}</p>
        <h1 className="text-4xl font-black tracking-tight md:text-6xl">{page.title}</h1>
        {page.excerpt ? <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300">{page.excerpt}</p> : null}
        <div className="cms-prose mt-10 border-t border-white/10 pt-8 text-sm leading-8 text-zinc-300 md:text-base" dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.body) }} />
        <div className="mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-6 text-sm">
          <Link href="/contact" className="rounded-sm bg-white px-5 py-3 font-black text-black transition-colors hover:bg-[#45E3FF]">Contact support</Link>
          <Link href="/events" className="rounded-sm border border-white/15 px-5 py-3 font-black text-white transition-colors hover:border-[#45E3FF] hover:text-[#45E3FF]">Browse events</Link>
        </div>
      </article>
    </main>
  );
}
