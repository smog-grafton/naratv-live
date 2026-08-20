'use client';

import React from 'react';
import { X, Play, Lock } from 'lucide-react';
import { WatchOption } from '@/services/types';

interface PlayerContentSwitcherProps {
  onClose: () => void;
  title?: string;
  options?: WatchOption[];
}

export default function PlayerContentSwitcher({ onClose, title = 'NaraTV', options = [] }: PlayerContentSwitcherProps) {
  const watchOptions = options.length
    ? options
    : [{ id: 'current', label: 'Current broadcast', type: 'main', is_locked: false, access_type: 'free' as const }];

  return (
    <div className="bg-[#111D2E] text-white w-[90%] md:w-[400px] border border-white/10 shadow-2xl rounded shadow-black/80 flex flex-col pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-200 border-t-2 border-t-[#45E3FF]">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h3 className="font-bold text-sm uppercase tracking-wide">Select what you want to watch</h3>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-2">
        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider px-3 pt-2 pb-1 mb-1">
          {title}
        </div>
        
        <div className="flex flex-col gap-1">
          {watchOptions.map((opt, index) => (
            <button 
              key={opt.id}
              className={`flex items-center justify-between px-3 py-3 rounded text-sm transition-all group ${
                index === 0
                  ? 'bg-white/10 font-bold border-l-4 border-[#45E3FF] -ml-1 pl-4' 
                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
              disabled={opt.is_locked}
            >
              <div className="flex items-center gap-3">
                {index === 0 ? (
                   <span className="w-4 flex justify-center text-[#45E3FF]">
                     <Play className="w-4 h-4 fill-current" />
                   </span>
                ) : (
                   <span className="w-4 flex justify-center text-gray-500 group-hover:text-white transition-colors">
                     <Play className="w-4 h-4" />
                   </span>
                )}
                <span>{opt.label}</span>
              </div>
              
              <div className="flex items-center gap-3">
                {opt.duration ? <span className="text-xs text-gray-500 font-mono">{opt.duration}</span> : null}
                {opt.is_locked && (
                  <Lock className="w-3 h-3 text-gray-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-white/5 bg-black/20 text-xs text-gray-400">
        Some fight-night features may require a ticket, PPV unlock, or active pass.
      </div>
    </div>
  );
}
