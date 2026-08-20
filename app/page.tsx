import { getHeroEvents, getHomeRails, getNavigation } from '@/services/home';
import HeroCarousel from '@/components/blocks/HeroCarousel';
import ContentRail from '@/components/blocks/ContentRail';
import ScrollFadeOverlay from '@/components/blocks/ScrollFadeOverlay';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const [heroEvents, rails, navigation] = await Promise.all([
    getHeroEvents(),
    getHomeRails(),
    getNavigation(),
  ]);

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-nara-black">
      {/* Sticky Hero Background */}
      <div className="sticky top-0 left-0 w-full z-0 h-screen overflow-hidden">
         <HeroCarousel events={heroEvents} navigation={navigation} />
      </div>
      
      {/* This overlay darkens the HeroCarousel as the page scrolls */}
      <ScrollFadeOverlay />

      {/* Content Rails scrolling over the sticky background */}
      <div className="relative flex flex-col gap-2 mt-[-2vh] md:mt-[-5vh] pt-4 md:pt-8 z-10 bg-[linear-gradient(to_bottom,transparent,rgba(10,10,12,0.9)_2vh,#050B12_8vh)] pb-12">
        <div className="absolute top-[20%] left-[-10%] w-[50%] max-w-[800px] aspect-square rounded-full bg-nara-red/5 blur-[150px] pointer-events-none" />
        <div className="absolute top-[60%] right-[-10%] w-[60%] max-w-[1000px] aspect-square rounded-full bg-blue-900/5 blur-[150px] pointer-events-none" />

        <div className="w-full relative z-20">
          {rails.map((rail, index) => (
            <ContentRail key={rail.id} rail={rail} index={index} />
          ))}
        </div>

        {/* Subscription Plans Promo Section */}
        <section className="max-w-[1920px] mx-auto px-4 md:px-8 mt-16 md:mt-24 w-full z-20 relative">
          <div className="bg-[#0B1626]/80 backdrop-blur-md rounded-none p-6 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-l-nara-red shadow-2xl">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Never miss a fight.</h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                Get access to live boxing, full event replays, exclusive interviews, and the entire Nara TV library. Available anytime, anywhere.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register"
                className="bg-white hover:bg-gray-200 text-nara-black font-bold uppercase tracking-wider py-4 md:py-4 px-10 rounded-[2px] text-center transition-colors text-sm"
              >
                Sign Up
              </Link>
              <Link 
                href="/subscriptions"
                className="bg-[#172338] hover:bg-[#22314B] text-white font-bold uppercase tracking-wider py-4 md:py-4 px-10 rounded-[2px] text-center transition-colors text-sm border border-transparent"
              >
                Explore Plans
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
