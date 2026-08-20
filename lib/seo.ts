import type { Metadata } from 'next';
import logoImage from '@/app/logo.png';

const siteUrl = process.env.NEXT_PUBLIC_NARATV_URL || 'http://localhost:3001';

export function absoluteSiteUrl(value: string) {
  try {
    return new URL(value, siteUrl).toString();
  } catch {
    return siteUrl;
  }
}

export function socialImage(value?: string | null) {
  const candidate = value?.trim();
  if (!candidate) return absoluteSiteUrl(logoImage.src);
  try {
    const url = new URL(candidate, siteUrl);
    if (!['http:', 'https:'].includes(url.protocol)) return absoluteSiteUrl(logoImage.src);
    return url.toString();
  } catch {
    return absoluteSiteUrl(logoImage.src);
  }
}

export function shareMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string | null;
  modifiedTime?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}): Metadata {
  const image = socialImage(input.image);
  const url = absoluteSiteUrl(input.path);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: 'NaraTV',
      type: input.type || 'website',
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image],
    },
    ...(input.robotsIndex !== undefined || input.robotsFollow !== undefined
      ? { robots: { index: input.robotsIndex ?? true, follow: input.robotsFollow ?? true } }
      : {}),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NaraTV',
    url: siteUrl,
    logo: socialImage(),
  };
}
