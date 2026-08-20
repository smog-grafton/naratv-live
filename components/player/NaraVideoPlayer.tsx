'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import { AlertTriangle, Play } from 'lucide-react';
import { WatchOption } from '@/services/types';
import PlayerControls from './PlayerControls';
import PlayerContentSwitcher from './PlayerContentSwitcher';
import PlayerSettingsMenu from './PlayerSettingsMenu';

interface NaraVideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  isLive?: boolean;
  sourceType?: string | null;
  watchOptions?: WatchOption[];
  onProgress?: (positionSeconds: number, durationSeconds: number, completed?: boolean) => void;
}

type SourceKind = 'youtube' | 'vimeo' | 'hls' | 'file' | 'iframe';

function detectSourceKind(src: string, sourceType?: string | null): SourceKind {
  const type = (sourceType || '').toLowerCase();
  const lower = src.toLowerCase();

  if (type.includes('youtube') || lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('youtube-nocookie.com')) return 'youtube';
  if (type.includes('vimeo') || lower.includes('vimeo.com')) return 'vimeo';
  if (type.includes('hls') || lower.includes('.m3u8')) return 'hls';
  if (type.includes('file') || /\.(mp4|webm|mov)(\?|#|$)/i.test(lower)) return 'file';

  return 'iframe';
}

function appendPlayerParams(src: string, kind: SourceKind) {
  try {
    const url = new URL(src);

    if (kind === 'youtube') {
      url.searchParams.set('enablejsapi', '1');
      url.searchParams.set('modestbranding', '1');
      url.searchParams.set('rel', '0');
      url.searchParams.set('controls', '0');
      url.searchParams.set('disablekb', '1');
      url.searchParams.set('fs', '0');
      url.searchParams.set('iv_load_policy', '3');
      url.searchParams.set('playsinline', '1');
    }

    if (kind === 'vimeo') {
      url.searchParams.set('title', '0');
      url.searchParams.set('byline', '0');
      url.searchParams.set('portrait', '0');
    }

    return url.toString();
  } catch {
    return src;
  }
}

export default function NaraVideoPlayer({ src, poster, title, isLive = false, sourceType, watchOptions = [], onProgress }: NaraVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const sourceKind = useMemo(() => detectSourceKind(src, sourceType), [src, sourceType]);
  const isFrameSource = sourceKind === 'youtube' || sourceKind === 'vimeo' || sourceKind === 'iframe';
  const frameSrc = useMemo(() => appendPlayerParams(src, sourceKind), [src, sourceKind]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(true);
  const [showContentSwitcher, setShowContentSwitcher] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isFrameSource || sourceKind !== 'hls' || !videoRef.current) return;

    const video = videoRef.current;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }

    if (!Hls.isSupported()) {
      setHasError(true);
      return;
    }

    const hls = new Hls({ enableWorker: true, lowLatencyMode: isLive });
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) setHasError(true);
    });

    return () => hls.destroy();
  }, [isFrameSource, isLive, sourceKind, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = isMuted;
    video.playbackRate = playbackRate;
  }, [isMuted, playbackRate, volume]);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsHovering(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (isPlaying) {
        hideTimerRef.current = setTimeout(() => setIsHovering(false), 3000);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    container?.addEventListener('touchstart', handleMouseMove);

    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
      container?.removeEventListener('touchstart', handleMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  function frameCommand(func: string, args: unknown[] = []) {
    if (sourceKind !== 'youtube') return;
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
  }

  async function togglePlay() {
    if (isFrameSource) {
      const nextPlaying = !isPlaying;
      frameCommand(nextPlaying ? 'playVideo' : 'pauseVideo');
      setIsPlaying(nextPlaying);
      setIsReady(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play().catch(() => setHasError(true));
    } else {
      video.pause();
    }
  }

  function handleSeek(value: number) {
    setCurrentTime(value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  }

  function toggleMute() {
    const nextMuted = !isMuted;
    if (isFrameSource) frameCommand(nextMuted ? 'mute' : 'unMute');
    setIsMuted(nextMuted);
  }

  function handleVolumeChange(value: number) {
    setVolume(value);
    setIsMuted(value === 0);
    if (isFrameSource && value === 0) frameCommand('mute');
    if (isFrameSource && value > 0) frameCommand('unMute');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => null);
    } else {
      document.exitFullscreen().catch(() => null);
    }
  }

  function skipForward() {
    handleSeek(Math.min(duration || currentTime + 10, currentTime + 10));
  }

  function skipBackward() {
    handleSeek(Math.max(0, currentTime - 10));
  }

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col overflow-hidden bg-black group"
      style={{ aspectRatio: isFullscreen ? 'auto' : '16/9', height: isFullscreen ? '100vh' : 'auto', maxHeight: isFullscreen ? 'none' : '85vh' }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="absolute inset-0 z-0 h-full w-full bg-black">
        {isFrameSource ? (
          <>
            <iframe
              ref={frameRef}
              src={frameSrc}
              title={title}
              className="absolute inset-0 h-full w-full"
              onLoad={() => setIsReady(true)}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div className="absolute inset-0 z-10 bg-transparent" aria-hidden="true" />
          </>
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            src={sourceKind === 'hls' ? undefined : src}
            poster={poster}
            playsInline
            preload="metadata"
            onLoadedMetadata={(event) => {
              setDuration(event.currentTarget.duration || 0);
              setIsReady(true);
            }}
            onTimeUpdate={(event) => {
              const current = event.currentTarget.currentTime;
              const total = event.currentTarget.duration || 0;
              setCurrentTime(current);
              onProgress?.(current, total, false);
            }}
            onPlay={() => {
              setIsPlaying(true);
              setIsBuffering(false);
            }}
            onPause={() => setIsPlaying(false)}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
            onEnded={(event) => {
              setIsPlaying(false);
              onProgress?.(event.currentTarget.duration || duration, event.currentTarget.duration || duration, true);
            }}
            onError={() => setHasError(true)}
            onClick={togglePlay}
          />
        )}
      </div>

      {hasError && (
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 text-white">
          <div className="max-w-sm px-4 text-center">
            <AlertTriangle className="mx-auto mb-4 h-9 w-9 text-[#45E3FF]" />
            <h3 className="mb-2 text-xl font-black uppercase">Stream temporarily unavailable</h3>
            <p className="text-sm leading-6 text-gray-400">We are getting this broadcast ready. Try again shortly or choose another fight-night feature.</p>
          </div>
        </div>
      )}

      {!isReady && !hasError && (
        <div className="pointer-events-none absolute inset-0 z-[25] flex flex-col items-center justify-center bg-black/60 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#45E3FF]" />
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-gray-300">Preparing playback</p>
        </div>
      )}

      {isBuffering && !hasError && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#45E3FF]" />
        </div>
      )}

      {!isPlaying && isReady && !hasError && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="mb-3 px-4 text-2xl font-bold tracking-tight text-white drop-shadow-lg md:text-4xl">{title}</h2>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-300 drop-shadow-md md:text-sm">
              {isLive ? <span className="bg-red-600 px-2 py-0.5 text-white">Live</span> : <span className="bg-[#45E3FF] px-2 py-0.5 text-black">NaraTV</span>}
              <span>Official broadcast</span>
            </div>
            <button
              type="button"
              onClick={togglePlay}
              className="pointer-events-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-all hover:bg-white/20 md:h-20 md:w-20"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <Play className="ml-1 h-8 w-8 fill-current text-white transition-transform md:h-10 md:w-10" />
            </button>
          </div>
        </div>
      )}

      <div className={`pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-transparent to-black/40 transition-opacity duration-300 ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'}`} />

      <div className={`pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-4 transition-opacity duration-300 md:p-6 ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex-1" />
        {isLive && (
          <span className="bg-red-600 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
            Live
          </span>
        )}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 z-20 p-4 transition-opacity duration-300 md:p-6 ${isHovering || !isPlaying || showSettingsMenu || showContentSwitcher ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <PlayerControls
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          toggleMute={toggleMute}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          isLive={isLive}
          skipForward={skipForward}
          skipBackward={skipBackward}
          onToggleContentSwitcher={() => {
            setShowSettingsMenu(false);
            setShowContentSwitcher(!showContentSwitcher);
          }}
          onToggleSettings={() => {
            setShowContentSwitcher(false);
            setShowSettingsMenu(!showSettingsMenu);
          }}
        />

        {showSettingsMenu && (
          <div className="absolute bottom-[80px] right-4 z-30 md:right-6">
            <PlayerSettingsMenu
              onClose={() => setShowSettingsMenu(false)}
              isLive={isLive}
              currentSpeed={playbackRate}
              onSpeedChange={setPlaybackRate}
            />
          </div>
        )}
      </div>

      {showContentSwitcher && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 pb-10 backdrop-blur-sm transition-all duration-300"
          onClick={() => setShowContentSwitcher(false)}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <PlayerContentSwitcher title={title} options={watchOptions} onClose={() => setShowContentSwitcher(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
