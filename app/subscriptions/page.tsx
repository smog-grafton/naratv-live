import Link from 'next/link';
import { Check } from 'lucide-react';
import { getPlans } from '@/services/home';

export const revalidate = 60;

export default async function SubscriptionsPage() {
  let loadFailed = false;
  const plans = await getPlans().catch(() => {
    loadFailed = true;
    return [];
  });
  const sortedPlans = plans.slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.price - b.price);
  const popularIndex = sortedPlans.length > 1 ? 1 : 0;

  return (
    <main className="min-h-[70vh] bg-nara-black px-4 pb-24 pt-24 md:px-6">
      <div className="max-w-[1920px] mx-auto border-b border-nara-border pb-4 mb-12">
        <h1 className="text-2xl font-bold text-white">Choose your plan</h1>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Unlimited Boxing.</h2>
          <p className="text-nara-text-muted text-lg max-w-xl mx-auto">
            Choose the pass that fits your fight night: live cards, premium replays, originals, and exclusive boxing coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {sortedPlans.map((plan, index) => {
            const popular = index === popularIndex;
            const price = plan.formatted_price || `${plan.currency} ${Number(plan.price).toLocaleString()}`;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col p-8 md:p-10 rounded-[2px] border ${
                  popular ? 'border-nara-red bg-[#0B1626]' : 'border-[#172338] bg-nara-black'
                }`}
              >
                {popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-nara-red text-white text-[11px] font-bold px-4 py-1.5 uppercase tracking-[0.2em] rounded-sm">
                    Best Value
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white tracking-tighter">{price}</span>
                </div>
                <p className="text-gray-400 text-sm mb-8 min-h-12">{plan.description || `${plan.duration_days} days of NaraTV access.`}</p>

                <div className="border-t border-[#172338] pt-8 mb-10 flex-grow">
                  <ul className="flex flex-col gap-5">
                    {(Array.isArray(plan.features) && plan.features.length ? plan.features : [
                      plan.unlocks_live_events ? 'Live event access' : null,
                      plan.unlocks_replays ? 'Replay archive access' : null,
                      plan.unlocks_paid_videos ? 'Paid video access' : null,
                    ].filter(Boolean) as string[]).map((feature) => (
                      <li key={feature} className="flex items-start gap-4 text-sm font-medium text-gray-300">
                        <Check className="text-nara-red flex-shrink-0 w-5 h-5" strokeWidth={3} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/checkout?plan=${plan.slug}`}
                  className={`w-full py-4 text-center rounded-sm font-bold uppercase tracking-wider text-sm transition-colors ${
                    popular ? 'bg-nara-red text-white hover:bg-nara-red/90' : 'bg-white text-nara-black hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            );
          })}
        </div>

        {sortedPlans.length === 0 && (
          <div className="w-full max-w-2xl border border-white/10 bg-[#0B1626] p-10 text-center">
            <h3 className="text-xl font-black text-white uppercase">{loadFailed ? 'Plans are taking a break' : 'No active plans'}</h3>
            <p className="mt-2 text-gray-400">{loadFailed ? 'We could not load the passes right now. Please try again.' : 'New NaraTV passes are being prepared. Check back soon for the next fight-night offer.'}</p>
            {loadFailed ? <Link href="/subscriptions" className="mt-6 inline-flex bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-gray-200">Try again</Link> : null}
          </div>
        )}
      </div>
    </main>
  );
}
