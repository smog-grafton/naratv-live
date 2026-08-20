import type { Metadata } from 'next';
import { Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';
import { getCmsPage, getContactSettings } from '@/services/home';
import type { ContactSettings } from '@/services/home';
import { shareMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('contact').catch(() => null);
  return shareMetadata({ title: page?.seo?.title || page?.title || 'Contact NaraTV', description: page?.seo?.description || page?.excerpt || 'Contact NaraTV support, partnerships, and rights teams.', path: '/contact', image: page?.seo?.og_image, robotsIndex: page?.seo?.robots_index, robotsFollow: page?.seo?.robots_follow });
}

function safeMapUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ['www.google.com', 'maps.google.com', 'google.com'].includes(url.hostname) && url.pathname.startsWith('/maps') ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getCmsPage('contact').catch(() => null),
    getContactSettings().catch(() => ({} as ContactSettings)),
  ]);
  const email = settings['contact.primary_email'] || settings['contact.support_email'] || 'support@naratv.live';
  const phone = settings['contact.primary_phone'];
  const mapUrl = safeMapUrl(settings['contact.maps_embed_url']);

  return (
    <main className="min-h-screen bg-[#050b12] pt-24 pb-20 text-white">
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#45E3FF]">Contact</p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">{page?.title || 'Talk to NaraTV'}</h1>
            <p className="mt-5 text-base leading-relaxed text-zinc-300">{page?.excerpt || 'Send a support request for streams, replays, ticket access, subscriptions, or account issues.'}</p>
            <div className="mt-10 space-y-5 text-sm text-zinc-200">
              <div className="flex gap-3"><Mail className="h-5 w-5 text-[#45E3FF]" /><a href={'mailto:' + email} className="hover:text-[#45E3FF]">{email}</a></div>
              {phone ? <div className="flex gap-3"><Phone className="h-5 w-5 text-[#45E3FF]" /><a href={'tel:' + phone.replace(/\s+/g, '')} className="hover:text-[#45E3FF]">{phone}</a></div> : null}
              <div className="flex gap-3"><MapPin className="h-5 w-5 text-[#45E3FF]" /><span>{settings['contact.address'] || 'Kampala, Uganda'}</span></div>
              <div className="flex gap-3"><MessageSquare className="h-5 w-5 text-[#45E3FF]" /><span>{settings['contact.office_hours'] || 'Replies are handled by the NaraTV support team.'}</span></div>
            </div>
            {mapUrl ? <div className="mt-8 overflow-hidden border border-white/10"><iframe title="NaraTV location map" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full border-0" /></div> : null}
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
