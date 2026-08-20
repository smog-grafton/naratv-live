export interface SeoMeta {
  title?: string;
  description?: string;
  canonical?: string;
  og_image?: string;
}

export interface CmsPage {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  body: string;
  published_at?: string | null;
  updated_at?: string | null;
  show_in_header?: boolean;
  show_in_footer?: boolean;
  navigation_group?: string | null;
  seo?: SeoMeta & {
    robots_index?: boolean;
    robots_follow?: boolean;
  };
}

export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  ring_name?: string;
  is_featured?: boolean;
  avatar_url?: string;
  image_url?: string;
  portrait_url?: string;
  backdrop_url?: string;
  slug?: string;
  global_ranking?: number | null;
  weight_class?: string;
  country?: string;
  nationality?: string;
  stance?: string;
  height?: string;
  reach?: string;
  age?: number;
  bio?: string;
  record_wins?: number;
  record_losses?: number;
  record_draws?: number;
  knockouts?: number;
  record?: {
    wins: number;
    losses: number;
    draws: number;
    knockouts?: number;
    ko_wins?: number;
    display?: string;
  };
  related_events?: Event[];
  videos?: Video[];
  seo?: SeoMeta;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail_url: string;
  video_url?: string | null;
  hls_url?: string | null;
  replay_url?: string | null;
  playback_url?: string | null;
  source_type?: string | null;
  is_premium: boolean;
  is_live?: boolean;
  is_free?: boolean;
  has_access?: boolean;
  can_watch?: boolean;
  requires_subscription?: boolean;
  access_type?: 'free' | 'paid' | 'subscription' | 'ticket_holder' | 'ppv' | 'premium';
  category?: string;
  source_label?: string;
  published_at?: string;
  durations_seconds?: number;
  duration_seconds?: number;
  content_type?: string;
  progress?: number; // 0-100%
  price?: number;
  currency?: string;
  watch_url?: string;
  purchase_url?: string | null;
  subscription_url?: string | null;
  watch_options?: WatchOption[];
  event?: Event;
  fighters?: Fighter[];
  replay_unavailable?: boolean;
  seo?: SeoMeta;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image_url?: string | null;
  content_type?: string | null;
  is_featured?: boolean;
  published_at?: string | null;
  event?: Event | null;
  fighter?: Fighter | null;
  categories?: Array<{ id: string | number; name: string; slug?: string } | string>;
  tags?: Array<{ id: string | number; name: string; slug?: string } | string>;
  seo?: SeoMeta;
}

export interface Event {
  id: string;
  title: string;
  name?: string;
  slug: string;
  poster_url: string;
  thumbnail_url?: string;
  banner_url?: string;
  featured_image_url?: string;
  description?: string;
  tagline?: string;
  start_time?: string | null;
  starts_at?: string | null;
  venue?: string;
  city?: string;
  country?: string;
  timezone?: string;
  is_live: boolean;
  is_ppv: boolean;
  is_featured?: boolean;
  is_free?: boolean;
  fighter_a?: Fighter;
  fighter_b?: Fighter;
  fighters?: Fighter[];
  fight_card?: FightBout[];
  main_bout?: FightBout;
  status: 'upcoming' | 'live' | 'completed';
  price?: number;
  currency?: string;
  source_label?: string;
  category?: string;
  progress?: number; // 0-100%
  access_type?: 'free' | 'paid' | 'subscription' | 'ticket_holder' | 'ppv';
  watch_url?: string;
  purchase_url?: string | null;
  subscription_url?: string | null;
  replay_url?: string | null;
  streaming?: {
    has_stream?: boolean;
    stream_status?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
    watch_url?: string;
    replay_available?: boolean;
  };
  broadcast_id?: number | string | null;
  tickets?: Array<{
    id: number | string;
    name: string;
    slug?: string;
    price?: number;
    currency?: string;
    remaining_quantity?: number | null;
    max_per_purchase?: number;
    on_sale?: boolean;
    grants_live_access?: boolean;
    grants_replay_access?: boolean;
    allows_venue_entry?: boolean;
    access_type?: string;
  }>;
  videos?: Video[];
  watch_options?: WatchOption[];
  seo?: SeoMeta;
}

export interface FightBout {
  id: number | string;
  bout_order?: number;
  status?: string;
  weight_class?: string | null;
  rounds?: number | null;
  is_main_event?: boolean;
  title_fight?: boolean;
  belt_title?: string | null;
  red_corner?: Fighter;
  blue_corner?: Fighter;
  winner?: Fighter;
  notes?: string | null;
  result?: {
    result?: string | null;
    method?: string | null;
    round?: number | null;
    time?: string | null;
    details?: string | null;
  };
}

export interface WatchOption {
  id: string;
  label: string;
  type: string;
  source_url?: string;
  route?: string;
  is_locked: boolean;
  access_type: 'free' | 'paid' | 'subscription' | 'ticket_holder' | 'ppv' | 'premium';
  duration?: string;
  price?: number;
  currency?: string;
  source_type?: string;
}

export interface SubscriptionPlan {
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;
  duration_days: number;
  price: number;
  currency: string;
  formatted_price?: string;
  features: string[];
  unlocks_live_events?: boolean;
  unlocks_replays?: boolean;
  unlocks_paid_videos?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

export interface PaymentGateway {
  id: number | string;
  code: 'iotec' | 'flutterwave' | string;
  name?: string;
  display_name?: string;
  public_label?: string;
  button_label?: string;
  instructions?: string | null;
  is_default?: boolean;
  supports_mobile_money?: boolean;
  supports_card?: boolean;
  supported_currencies?: string[];
}

export interface AccessResponse {
  has_access: boolean;
  can_watch?: boolean;
  reason: string;
  access_type: string;
  requires_payment: boolean;
  requires_subscription: boolean;
  login_required?: boolean;
  purchase_url?: string | null;
  subscription_url?: string | null;
  playback_url?: string | null;
  source_type?: string | null;
}

export interface SearchResult {
  id: string;
  type: 'video' | 'event' | 'fighter' | 'live' | 'replay' | 'promoter' | string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  url: string;
  label?: string | null;
}

export interface ContentRail {
  id: string;
  title: string;
  titlePrefix?: string;
  items: (Video | Event)[];
  type: 'mixed' | 'videos' | 'events';
  layout?: 'banner' | 'poster' | 'video' | 'square' | 'featured-event';
  badge?: string;
  description?: string;
  backgroundImage?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export interface RankingEntry {
  rank: number;
  movement?: number | 'NEW' | null;
  fighter: Fighter;
}

export interface RankingResponse {
  organization: string;
  label: string;
  updated_at?: string | null;
  divisions: string[];
  entries: RankingEntry[];
}
