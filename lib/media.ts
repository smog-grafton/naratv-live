const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8001/api/v1').replace(/\/$/, '');
const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, '');
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || process.env.NEXT_PUBLIC_NARAPROMO_URL || API_ORIGIN).replace(/\/$/, '');

/** Resolve API media paths without ever passing empty or obviously invalid URLs to the browser. */
export function resolveMediaUrl(value?: string | null): string | null {
  const source = typeof value === 'string' ? value.trim() : '';
  if (!source || /^(undefined|null|javascript:|about:blank)$/i.test(source)) return null;
  if (/^(https?:\/\/|data:|blob:|\/\/)/i.test(source)) return source;
  if (source.startsWith('/')) return `${MEDIA_BASE}${source}`;
  return `${MEDIA_BASE}/${source.replace(/^\/+/, '')}`;
}
