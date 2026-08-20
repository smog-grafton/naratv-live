import type {Metadata} from 'next';
import { getFooterNavigation, getPublicSettings } from '@/services/home';
import type { NavigationItem } from '@/services/home';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ContentModalProvider } from '@/components/providers/ContentModalProvider';
import ContentModalRoot from '@/components/modals/ContentModalRoot';
import NavigationFeedback from '@/components/ui/NavigationFeedback';
import { absoluteSiteUrl, socialImage } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings: Record<string, unknown> = await getPublicSettings().catch(() => ({} as Record<string, unknown>));
  const title = String(settings['seo.default_title'] || 'NaraTV Live | Official Boxing Streaming');
  const description = String(settings['seo.default_description'] || 'Watch live fights, official replays, and premium fight coverage on NaraTV.');
  const image = socialImage(typeof settings['seo.default_og_image'] === 'string' ? settings['seo.default_og_image'] : undefined);
  return {
    metadataBase: new URL(absoluteSiteUrl('/')),
    title,
    description,
    openGraph: { title, description, url: absoluteSiteUrl('/'), siteName: 'NaraTV', type: 'website', images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  const settingsPromise = getPublicSettings().catch(() => ({} as Record<string, unknown>));
  const footerNavigationPromise = getFooterNavigation().catch(() => [] as NavigationItem[]);

  return (
    <html lang="en" className="antialiased">
      <body suppressHydrationWarning className="bg-[#050B12] text-white min-h-screen flex flex-col font-sans">
        <ContentModalProvider>
          <SettingsShell settingsPromise={settingsPromise} footerNavigationPromise={footerNavigationPromise}>{children}</SettingsShell>
          <NavigationFeedback />
          <ContentModalRoot />
        </ContentModalProvider>
      </body>
    </html>
  );
}

async function SettingsShell({ settingsPromise, footerNavigationPromise, children }: { settingsPromise: Promise<Record<string, unknown>>; footerNavigationPromise: Promise<NavigationItem[]>; children: React.ReactNode }) {
  const [settings, footerNavigation] = await Promise.all([settingsPromise, footerNavigationPromise]);
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Header initialSettings={settings} />
      <div className="flex-1">{children}</div>
      <Footer initialSettings={settings} navigation={footerNavigation} />
    </div>
  );
}
