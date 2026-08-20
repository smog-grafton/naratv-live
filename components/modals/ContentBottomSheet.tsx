'use client';

import React, { useEffect, useRef } from 'react';
import { X, Play, Lock } from 'lucide-react';
import { ContentNormalized, WatchOption } from '@/components/hooks/useContentAccess';
import { useRouter } from 'next/navigation';
import NaraImage from '@/components/media/NaraImage';

interface Props {
  item: ContentNormalized;
  onClose: () => void;
  onAction: (option: WatchOption) => void;
}

export default function ContentBottomSheet({ item, onClose, onAction }: Props) {
  const router = useRouter();
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent background scrolling on mobile specifically via touch events? 
    // The useBodyScrollLock should handle it.
  }, []);

  const handleOptionClick = (option: WatchOption) => {
    if (option.is_locked) {
      onAction(option);
    } else {
      onClose();
      router.push(option.route || '#');
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 z-[100] transition-opacity" 
        onClick={onClose}
      />
      
      <div 
        ref={bottomSheetRef}
        className="fixed left-0 right-0 bottom-0 max-h-[90vh] bg-[#050B12] z-[101] flex flex-col rounded-t-[12px] overflow-hidden translate-y-0 transition-transform duration-300"
      >
        {/* Drag Handle & Close */}
        <div className="absolute top-0 left-0 right-0 flex justify-center p-3 z-20" onClick={onClose}>
           <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto w-full hide-scrollbar flex-1 pb-8">
            <div className="relative w-full aspect-[16/9] bg-[#111D2E]">
              <NaraImage
                src={item.poster_url || item.thumbnail_url} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B12] via-[#050B12]/40 to-transparent" />
            </div>

            <div className="px-5 -mt-10 relative z-10">
              {item.date_string && (
                <div className="mb-2">
                  <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    {item.date_string}
                  </span>
                </div>
              )}
              <h2 className="text-xl font-bold text-white leading-tight mb-1">{item.title}</h2>
              <p className="text-[11px] font-bold text-[#6F88FC] uppercase tracking-wider mb-6">
                 {item.category || (item.content_type === 'live_event' ? 'LIVE EVENT' : 'NARA TV')}
              </p>
              
              <div className="flex flex-col gap-3">
                <h3 className="text-xs text-gray-400 font-medium">Select what you want to watch</h3>
                
                <div className="flex flex-col gap-2">
                  {item.watch_options.map((option, idx) => (
                    <button
                      key={option.id || idx}
                      onClick={() => handleOptionClick(option)}
                      className="w-full flex items-center justify-between p-4 rounded-[4px] bg-[#111D2E] border border-[#172338] active:bg-[#172338] text-left"
                    >
                      <div className="flex items-center gap-4">
                        <Play className="w-4 h-4 text-white" fill="currentColor" />
                        <span className="text-sm font-bold text-white">{option.label}</span>
                      </div>
                      {option.is_locked ? (
                        <Lock className="w-4 h-4 text-gray-400" />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
