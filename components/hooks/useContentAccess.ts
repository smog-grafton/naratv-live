import { useState, useCallback } from 'react';
import { Video, Event } from '@/services/types';

export type AccessType = 'free' | 'paid' | 'subscription' | 'ticket_holder' | 'ppv' | 'premium';

export interface WatchOption {
  id: string;
  label: string;
  type: string;
  source_url?: string;
  route?: string;
  is_locked: boolean;
  access_type: AccessType;
  duration?: string;
  price?: number;
  currency?: string;
  source_type?: string;
}

export interface ContentNormalized {
  id: string;
  content_type: 'video' | 'replay' | 'live_event' | 'event' | 'highlight' | 'interview' | 'weigh_in' | 'press_conference';
  title: string;
  slug: string;
  thumbnail_url: string;
  poster_url: string;
  access_type: AccessType;
  is_free: boolean;
  is_paid: boolean;
  requires_subscription: boolean;
  has_access: boolean;
  price?: number;
  currency?: string;
  category?: string;
  date_string?: string;
  duration?: string;
  related_fighter_a?: string;
  related_fighter_b?: string;
  watch_options: WatchOption[];
}

// Function to normalize both Video and Event to a common Content structure for the UI
export function normalizeContent(item: any): ContentNormalized {
  const explicitType = String(item.content_type || item.type || '').toLowerCase();
  const hasVideoSource = Boolean(item.video_url || item.playback_url || item.hls_url || item.replay_url);
  const isEvent = ['event', 'live_event'].includes(explicitType)
    || (!hasVideoSource && Boolean(item.poster_url) && ['upcoming', 'live', 'completed'].includes(String(item.status || '').toLowerCase()));
  const accessType = item.access_type || (item.is_ppv ? 'ppv' : (item.is_premium ? 'subscription' : 'free'));
  const isPremium = Boolean(item.is_premium || item.is_ppv || ['subscription', 'premium', 'ppv', 'ticket_holder', 'paid'].includes(accessType));
  const hasAccess = typeof item.has_access === 'boolean'
    ? item.has_access
    : (typeof item.can_watch === 'boolean' ? item.can_watch : !isPremium);

  let watch_options: WatchOption[] = item.watch_options || [];
  
  if (watch_options.length === 0) {
    if (isEvent) {
       const primaryLabel = item.status === 'completed'
         ? 'Watch Replay'
         : (item.status === 'live' ? 'Watch Live' : (isPremium ? 'Buy Event Pass' : 'Event Details'));
       watch_options = [
         { id: '1', label: primaryLabel, type: 'main', is_locked: !hasAccess && isPremium, access_type: accessType, route: `/watch/${item.slug}`, price: item.price, currency: item.currency },
         { id: '2', label: 'Event Details', type: 'details', is_locked: false, access_type: 'free', route: `/events/${item.slug}` }
       ];
    } else {
       watch_options = [
         { id: '1', label: item.content_type === 'replay' ? 'Full Replay' : 'Watch Now', type: item.content_type || 'video', is_locked: !hasAccess && isPremium, access_type: accessType, route: `/watch/${item.slug}`, price: item.price, currency: item.currency },
       ];
    }
  } else {
    watch_options = watch_options.map((option) => ({
      ...option,
      is_locked: !hasAccess && Boolean(option.is_locked || isPremium),
      label: option.label.toLowerCase().includes('unlock') && option.label.toLowerCase().includes('stream')
        ? (isEvent && item.status === 'live' ? 'Watch Live' : 'Buy Event Pass')
        : option.label,
    }));
  }

  return {
    id: item.id,
    content_type: isEvent ? (item.status === 'live' ? 'live_event' : 'event') : (item.content_type || item.video_type || 'video'),
    title: item.title,
    slug: item.slug,
    thumbnail_url: item.thumbnail_url || item.poster_url,
    poster_url: item.poster_url || item.thumbnail_url,
    access_type: accessType,
    is_free: Boolean(item.is_free || accessType === 'free'),
    is_paid: isPremium,
    requires_subscription: Boolean(item.requires_subscription || ['subscription', 'premium'].includes(accessType)),
    has_access: hasAccess,
    price: item.price,
    currency: item.currency,
    category: item.category,
    date_string: item.start_time || item.published_at,
    duration: item.durations_seconds || item.duration_seconds ? `${Math.floor((item.durations_seconds || item.duration_seconds) / 60)}m` : undefined,
    watch_options
  };
}

export function useContentAccess() {
  const [selectedContent, setSelectedContent] = useState<ContentNormalized | null>(null);

  const checkAccess = useCallback((content: ContentNormalized | WatchOption) => {
    if ('has_access' in content) {
      return content.has_access;
    }
    return !content.is_locked;
  }, []);

  return {
    selectedContent,
    setSelectedContent,
    checkAccess
  };
}
