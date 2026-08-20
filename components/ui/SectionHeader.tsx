import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  actionLabel?: string;
  className?: string;
};

export default function SectionHeader({ eyebrow, title, description, href, actionLabel = 'View all', className = '' }: Props) {
  return (
    <div className={'mb-5 flex items-end justify-between gap-4 ' + className}>
      <div className="min-w-0">
        {eyebrow ? <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#45E3FF]">{eyebrow}</p> : null}
        <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:border-[#45E3FF]/60 hover:text-[#45E3FF]">
          {actionLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
