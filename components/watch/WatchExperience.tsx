'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Check, Copy, Lock, MessageSquare, Play, Share2, ShieldCheck, Ticket } from 'lucide-react';
import ContentRail from '@/components/blocks/ContentRail';
import NaraVideoPlayer from '@/components/player/NaraVideoPlayer';
import NaraImage from '@/components/media/NaraImage';
import CommentsTab from '@/components/watch/CommentsTab';
import ChatTab from '@/components/watch/ChatTab';
import { ContentRail as ContentRailType, Event, Video, AccessResponse } from '@/services/types';
import { getEventAccess, getEventPlayback, getStoredToken, getVideo, getVideoAccess, getVideoPlayback, saveWatchProgress, toggleWatchlist } from '@/services/home';

type Props = {
  slug: string;
  initialVideo: Video | null;
  initialEvent: Event | null;
  relatedRail?: ContentRailType;
};

export default function WatchExperience({ slug, initialVideo, initialEvent, relatedRail }: Props) {
  const [video, setVideo] = useState<Video | null>(initialVideo);
  const [access, setAccess] = useState<AccessResponse | null>(null);
  const [showInstantPay, setShowInstantPay] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shareLabel, setShareLabel] = useState('Share');
  const hasOpenedAccessModal = useRef(false);
  const lastProgressSent = useRef(0);
  const event = initialVideo ? null : initialEvent;
  const contextEvent = initialEvent || video?.event || null;
  const contextFighters = contextEvent?.fighters?.length ? contextEvent.fighters : (video?.fighters || []);
  const item = video || event;
  const title = item?.title || slug.replace(/-/g, ' ');
  const poster = video?.thumbnail_url || contextEvent?.poster_url || '/assets/images/banner/videos_banner.jpg';
  const accessType = video?.access_type || event?.access_type || 'free';
  const isEventContent = Boolean(event);
  const isPremium = video
    ? Boolean(video.is_premium || ['subscription', 'premium', 'ppv', 'ticket_holder', 'paid'].includes(accessType))
    : Boolean(event?.is_ppv || ['subscription', 'premium', 'ppv', 'ticket_holder', 'paid'].includes(accessType));

  useEffect(() => {
    const token = getStoredToken();

    let active = true;

    async function loadAccess() {
      try {
        if (initialVideo) {
          const [freshVideo, freshAccess] = await Promise.all([
            getVideo(slug, token),
            getVideoAccess(slug, token),
          ]);
          const playback = freshAccess.has_access ? await getVideoPlayback(slug, token) : null;
          if (active) {
            setVideo(freshVideo);
            setAccess(playback ? { ...freshAccess, playback_url: playback.playback_url, source_type: playback.source_type } : freshAccess);
          }
          return;
        }

        if (initialEvent) {
          const freshAccess = await getEventAccess(slug, token);
          const playback = freshAccess.has_access ? await getEventPlayback(slug, token) : null;
          if (active) setAccess(playback ? { ...freshAccess, playback_url: playback.playback_url, source_type: playback.source_type } : freshAccess);
        }
      } catch {
        if (active) setAccess(null);
      }
    }

    loadAccess();
    return () => {
      active = false;
    };
  }, [initialEvent, initialVideo, slug]);

  const recordProgress = (positionSeconds: number, durationSeconds: number, completed = false) => {
    const token = getStoredToken();
    if (!token || (!video && !event)) return;
    const now = Date.now();
    if (!completed && now - lastProgressSent.current < 10000) return;
    lastProgressSent.current = now;
    void saveWatchProgress({
      ...(video ? { video_id: Number(video.id) } : { event_id: Number(event?.id) }),
      position_seconds: Math.max(0, Math.floor(positionSeconds)),
      duration_seconds: durationSeconds > 0 ? Math.floor(durationSeconds) : undefined,
      completed,
    }, token);
  };

  const saveForLater = async () => {
    if (isSaving) return;
    const token = getStoredToken();
    if (!token) {
      window.location.href = `/login?next=${encodeURIComponent(`/watch/${slug}`)}`;
      return;
    }
    setIsSaving(true);
    try {
      const result = await toggleWatchlist(video ? { video_id: Number(video.id) } : { event_id: Number(event?.id) }, token);
      setIsSaved(result.saved);
    } finally {
      setIsSaving(false);
    }
  };

  const sharePage = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => null);
      return;
    }
    await navigator.clipboard?.writeText(url).catch(() => null);
    setShareLabel('Copied');
    window.setTimeout(() => setShareLabel('Share'), 1800);
  };

  const playbackUrl = useMemo(() => {
    return access?.playback_url || video?.playback_url || video?.video_url || video?.hls_url || video?.replay_url || null;
  }, [access?.playback_url, video?.hls_url, video?.playback_url, video?.replay_url, video?.video_url]);

  const hasAccess = access
    ? Boolean(access.has_access || access.can_watch)
    : (video ? Boolean(video.has_access || video.can_watch || video.is_free) : Boolean(event?.is_free));
  const lockCopy = isPremium
    ? 'Unlock this fight-night feature with an eligible ticket, PPV purchase, or active NaraTV pass.'
    : 'This video is listed as free to watch. Playback will open as soon as the media source is available.';
  const isPaidEventAccess = isEventContent && ['ticket_holder', 'ppv', 'paid'].includes(accessType);
  const isSubscriptionAccess = ['subscription', 'premium'].includes(accessType);
  const isLiveEvent = Boolean(event?.is_live);
  const paymentHref = isPaidEventAccess
    ? `/checkout?event=${slug}`
    : '/subscriptions';
  const isLocked = isPremium && !hasAccess;

  useEffect(() => {
    if (!isLocked || playbackUrl || hasOpenedAccessModal.current) return;
    hasOpenedAccessModal.current = true;
    const timer = window.setTimeout(() => setShowInstantPay(true), 450);
    return () => window.clearTimeout(timer);
  }, [isLocked, playbackUrl]);

  const openInstantPay = () => {
    const token = getStoredToken();
    if (!token) {
      window.location.href = `/login?next=${encodeURIComponent(`/watch/${slug}`)}`;
      return;
    }
    setShowInstantPay(true);
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#050b12]">
      <section className="relative mx-auto mt-[60px] flex w-full max-w-[1920px] items-center justify-center border-b border-white/5 bg-black shadow-2xl md:mt-[72px] lg:mt-[80px]">
        {playbackUrl && hasAccess ? (
          <NaraVideoPlayer
            src={playbackUrl}
            poster={poster}
            title={title}
            isLive={isLiveEvent || Boolean(video?.is_live)}
            sourceType={access?.source_type || video?.source_type}
            watchOptions={video?.watch_options || event?.watch_options || []}
            onProgress={recordProgress}
          />
        ) : (
          <div className="relative aspect-[16/9] max-h-[85vh] w-full">
            <NaraImage src={poster} className="absolute inset-0 h-full w-full object-cover opacity-20" alt="NaraTV player placeholder" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050b12] via-[#050b12]/80 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                {isPremium ? <Lock className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 fill-white text-white" />}
              </div>
              <h1 className="mb-3 max-w-3xl text-2xl font-black capitalize tracking-tight text-white md:text-4xl">
                {title}
              </h1>
              <p className="mb-8 max-w-md text-gray-400">
                {lockCopy}
              </p>

              <div className="flex w-full max-w-md flex-col justify-center gap-3 sm:flex-row">
                {isLocked ? (
                  <>
                    <button onClick={openInstantPay} className="rounded-sm bg-[#45E3FF] px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-white">
                      Unlock Access
                    </button>
                    <Link href="/subscriptions" className="rounded-sm bg-white/10 px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/20">
                      View Passes
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/videos" className="rounded-sm bg-white px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-black transition-colors">
                      Browse Videos
                    </Link>
                    <Link href="/replays" className="rounded-sm bg-white/10 px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/20">
                      View Replays
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-sm border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white md:text-xs">
              {video?.category || contextEvent?.status || 'NaraTV'}
            </span>
            {isPremium && <span className="rounded-sm bg-[#45E3FF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black md:text-xs">Premium</span>}
            {contextEvent?.source_label || video?.source_label ? <span className="text-xs font-bold uppercase tracking-wide text-gray-400">{contextEvent?.source_label || video?.source_label}</span> : null}
          </div>
          <h1 className="mb-4 text-2xl font-black capitalize leading-tight tracking-tight text-white md:text-4xl">{title}</h1>
          <div className="mb-5 flex flex-wrap gap-2">
            <button type="button" onClick={saveForLater} disabled={isSaving} className="inline-flex min-h-10 items-center gap-2 border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-300 transition hover:border-[#45E3FF] hover:text-white disabled:cursor-wait disabled:opacity-60">
              {isSaved ? <Check className="h-4 w-4 text-[#45E3FF]" /> : <Bookmark className="h-4 w-4" />} {isSaving ? 'Saving…' : isSaved ? 'Saved' : 'Save for later'}
            </button>
            <button type="button" onClick={sharePage} className="inline-flex min-h-10 items-center gap-2 border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-300 transition hover:border-[#45E3FF] hover:text-white">
              {shareLabel === 'Copied' ? <Copy className="h-4 w-4 text-[#45E3FF]" /> : <Share2 className="h-4 w-4" />} {shareLabel}
            </button>
          </div>
          <p className="mb-6 max-w-4xl text-sm leading-relaxed text-gray-400 md:text-base">
            {video?.description || contextEvent?.description || 'Official NaraTV fight-night coverage.'}
          </p>

          {contextFighters.length ? (
            <div className="border border-white/10 bg-[#07111F] p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between gap-4"><p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45E3FF]">Fight context</p>{contextEvent ? <Link href={'/events/' + contextEvent.slug} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white">View event →</Link> : null}</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {contextFighters.slice(0, 4).map((fighter) => <Link key={fighter.id} href={'/boxers/' + (fighter.slug || fighter.id)} className="flex min-w-0 items-center gap-3 border border-white/10 p-2 transition hover:border-[#45E3FF]/60"><NaraImage src={fighter.portrait_url || fighter.image_url} alt={fighter.name} className="h-12 w-12 shrink-0 object-cover" /><span className="min-w-0"><span className="block truncate text-sm font-black uppercase text-white">{fighter.name}</span><span className="block truncate text-[10px] font-bold uppercase tracking-wider text-gray-500">{fighter.record?.display || [fighter.record?.wins ?? fighter.record_wins ?? 0, fighter.record?.losses ?? fighter.record_losses ?? 0, fighter.record?.draws ?? fighter.record_draws ?? 0].join('-')}</span></span></Link>)}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-sm border border-white/5 bg-[#07111F] p-5">
          {isLiveEvent && event?.broadcast_id ? (
            <>
              <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-4">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">Live Interaction</h2>
              </div>
              <ChatTab broadcastId={event.broadcast_id} />
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-4">
                <Play className="h-5 w-5 text-gray-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">{isEventContent ? 'Event Access' : 'Video Details'}</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                {isEventContent ? 'Event passes and replay access are checked before playback opens.' : 'This video plays as an on-demand feature. Live chat is reserved for active live events.'}
              </p>
            </>
          )}
          <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4 text-[#45E3FF]" />
            Your access is checked securely before playback opens.
          </div>
        </aside>
      </section>

      {video && <section className="mx-auto w-full max-w-[1920px] px-4 pb-12 md:px-8"><CommentsTab videoSlug={video.slug} /></section>}

      {showInstantPay && isPremium && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setShowInstantPay(false)}>
          <div className="w-full max-w-md border border-white/10 bg-[#07111F] p-6 shadow-2xl" onClick={(modalEvent) => modalEvent.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#45E3FF]">Instant Access</p>
                <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
              </div>
              <button className="text-sm font-bold uppercase text-gray-400 hover:text-white" onClick={() => setShowInstantPay(false)}>Close</button>
            </div>
            <p className="mb-6 text-sm leading-6 text-gray-300">
              {isPaidEventAccess ? 'Buy an eligible event pass to unlock this stream or replay.' : 'Choose a NaraTV pass to unlock this premium video.'}
            </p>
            <div className="flex flex-col gap-3">
              {getStoredToken() ? (
                <Link href={paymentHref} className="flex items-center justify-center gap-2 rounded-sm bg-[#45E3FF] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black hover:bg-white">
                  <Ticket className="h-4 w-4" /> Continue to Checkout
                </Link>
              ) : (
                <Link href={`/login?next=${encodeURIComponent(`/watch/${slug}`)}`} className="flex items-center justify-center gap-2 rounded-sm bg-[#45E3FF] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black hover:bg-white">
                  Sign In To Continue
                </Link>
              )}
              {isSubscriptionAccess || !isPaidEventAccess ? (
                <Link href="/subscriptions" className="rounded-sm bg-white/10 px-6 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white hover:bg-white/20">View Passes</Link>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {relatedRail && (
        <div className="w-full bg-[#050b12] pb-20 pt-4">
          <ContentRail rail={relatedRail} />
        </div>
      )}
    </main>
  );
}
