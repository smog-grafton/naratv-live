'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ContentNormalized } from '@/components/hooks/useContentAccess';
import { useRouter } from 'next/navigation';
import NaraImage from '@/components/media/NaraImage';

interface Props {
  item: ContentNormalized;
  onClose: () => void;
}

export default function AccessPaywallModal({ item, onClose }: Props) {
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCTA = () => {
    const isEventAccess = item.content_type === 'event' || item.content_type === 'live_event';
    const checkoutPath = isEventAccess && ['ticket_holder', 'ppv', 'paid'].includes(item.access_type)
      ? `/checkout?event=${encodeURIComponent(item.slug)}`
      : '/subscriptions';

    router.push(checkoutPath);
    onClose();
  };

  const ctaText = item.access_type === 'ticket_holder' 
    ? 'Buy Fight Pass' 
    : item.access_type === 'ppv' 
      ? 'Unlock this fight' 
      : 'View Passes';
      
  const messageText = item.access_type === 'ppv'
    ? 'Purchase event access to watch the stream or replay as soon as it is available.'
    : item.access_type === 'ticket_holder'
      ? 'Choose an eligible event pass to watch this fight night on NaraTV.'
      : 'Choose a NaraTV pass to unlock eligible live cards, replays, and premium video features.';

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="relative bg-[#050B12] w-full max-w-[480px] rounded-[8px] overflow-hidden shadow-2xl flex flex-col scale-100 transition-transform duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative w-full aspect-[4/3] bg-[#111D2E]">
              <NaraImage
              src={item.poster_url || item.thumbnail_url} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {/* Very strong bottom gradient to blend perfectly into the bg */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050B12] to-transparent" />
          </div>

          <div className="px-6 pb-8 -mt-6 relative z-10 flex flex-col items-center text-center">
             {item.date_string && (
                <div className="mb-3">
                  <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-[2px] uppercase">
                    {item.date_string}
                  </span>
                </div>
              )}
             <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{item.title}</h2>
             <p className="text-[#6F88FC] text-xs font-bold uppercase tracking-wider mb-6">
                {item.category || 'NaraTV'}
             </p>

             <div className="w-full max-w-[80%] mx-auto h-[1px] bg-[#172338] mb-6" />

             <p className="text-[13px] text-gray-300 leading-relaxed mb-6">
               {messageText}
             </p>

             <button
               onClick={handleCTA}
               className="w-full max-w-xs bg-white text-black font-bold py-3.5 px-6 rounded-[4px] hover:bg-gray-200 transition-colors text-sm"
             >
               {ctaText}
             </button>
          </div>
        </div>
      </div>
    </>
  );
}
