'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Settings, Gauge, KeySquare, HelpCircle, ChevronLeft } from 'lucide-react';

interface PlayerSettingsMenuProps {
  onClose: () => void;
  isLive: boolean;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export default function PlayerSettingsMenu({ onClose, isLive, currentSpeed, onSpeedChange }: PlayerSettingsMenuProps) {
  const [activeMenu, setActiveMenu] = useState<'main' | 'quality' | 'speed' | 'captions' | 'help'>('main');

  const qualities = ['Auto'];
  const speeds = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'];
  const captionTracks = ['Off'];

  const renderHelp = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-3 border-b border-white/10">
        <button onClick={() => setActiveMenu('main')} className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm tracking-wide">Having trouble watching?</span>
      </div>
      <div className="p-4 text-sm text-gray-300 flex-1 flex flex-col gap-3">
        <p>Short tips:</p>
        <ul className="list-disc pl-4 space-y-1 text-gray-400">
          <li>Check your internet connection.</li>
          <li>Refresh the stream.</li>
          <li>Switch quality to Auto.</li>
          <li>Try another browser or device.</li>
        </ul>
        <Link href="/contact" className="mt-4 bg-[#45E3FF] text-black w-full py-2 rounded-sm font-bold uppercase text-xs text-center">
          Contact Support
        </Link>
      </div>
    </div>
  );

  const renderSubMenu = (title: string, items: string[], current: string, onSelect?: (item: string) => void) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-3 border-b border-white/10">
        <button onClick={() => setActiveMenu('main')} className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm uppercase tracking-wide">{title}</span>
      </div>
      <div className="p-2 flex flex-col gap-1 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => {
              if (onSelect) onSelect(item);
              setActiveMenu('main');
            }}
            className={`text-left px-3 py-2 text-sm rounded transition-colors ${item === current ? 'bg-white/10 text-white font-bold border-l-2 border-[#45E3FF]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  const renderMain = () => (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-sm uppercase tracking-wide">Settings</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-2 flex flex-col gap-1">
        <button onClick={() => setActiveMenu('quality')} className="flex items-center justify-between px-3 py-2.5 text-sm rounded text-gray-300 hover:bg-white/5 hover:text-white transition-colors group">
          <div className="flex items-center gap-3">
            <Gauge className="w-4 h-4 text-gray-400 group-hover:text-[#45E3FF] transition-colors" />
            <span>Quality</span>
          </div>
          <span className="text-gray-500 text-xs">Auto</span>
        </button>

        {!isLive && (
          <button onClick={() => setActiveMenu('speed')} className="flex items-center justify-between px-3 py-2.5 text-sm rounded text-gray-300 hover:bg-white/5 hover:text-white transition-colors group">
            <div className="flex items-center gap-3">
              <span className="w-4 flex justify-center text-xs font-mono text-gray-400 group-hover:text-[#45E3FF] transition-colors">{currentSpeed}x</span>
              <span>Playback Speed</span>
            </div>
            <span className="text-gray-500 text-xs">{currentSpeed === 1 ? 'Normal' : `${currentSpeed}x`}</span>
          </button>
        )}

        <button onClick={() => setActiveMenu('captions')} className="flex items-center justify-between px-3 py-2.5 text-sm rounded text-gray-300 hover:bg-white/5 hover:text-white transition-colors group">
          <div className="flex items-center gap-3">
            <KeySquare className="w-4 h-4 text-gray-400 group-hover:text-[#45E3FF] transition-colors" />
            <span>Captions</span>
          </div>
          <span className="text-gray-500 text-xs">Off</span>
        </button>

        <div className="h-px bg-white/5 my-1" />

        <button onClick={() => setActiveMenu('help')} className="flex items-center justify-between px-3 py-2.5 text-sm rounded text-gray-300 hover:bg-white/5 hover:text-white transition-colors group">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#45E3FF] transition-colors" />
            <span>Help & Troubleshooting</span>
          </div>
        </button>

      </div>
    </div>
  );

  return (
    <div className="bg-[#111D2E]/95 backdrop-blur-md text-white w-[280px] border border-white/10 shadow-2xl rounded shadow-black/80 flex flex-col pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
      {activeMenu === 'main' && renderMain()}
      {activeMenu === 'quality' && renderSubMenu('Quality', qualities, 'Auto')}
      {activeMenu === 'speed' && renderSubMenu('Playback Speed', speeds, `${currentSpeed}x`, (item) => {
        const val = parseFloat(item.replace('x', ''));
        if (!isNaN(val)) onSpeedChange(val);
      })}
      {activeMenu === 'captions' && renderSubMenu('Captions', captionTracks, 'Off')}
      {activeMenu === 'help' && renderHelp()}
    </div>
  );
}
