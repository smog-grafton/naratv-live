import Link from 'next/link';
import type { RankingEntry } from '@/services/types';
import NaraImage from '@/components/media/NaraImage';

export default function RankingRow({ entry, featured = false }: { entry: RankingEntry; featured?: boolean }) {
  const fighter = entry.fighter;
  const movement = entry.movement;
  const record = fighter.record;
  const recordLabel = record?.display || String(record?.wins ?? fighter.record_wins ?? 0) + '-' + String(record?.losses ?? fighter.record_losses ?? 0) + '-' + String(record?.draws ?? fighter.record_draws ?? 0);
  const movementLabel = movement === 'NEW' ? 'NEW' : Number(movement) > 0 ? '↑' + movement : '↓' + Math.abs(Number(movement));
  const movementClass = movement === 'NEW' || Number(movement) > 0 ? 'text-emerald-400' : 'text-nara-red';

  return (
    <Link href={'/boxers/' + (fighter.slug || fighter.id)} className={'group grid grid-cols-[42px_48px_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 px-3 py-3 transition-colors hover:bg-white/5 md:grid-cols-[64px_64px_minmax(0,1fr)_140px_90px] md:gap-4 md:px-5 ' + (featured ? 'bg-white/[0.035]' : '')}>
      <div className="text-center"><span className={(featured ? 'text-2xl' : 'text-lg') + ' font-black text-[#45E3FF]'}>{String(entry.rank).padStart(2, '0')}</span>{movement ? <span className={'mt-1 block text-[9px] font-black uppercase tracking-widest ' + movementClass}>{movementLabel}</span> : null}</div>
      <div className="relative h-12 w-12 overflow-hidden bg-black md:h-14 md:w-14"><NaraImage src={fighter.portrait_url || fighter.image_url} alt={fighter.name} className="h-full w-full object-cover" /></div>
      <div className="min-w-0"><h3 className={(featured ? 'text-base md:text-xl' : 'text-sm md:text-base') + ' truncate font-black uppercase text-white group-hover:text-[#45E3FF]'}>{fighter.name}</h3><p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wider text-gray-500">{fighter.country || fighter.nationality || 'International'} <span className="text-white/20">·</span> {fighter.weight_class || 'Open division'}</p></div>
      <span className="hidden text-sm font-bold text-gray-300 md:block">{recordLabel}</span>
      <span className="text-right text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#45E3FF]">Profile</span>
    </Link>
  );
}
