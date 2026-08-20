'use client';

import React, { useEffect } from 'react';
import { X, Play, Lock } from 'lucide-react';
import { ContentNormalized, WatchOption } from '@/components/hooks/useContentAccess';
import { useRouter } from 'next/navigation';
import NaraImage from '@/components/media/NaraImage';

interface Props {
  item: ContentNormalized;
  onClose: () => void;
  onAction: (option: WatchOption) => void;
}

export default function ContentDetailDrawer({ item, onClose, onAction }: Props) {
  const router = useRouter();

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-[100] transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] lg:w-[480px] bg-[#050B12] z-[101] flex flex-col shadow-2xl transition-transform duration-300 transform translate-x-0 overflow-y-auto"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Image */}
        <div className="relative w-full aspect-[16/9] bg-[#111D2E]">
          <NaraImage
            src={item.poster_url || item.thumbnail_url} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B12] via-[#050B12]/20 to-transparent" />
        </div>

        {/* Content Details */}
        <div className="px-6 pb-6 -mt-12 relative z-10 flex-col flex gap-1">
          {item.date_string && (
            <div className="mb-2">
              {/* Format smartly? Let's just output raw for now */}
              <span className="bg-white text-black text-[11px] font-bold px-2 py-0.5 rounded-[2px]">
                {item.date_string}
              </span>
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">{item.title}</h2>
          <p className="text-sm font-bold text-[#6F88FC] uppercase tracking-wider mb-6">
            {item.category || (item.content_type === 'live_event' ? 'LIVE EVENT' : 'NARA TV')}
          </p>
          
          {/* Watch Options */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[13px] text-gray-400 font-medium">Select what you want to watch</h3>
            
            <div className="flex flex-col gap-2">
              {item.watch_options.map((option, idx) => (
                <button
                  key={option.id || idx}
                  onClick={() => handleOptionClick(option)}
                  className="w-full flex items-center justify-between p-4 rounded-[4px] bg-[#111D2E] hover:bg-[#172338] border border-[#172338] transition-colors text-left group"
                >
                  <div className="flex items-center gap-4">
                    <Play className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" />
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
    </>
  );
}
