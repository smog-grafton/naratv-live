import Image from 'next/image';
import Link from 'next/link';
import logoImage from '@/app/logo.png';
import { IconGlobe } from '@/components/icons';
import { getNarapromoUrl, NavigationItem } from '@/services/home';

const fallbackGroups: Record<string, NavigationItem[]> = {
  Watch: [
    { id: 'live', key: 'live', label: 'Live TV', href: '/live' },
    { id: 'schedule', key: 'schedule', label: 'Schedule', href: '/schedule' },
    { id: 'events', key: 'events', label: 'Events & PPV', href: '/events' },
    { id: 'replays', key: 'replays', label: 'Replays', href: '/replays' },
  ],
  Support: [
    { id: 'support', key: 'support', label: 'Help Center', href: '/support' },
    { id: 'contact', key: 'contact', label: 'Contact Us', href: '/contact' },
    { id: 'refunds', key: 'refunds', label: 'Refund Policy', href: '/refunds' },
  ],
  About: [
    { id: 'about', key: 'about', label: 'About NaraTV', href: '/about' },
    { id: 'partners', key: 'partners', label: 'Partner With NaraTV', href: '/partners' },
  ],
};

function FooterLink({ item }: { item: NavigationItem }) {
  const external = item.link_type === 'external' || /^https?:\/\//i.test(item.href);
  return external ? (
    <a href={item.href} target={item.open_in_new_tab ? '_blank' : undefined} rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined} className="transition-colors hover:text-nara-cyan">{item.label}</a>
  ) : (
    <Link href={item.href} className="transition-colors hover:text-nara-cyan">{item.label}</Link>
  );
}

export default function Footer({ initialSettings = {}, navigation = [] }: { initialSettings?: Record<string, unknown>; navigation?: NavigationItem[] }) {
  const narapromoUrl = getNarapromoUrl();
  const siteName = typeof initialSettings['site.name'] === 'string' ? initialSettings['site.name'] : 'NaraTV';
  const description = typeof initialSettings['site.description'] === 'string' ? initialSettings['site.description'] : 'The premier streaming destination for live boxing, replays, and pay-per-view events.';
  const supportEmail = typeof initialSettings['contact.support_email'] === 'string' ? initialSettings['contact.support_email'] : (typeof initialSettings['site.support_email'] === 'string' ? initialSettings['site.support_email'] : 'support@naratv.live');
  const groups = Object.fromEntries(Object.entries(fallbackGroups).map(([key, items]) => [key, [...items]])) as Record<string, NavigationItem[]>;
  navigation.forEach((item) => {
    const group = ['Legal', 'Company', 'Partners'].includes(item.navigation_group || '') ? 'About' : (item.navigation_group || 'About');
    groups[group] = groups[group] || [];
    if (!groups[group].some((existing) => existing.href === item.href)) groups[group].push(item);
  });
  const visibleGroups = groups;

  return (
    <footer className="relative z-10 mt-auto w-full border-t border-nara-border bg-[#07111F] pt-12 pb-8">
      <div className="mx-auto max-w-[1920px] px-4 md:px-6">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="relative mb-4 block h-12 w-[168px] overflow-hidden" aria-label="NaraTV home">
              <Image src={logoImage} alt={siteName} fill sizes="168px" className="object-contain object-left" />
            </Link>
            <p className="mb-6 max-w-xs text-sm text-zinc-100">{description}</p>
            <div className="flex items-center gap-2 text-sm text-zinc-100"><IconGlobe className="h-4 w-4" /><span>Uganda | English</span></div>
          </div>
          {Object.entries(visibleGroups).slice(0, 3).map(([group, items]) => (
            <div key={group}>
              <h3 className="mb-4 font-medium text-white">{group}</h3>
              <ul className="flex flex-col gap-3 text-sm text-zinc-100">
                {items.slice(0, 8).map((item) => <li key={item.key || item.id}><FooterLink item={item} /></li>)}
                {group === 'Support' ? <li><a href={'mailto:' + supportEmail} className="transition-colors hover:text-nara-cyan">{supportEmail}</a></li> : null}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-xs text-zinc-100 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-end">
            <Link href="/terms" className="transition-colors hover:text-nara-cyan">Terms of Use</Link>
            <Link href="/privacy" className="transition-colors hover:text-nara-cyan">Privacy Policy</Link>
            <Link href="/cookies" className="transition-colors hover:text-nara-cyan">Cookies</Link>
            <a href={narapromoUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-nara-cyan">Nara Promotionz</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
