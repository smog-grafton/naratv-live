import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Play } from 'lucide-react';
import type { Article } from '@/services/types';
import NaraImage from '@/components/media/NaraImage';

type Variant = 'lead' | 'feature' | 'row' | 'grid';

function labels(article: Article) {
  return (article.categories || []).map((category) => typeof category === 'string' ? category : category.name).filter(Boolean);
}

function dateLabel(value?: string | null) {
  if (!value) return 'NaraTV editorial';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function context(article: Article) {
  return article.fighter?.name || article.event?.name || article.event?.title || labels(article)[0] || 'Boxing';
}

export default function NewsCard({ article, variant = 'grid' }: { article: Article; variant?: Variant }) {
  const category = labels(article)[0] || 'Boxing';
  const isVideoStory = article.content_type?.toLowerCase() === 'video';
  const href = '/news/' + article.slug;

  if (variant === 'row') {
    return (
      <Link href={href} className="group flex min-w-0 items-center gap-3 border-b border-white/10 py-3 transition-colors hover:border-[#45E3FF]/50">
        <div className="relative h-[72px] w-[104px] shrink-0 overflow-hidden bg-[#0B1626]">
          <NaraImage src={article.featured_image_url} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {isVideoStory ? <span className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black"><Play className="ml-0.5 h-3 w-3 fill-current" /></span> : null}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[9px] font-black uppercase tracking-[0.2em] text-[#45E3FF]">{category}</p>
          <h3 className="mt-1 line-clamp-2 text-sm font-black leading-tight text-white transition-colors group-hover:text-[#45E3FF]">{article.title}</h3>
          <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wider text-gray-500">{dateLabel(article.published_at)}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'lead' || variant === 'feature') {
    const isLead = variant === 'lead';
    return (
      <article className={'group overflow-hidden border border-white/10 bg-[#0B1626] ' + (isLead ? 'min-h-[220px] md:min-h-[260px]' : 'min-h-[150px]')}>
        <Link href={href} className="flex h-full flex-col sm:flex-row">
          <div className={'relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-black sm:aspect-auto ' + (isLead ? 'sm:w-[40%]' : 'sm:w-[34%]')}>
            <NaraImage src={article.featured_image_url} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0B1626]/80" />
            <div className="absolute left-3 top-3 flex items-center gap-2"><span className="bg-[#45E3FF] px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-black">{category}</span>{isVideoStory ? <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black"><Play className="ml-0.5 h-3 w-3 fill-current" /></span> : null}</div>
          </div>
          <div className={'flex min-w-0 flex-1 flex-col justify-center p-4 md:p-5 ' + (isLead ? 'md:p-6' : '')}>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500"><CalendarDays className="h-3.5 w-3.5" /> {dateLabel(article.published_at)}</p>
            <h2 className={(isLead ? 'text-xl md:text-3xl' : 'text-base md:text-lg') + ' mt-2 line-clamp-3 font-black uppercase leading-tight text-white transition-colors group-hover:text-[#45E3FF]'}>{article.title}</h2>
            {article.excerpt ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-400 md:text-sm">{article.excerpt}</p> : null}
            <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#45E3FF]">Read story <ArrowUpRight className="h-3.5 w-3.5" /></span>
          </div>
        </Link>
      </article>
    );
  }

  const imageClass = 'aspect-[16/10]';
  const cardClass = 'group overflow-hidden border border-white/10 bg-[#0B1626]';
  const imageWrapClass = 'relative overflow-hidden bg-black ' + imageClass;
  const gradient = 'from-black/80 via-transparent to-black/10';
  const headlineClass = 'text-base mt-2 line-clamp-3 font-black uppercase leading-tight text-white transition-colors group-hover:text-[#45E3FF]';

  return (
    <article className={cardClass}>
      <Link href={href} className="block h-full">
        <div className={imageWrapClass}>
          <NaraImage src={article.featured_image_url} alt={article.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className={'absolute inset-0 bg-gradient-to-t ' + gradient} />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="bg-[#45E3FF] px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-black">{category}</span>
            {isVideoStory ? <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black"><Play className="ml-0.5 h-3 w-3 fill-current" /></span> : null}
          </div>
        </div>
        <div className="p-4 md:p-5">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500"><CalendarDays className="h-3.5 w-3.5" /> {dateLabel(article.published_at)}</p>
            <h2 className={headlineClass}>{article.title}</h2>
            <p className="mt-2 line-clamp-1 text-xs font-bold uppercase tracking-wider text-gray-500">{context(article)}</p>
            {article.excerpt ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">{article.excerpt}</p> : null}
        </div>
      </Link>
    </article>
  );
}
