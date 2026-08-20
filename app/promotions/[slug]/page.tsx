import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Play, Calendar, Trophy, ChevronRight, Lock, Unlock, PlayCircle, Star, BadgeAlert } from 'lucide-react';
import ScrollFadeOverlay from '@/components/blocks/ScrollFadeOverlay';
import ContentRail from '@/components/blocks/ContentRail';
import { getPromotionsRails } from '@/services/home';
import NaraImage from '@/components/media/NaraImage';
import { shareMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const displayName = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return shareMetadata({
    title: displayName + ' | NaraTV',
    description: displayName + ' fight nights, event replays, and boxing coverage on NaraTV.',
    path: '/promotions/' + slug,
  });
}

export default async function PromoterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rails = (await getPromotionsRails());
  
  // Create a display name (e.g. matchroom-boxing -> Matchroom Boxing)
  const displayName = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-nara-black">
      {/* Cinematic Hero */}
      <div className="relative w-full h-[60vh] md:h-[75vh] 2xl:h-[80vh] flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <NaraImage src={null} alt={displayName} className="w-full h-full object-cover object-top opacity-60 grayscale-[0.3]" />
          <div className="absolute inset-0 bg-gradient-to-t from-nara-black via-nara-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-nara-black/90 via-nara-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-12 pb-12 md:pb-24 pt-44">
          <div className="max-w-3xl flex flex-col items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-4 leading-none break-words">
              {displayName}
            </h1>
            <p className="text-gray-300 text-sm md:text-lg mb-8 max-w-xl font-medium leading-relaxed">
              {displayName} brings fight nights, rising fighters, full event replays, interviews, and ringside coverage to Nara TV Live.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/subscriptions" className="bg-[#172338]/80 backdrop-blur-md text-white border border-[#22314B] font-bold uppercase tracking-wider py-4 md:py-4 px-10 rounded-sm text-sm hover:bg-[#22314B] transition-colors text-center text-nowrap">
                Subscribe & Watch
              </Link>
            </div>
            
            <div className="flex items-center gap-6 mt-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm px-6 py-4">
               <div>
                  <div className="text-2xl font-black text-white">42</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Events</div>
               </div>
               <div className="w-px h-8 bg-white/20"></div>
               <div>
                  <div className="text-2xl font-black text-white">120+</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Fighters</div>
               </div>
               <div className="w-px h-8 bg-white/20"></div>
               <div>
                  <div className="text-2xl font-black text-nara-red">3</div>
                  <div className="text-[10px] text-nara-red uppercase tracking-widest font-bold">Upcoming</div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollFadeOverlay />

      <div className="w-full relative z-20 pb-24 space-y-2 lg:space-y-4">
        {rails.map((rail: any, idx: number) => (
          <ContentRail key={rail.id} rail={rail} index={idx} />
        ))}
      </div>
    </div>
  );
}
