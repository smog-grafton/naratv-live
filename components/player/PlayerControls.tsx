'use client';

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, RotateCcw, RotateCw, ListVideo
} from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number) => void;
  toggleMute: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isLive: boolean;
  skipForward: () => void;
  skipBackward: () => void;
  onToggleContentSwitcher: () => void;
  onToggleSettings: () => void;
}

const formatTime = (time: number) => {
  if (isNaN(time)) return '00:00';
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function PlayerControls({
  isPlaying,
  togglePlay,
  currentTime,
  duration,
  onSeek,
  volume,
  isMuted,
  onVolumeChange,
  toggleMute,
  isFullscreen,
  toggleFullscreen,
  isLive,
  skipForward,
  skipBackward,
  onToggleContentSwitcher,
  onToggleSettings
}: PlayerControlsProps) {

  return (
    <div className="flex flex-col gap-3 w-full backdrop-blur-sm rounded-lg bg-black/20 p-2 md:bg-transparent md:p-0 md:backdrop-blur-none transition-all">
      {/* Progress Bar */}
      {!isLive && (
        <div className="flex items-center w-full px-2 md:px-0">
          <Slider.Root 
            className="relative flex items-center select-none touch-none w-full h-5 group cursor-pointer" 
            value={[currentTime]} 
            max={duration || 100} 
            step={1} 
            onValueChange={(val) => onSeek(val[0])}
          >
            <Slider.Track className="bg-white/30 relative grow rounded-full h-1.5 overflow-hidden transition-all group-hover:h-2 md:h-1 pr-2">
               <Slider.Range className="absolute bg-[#45E3FF] rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb 
              className="block w-4 h-4 bg-[#45E3FF] shadow-[0_2px_10px] shadow-blackA4 rounded-[10px] hover:bg-white focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8 opacity-0 group-hover:opacity-100 transition-opacity" 
              aria-label="Volume" 
            />
          </Slider.Root>
        </div>
      )}

      {/* Controls Row */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={togglePlay} className="text-white hover:text-[#45E3FF] transition-colors p-2">
            {isPlaying ? <Pause className="w-6 h-6 md:w-7 md:h-7 fill-current" /> : <Play className="w-6 h-6 md:w-7 md:h-7 fill-current" />}
          </button>

          {!isLive && (
            <div className="hidden md:flex items-center gap-2">
              <button onClick={skipBackward} className="text-white hover:text-gray-300 transition-colors p-1">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button onClick={skipForward} className="text-white hover:text-gray-300 transition-colors p-1">
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 group relative p-2">
            <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            
            <div className="hidden md:flex w-0 overflow-hidden group-hover:w-20 transition-all duration-300 items-center">
              <Slider.Root 
                className="relative flex items-center select-none touch-none w-20 h-5" 
                value={[isMuted ? 0 : volume]} 
                max={1} 
                step={0.01} 
                onValueChange={(val) => onVolumeChange(val[0])}
              >
                <Slider.Track className="bg-white/30 relative grow rounded-full h-1">
                  <Slider.Range className="absolute bg-[#45E3FF] rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-3 h-3 bg-white rounded-full focus:outline-none" aria-label="Volume" />
              </Slider.Root>
            </div>
          </div>

          <div className="text-white text-xs md:text-sm font-mono tracking-wider ml-2 pointer-events-none select-none drop-shadow-sm">
            {isLive ? (
               <span className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse hidden md:block"></span>
                 LIVE
               </span>
            ) : (
               <span>{formatTime(currentTime)} <span className="text-gray-400">/ {formatTime(duration)}</span></span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={onToggleContentSwitcher} className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-[2px] px-3 py-1.5 text-xs font-bold transition border border-white/20">
            <ListVideo className="w-4 h-4" />
            SWITCH CONTENT
          </button>
          
          {/* Mobile Switch Content Icon */}
          <button onClick={onToggleContentSwitcher} className="md:hidden text-white hover:text-gray-300 transition-colors p-2">
            <ListVideo className="w-5 h-5" />
          </button>

          <button onClick={onToggleSettings} className="text-white hover:text-gray-300 transition-colors p-2">
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition-colors p-2">
            {isFullscreen ? <Minimize className="w-5 h-5 md:w-6 md:h-6" /> : <Maximize className="w-5 h-5 md:w-6 md:h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
