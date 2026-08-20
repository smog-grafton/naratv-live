import Link from 'next/link';
import type { Fighter } from '@/services/types';
import NaraImage from '@/components/media/NaraImage';

type Variant = 'spotlight' | 'portrait' | 'compact';

function recordFor(fighter: Fighter) {
  const record = fighter.record;
  return {
    wins: record?.wins ?? fighter.record_wins ?? 0,
    losses: record?.losses ?? fighter.record_losses ?? 0,
    draws: record?.draws ?? fighter.record_draws ?? 0,
    knockouts: record?.ko_wins ?? record?.knockouts ?? fighter.knockouts ?? 0,
  };
}

export default function FighterCard({ fighter, variant = 'portrait', rank }: { fighter: Fighter; variant?: Variant; rank?: number | null }) {
  const record = recordFor(fighter);
  const href = '/boxers/' + (fighter.slug || fighter.id);
  const displayRank = rank ?? fighter.global_ranking;

  if (variant === 'compact') {
    return (
      <Link href={href} className="group flex min-w-[220px] items-center gap-3 border border-white/10 bg-[#0B1626] p-3 transition-colors hover:border-[#45E3FF]/60">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-black">
          <NaraImage src={fighter.portrait_url || fighter.image_url} alt={fighter.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[9px] font-black uppercase tracking-[0.2em] text-[#45E3FF]">{fighter.weight_class || 'Fighter'}</p>
          <h3 className="truncate text-sm font-black uppercase text-white group-hover:text-[#45E3FF]">{fighter.name}</h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">{record.wins}-{record.losses}-{record.draws} · {record.knockouts} KO</p>
        </div>
      </Link>
    );
  }

  const cardClass = 'group relative block overflow-hidden border border-white/10 bg-[#0B1626] transition-colors hover:border-[#45E3FF]/70 ' + (variant === 'spotlight' ? 'min-h-[380px] md:min-h-[470px]' : '');
  const imageWrapClass = (variant === 'spotlight' ? 'aspect-[16/11] md:absolute md:inset-0 md:h-full' : 'aspect-[4/5]') + ' relative overflow-hidden bg-black';
  const titleClass = (variant === 'spotlight' ? 'text-2xl md:text-4xl' : 'text-lg md:text-xl') + ' mt-1 font-black uppercase leading-none text-white';

  return (
    <Link href={href} className={cardClass}>
      <div className={imageWrapClass}>
        <NaraImage src={fighter.portrait_url || fighter.image_url} alt={fighter.name} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        {displayRank ? <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-black">#{displayRank} NaraTV</span> : null}
        {fighter.is_featured ? <span className="absolute right-3 top-3 bg-[#45E3FF] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-black">Featured</span> : null}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#45E3FF]">{fighter.weight_class || 'Open division'}</p>
          <h3 className={titleClass}>{fighter.name}</h3>
          <p className="mt-1 truncate text-xs font-bold uppercase tracking-wider text-gray-300">{fighter.country || fighter.nationality || 'International'}</p>
          <div className="mt-4 grid grid-cols-3 border-t border-white/20 pt-3">
            <div><span className="block text-lg font-black text-white">{record.wins}</span><span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Wins</span></div>
            <div><span className="block text-lg font-black text-[#45E3FF]">{record.knockouts}</span><span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">KO</span></div>
            <div><span className="block text-lg font-black text-white">{record.losses}</span><span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Losses</span></div>
          </div>
        </div>
      </div>
      {variant === 'portrait' ? <div className="border-t border-white/10 px-4 py-3"><p className="truncate text-[10px] font-bold uppercase tracking-widest text-gray-500">{fighter.nickname || fighter.ring_name || 'Official fighter profile'}</p></div> : null}
    </Link>
  );
}
