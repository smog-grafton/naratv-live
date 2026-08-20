'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event } from '@/services/types';
import { IconChevronLeft, IconChevronRight, IconPlay, IconGlobe } from '@/components/icons';
import { Home, Radio, Clapperboard, Zap, Mic, Archive, User, Trophy } from 'lucide-react';
import { useResponsiveContentModal } from '@/components/providers/ContentModalProvider';
import { NavigationItem } from '@/services/home';
import NaraImage from '@/components/media/NaraImage';

const iconMap = { Home, Radio, Clapperboard, Zap, Mic, Archive, User, Trophy };

export default function HeroCarousel({ events = [], navigation = [] }: { events?: Event[]; navigation?: NavigationItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { openContentModal } = useResponsiveContentModal();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [events.length]);

  const next = () => setCurrentIndex((p) => (p === events.length - 1 ? 0 : p + 1));
  const prev = () => setCurrentIndex((p) => (p === 0 ? events.length - 1 : p - 1));

  if (!events || events.length === 0) return null;

  return (
    <div className="relative w-full h-full bg-nara-surface overflow-hidden group">
      {events.map((event, idx) => (
        <div 
          key={event.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background Image - Full bleed */}
          <div className="absolute inset-0">
            <NaraImage src={event.poster_url} alt={event.title} className="w-full h-full object-cover object-top md:object-center" />
            {/* Desktop Gradient: Strong left gradient and bottom gradient */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-nara-surface via-nara-surface/60 to-transparent w-[70%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-nara-surface via-nara-surface/40 to-transparent" />
            <div className="absolute inset-0 bg-black/10" />
            {/* Mobile Gradient: Strong bottom gradient */}
            <div className="md:hidden absolute inset-0 bg-gradient-to-t from-nara-surface via-nara-surface/80 to-transparent h-[70%] top-auto" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:px-12 lg:px-16 w-full mx-auto pt-24 md:pt-32 pb-[24vh] md:pb-[28vh] lg:pb-[30vh]">
            <div className="w-full md:max-w-2xl lg:max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 mt-auto">
              
              {/* Event Badge / Logo Area */}
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                {event.is_live ? (
                  <span className="bg-nara-red text-white text-[11px] font-bold px-2 py-0.5 tracking-wider uppercase flex items-center gap-1.5 rounded-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Live Now
                  </span>
                ) : event.status === 'upcoming' ? (
                  <span className="bg-white text-nara-black text-[11px] font-bold px-2 py-0.5 tracking-wider uppercase rounded-sm">
                    Upcoming Event
                  </span>
                ) : (
                  <span className="bg-white text-nara-black text-[11px] font-bold px-2 py-0.5 tracking-wider uppercase rounded-sm">
                    Special Offer
                  </span>
                )}
              </div>

              {/* Title & Fighters */}
              <h1 className="text-4xl md:text-6xl lg:text-[72px] font-bold tracking-tight mb-4 md:mb-5 text-white drop-shadow-md text-balance md:text-wrap leading-[1.1]">
                {event.fighter_a && event.fighter_b ? (
                  isMobile ? (
                    <div className="flex flex-col">
                      <span>{event.fighter_a.name} vs</span>
                      <span>{event.fighter_b.name}</span>
                    </div>
                  ) : (
                    <span>{event.fighter_a.name} vs {event.fighter_b.name}</span>
                  )
                ) : (
                  event.title
                )}
              </h1>
              
              <p className="text-gray-300 text-sm md:text-lg mb-6 lg:mb-8 max-w-xl line-clamp-3 md:line-clamp-none">
                {event.fighter_a ? event.title : 'Only one will lift the belt. Watch the ultimate prize, only on Nara TV.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => openContentModal(event)}
                  className="w-full sm:w-auto bg-white hover:bg-gray-200 text-black font-bold py-3 md:py-3.5 px-8 rounded-[4px] transition-colors text-center text-sm md:text-base flex justify-center items-center gap-2"
                >
                  <IconPlay className="w-5 h-5 fill-current" />
                  {event.status === 'live' || event.status === 'completed' ? 'Watch Now' : 'Watch Options'}
                </button>
                
                {event.is_ppv && event.status !== 'completed' && (
                  <button 
                    onClick={() => openContentModal(event)}
                    className="w-full sm:w-auto bg-[#111D2E] hover:bg-[#172338] text-white font-bold py-3 md:py-3.5 px-8 rounded-[4px] transition-colors text-center text-sm md:text-base border border-[#172338] hidden sm:block"
                  >
                    Buy PPV <span className="opacity-70 ml-1 font-normal hidden md:inline">UGX {event.price?.toLocaleString()}</span>
                  </button>
                )}
              </div>

              {/* Dots */}
              {events.length > 1 && (
                <div className="flex items-center gap-2 mt-6 md:mt-8">
                  {events.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 md:w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* category strip overlay at the bottom */}
      <div className="absolute bottom-[2vh] md:bottom-[4vh] left-0 w-full z-20 pb-4 px-4 md:px-12 hide-scrollbar overflow-x-auto">
        <div className="flex items-center gap-2 md:gap-4 min-w-max">
          {navigation.map((cat, i) => {
            const IconComponent = iconMap[(cat.icon || 'Home') as keyof typeof iconMap] || Home;
            return (
              <Link href={cat.href} key={cat.key} className="bg-nara-black/80 hover:bg-[#172338] transition-colors border border-nara-border backdrop-blur-sm rounded-[4px] px-4 md:px-6 py-2 md:py-3 flex items-center justify-center gap-3 cursor-pointer min-w-[120px] md:min-w-[160px]">
                <IconComponent className="w-5 h-5 text-white" />
                <span className="text-white text-xs md:text-sm font-bold tracking-tight">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Arrows overlay side - raise to match layout */}
      <div className="hidden md:flex absolute right-12 bottom-[24vh] lg:bottom-[28vh] z-20 items-center gap-3">
        <button 
          onClick={prev}
          className="w-10 h-10 flex items-center justify-center bg-nara-black hover:bg-[#172338] text-white rounded-full transition-colors border border-nara-border"
        >
          <IconChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={next}
          className="w-10 h-10 flex items-center justify-center bg-nara-black hover:bg-[#172338] text-white rounded-full transition-colors border border-nara-border"
        >
          <IconChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
