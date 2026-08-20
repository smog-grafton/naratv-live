'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video, Event } from '@/services/types';
import { IconPlay, IconLock } from '@/components/icons';
import { useResponsiveContentModal } from '@/components/providers/ContentModalProvider';
import NaraImage from '@/components/media/NaraImage';

// Type guard
const isVideo = (item: Video | Event): item is Video => {
  return (item as Video).video_url !== undefined;
};

// Date formatters for badges
const formatUpcomingDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  if (d.getDate() === now.getDate() && d.getMonth() === now.getMonth()) {
    return `TODAY ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return `${days[d.getDay()]} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const formatPastDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

export default function VideoCard({ item, layout = 'video' }: { item: Video | Event, layout?: 'banner' | 'poster' | 'video' | 'square' }) {
  const isVid = isVideo(item);
  const title = item.title;
  const image = isVid ? item.thumbnail_url : (item as Event).poster_url;
  const eventStartTime = !isVid ? (item as Event).start_time : null;
  const { openContentModal } = useResponsiveContentModal();
  const router = useRouter();

  // Aspect ratio based on layout
  let aspectClass = "aspect-[16/9]";
  if (layout === 'banner') aspectClass = "aspect-[2.5/1]";
  if (layout === 'poster') aspectClass = "aspect-[3/4]";
  if (layout === 'square') aspectClass = "aspect-[1/1]";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if ((item as any).content_type === 'fighter') {
       router.push(`/boxers/${item.slug}`);
       return;
    }
    
    if ((item as any).content_type === 'promoter') {
       router.push(`/promotions/${item.slug}`);
       return;
    }
    
    openContentModal(item);
  };

  if (layout === 'square' && isVid && !item.video_url) {
    // Hack for top sports categories
    return (
      <button onClick={handleClick} className="group flex flex-col w-full h-full outline-none text-left">
        <div className={`relative w-full ${aspectClass} rounded-md overflow-hidden bg-[#0B1626]`}>
          <NaraImage src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-white font-bold text-sm md:text-base uppercase">{title}</h3>
          {(item as any).category && (
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">{(item as any).category}</p>
          )}
          {(item as any).source_label && (
            <p className="text-xs text-[#6F88FC] mt-0.5 font-bold">{(item as any).source_label}</p>
          )}
        </div>
      </button>
    );
  }

  if (layout === 'banner') {
    return (
      <button onClick={handleClick} className="group flex flex-col w-full h-full outline-none rounded-lg overflow-hidden relative text-left">
        <div className={`relative w-full ${aspectClass} bg-[#0B1626] overflow-hidden`}>
          <NaraImage src={image} alt={title} className="w-full h-full object-cover" />
          {/* Dark gradient on the left for text readability */}
          <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black via-black/80 to-transparent" />
          
          <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end md:justify-center w-2/3">
             {(isVid && item.is_premium) && (
                <div className="mb-2 bg-white text-black w-6 h-6 flex items-center justify-center rounded-[2px]">
                  <IconLock className="w-3.5 h-3.5" />
                </div>
             )}
             <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-2">{title}</h3>
             {isVid && item.category && (
               <div className="flex items-center gap-2 mt-4 text-white font-semibold">
                 <span className="text-sm md:text-lg">{item.category}</span>
               </div>
             )}
          </div>
        </div>
      </button>
    );
  }

  if (layout === 'poster') {
    return (
      <button onClick={handleClick} className="group flex flex-col w-full h-full outline-none text-left">
        <div className={`relative w-full ${aspectClass} bg-[#0B1626] rounded-md overflow-hidden mb-3`}>
          <NaraImage src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {/* Text inside the bottom of the poster */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
          <div className="absolute bottom-0 w-full p-4 text-center">
            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wider">{title}</h3>
            {eventStartTime && (
              <p className="text-sm text-[#6F88FC] font-bold mt-1" suppressHydrationWarning>
                {new Date(eventStartTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 px-1">
          {isVid && item.source_label && (
            <p className="text-sm text-gray-400 font-semibold">{item.source_label}</p>
          )}
        </div>
      </button>
    );
  }

  // Default 'video' layout
  return (
    <button onClick={handleClick} className="group flex flex-col w-full h-full outline-none text-left">
      <div className="relative w-full aspect-[16/9] bg-[#0B1626] rounded-md overflow-hidden mb-3 group-hover:ring-2 ring-white/20 transition-all">
        {/* Image */}
        <NaraImage
          src={image} 
          alt={title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105" 
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex gap-1 z-10">
          {item.is_live ? (
            <span className="bg-[#ff0000] text-white text-[11px] font-bold px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-1 rounded-[2px] shadow-sm">
              LIVE
            </span>
          ) : eventStartTime ? (
            <span className="bg-white text-black text-[11px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-[2px] shadow-sm" suppressHydrationWarning>
              {formatUpcomingDate(eventStartTime)}
            </span>
          ) : isVid && (item as Video).published_at ? (
            <span className="bg-white bg-opacity-90 text-black text-[11px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-[2px] shadow-sm" suppressHydrationWarning>
              {formatPastDate((item as Video).published_at!)}
            </span>
          ) : null}
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {(isVid && item.is_premium) && (
            <div className="bg-black/60 backdrop-blur-sm p-1 rounded-sm text-white flex items-center justify-center">
              <IconLock className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Hover Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-nara-black shadow-lg">
            <IconPlay className="w-5 h-5 fill-current ml-1" />
          </div>
        </div>

        {/* Bottom Right Duration/Status */}
        {isVid && item.durations_seconds && !item.progress && (
          <div className="absolute bottom-2 right-2 text-white font-bold text-xs drop-shadow-md z-10 bg-black/60 px-1.5 py-0.5 rounded-sm">
            {Math.floor(item.durations_seconds / 60)} min
          </div>
        )}

        {/* Bottom Progress Bar */}
        {(item.is_live || item.progress !== undefined) && (
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/20 z-10">
            <div className="h-full bg-nara-red transition-all" style={{ width: item.progress ? `${item.progress}%` : '66%' }} />
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-col flex-1 px-1">
        <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 leading-tight group-hover:underline decoration-2 underline-offset-4">
          {title}
        </h3>
        {isVid && item.source_label && !item.progress && (
          <p className="text-sm text-gray-400 mt-1">{item.source_label}</p>
        )}
        {item.progress !== undefined && (
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">11m remaining</p>
        )}
      </div>
    </button>
  );
}
