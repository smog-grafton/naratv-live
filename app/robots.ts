import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.naratv.live').replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/my-account/', '/payment/', '/checkout/'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
