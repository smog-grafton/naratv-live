'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ContentRail as ContentRailType } from '@/services/types';
import VideoCard from './VideoCard';
import { IconChevronLeft, IconChevronRight } from '@/components/icons';
import NaraImage from '@/components/media/NaraImage';

import { motion } from 'motion/react';

export default function ContentRail({ rail, index = 0 }: { rail: ContentRailType, index?: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [rail.items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Scroll by 80% of container width to show previous/next item partially
      const scrollAmount = direction === 'left' ? -(clientWidth * 0.8) : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!rail.items || rail.items.length === 0) return null;

  // Compute widths based on layout
  let itemWidthClasses = "w-[260px] sm:w-[280px] md:w-[320px] lg:w-[360px]"; // default video
  switch (rail.layout) {
    case 'banner':
      itemWidthClasses = "w-[300px] sm:w-[480px] md:w-[640px] lg:w-[800px] xl:w-[960px]";
      break;
    case 'poster':
      itemWidthClasses = "w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px]";
      break;
    case 'square':
      itemWidthClasses = "w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px]";
      break;
    case 'featured-event':
      itemWidthClasses = "w-[260px] sm:w-[280px] md:w-[320px] lg:w-[360px]"; // uses standard video cards
      break;
  }

  if (rail.layout === 'featured-event') {
    return (
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full relative mt-8 mb-12"
      >
        {/* Background Image Setup */}
        {rail.backgroundImage && (
          <div className="absolute inset-0 z-0">
             <NaraImage src={rail.backgroundImage} alt={rail.title} className="w-full h-full object-cover object-top opacity-50" />
             {/* Gradients */}
             <div className="absolute inset-0 bg-gradient-to-r from-nara-black via-nara-black/80 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-t from-nara-black via-nara-black/20 to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 px-4 md:px-8 max-w-[1920px] mx-auto pt-12 md:pt-20 pb-4">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div className="max-w-2xl">
              {rail.badge && (
                <div className="bg-[#6F88FC] text-black text-xs md:text-sm font-bold px-2 py-0.5 rounded-sm inline-block mb-4 uppercase tracking-wider">
                  {rail.badge}
                </div>
              )}
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">{rail.title}</h2>
              {rail.description && (
                <p className="text-gray-300 text-base md:text-lg max-w-xl">{rail.description}</p>
              )}
            </div>

            {/* Desktop Controls overlaying right side */}
            <div className="hidden items-center gap-2 mb-2 md:flex">
              {rail.viewAllHref ? <Link href={rail.viewAllHref} className="mr-2 inline-flex items-center border border-white/20 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:border-[#45E3FF]/60 hover:text-[#45E3FF]">{rail.viewAllLabel || 'View all'}</Link> : null}
              <button 
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-black/50 border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors backdrop-blur-sm"
                aria-label="Scroll left"
              >
                <IconChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-black/50 border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors backdrop-blur-sm"
                aria-label="Scroll right"
              >
                <IconChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="relative group w-full -mx-4 md:-mx-8 md:px-4">
            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex overflow-x-auto gap-4 px-4 pb-6 snap-x snap-mandatory hide-scrollbar overscroll-x-contain"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {rail.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex-none ${itemWidthClasses} snap-start`}
                >
                  <VideoCard item={item} layout="video" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.3) }}
      className="w-full py-4 md:py-6"
    >
      <div className="flex items-end justify-between px-4 md:px-8 max-w-[1920px] mx-auto mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
            {rail.titlePrefix && (
              <>
                <span className="text-[#45E3FF]">{rail.titlePrefix}</span>
                <span className="text-gray-600 font-normal pb-1">|</span>
              </>
            )}
            <span>{rail.title}</span>
          </h2>
          {rail.description && (
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mt-1 line-clamp-2 md:line-clamp-none">
              {rail.description}
            </p>
          )}
        </div>
        
        {/* Desktop Controls */}
        <div className="hidden items-center gap-2 md:flex">
          {rail.viewAllHref ? (
            <Link href={rail.viewAllHref} className="mr-2 inline-flex items-center border border-white/20 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:border-[#45E3FF]/60 hover:text-[#45E3FF]">
              {rail.viewAllLabel || 'View all'}
            </Link>
          ) : null}
          <button 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            aria-label="Scroll left"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            aria-label="Scroll right"
          >
            <IconChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative group w-full max-w-[1920px] mx-auto md:px-4">
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-4 px-4 pb-6 snap-x snap-mandatory hide-scrollbar overscroll-x-contain"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {rail.items.map((item) => (
            <div 
              key={item.id} 
              className={`flex-none ${itemWidthClasses} snap-start`}
            >
              <VideoCard item={item} layout={rail.layout as "banner" | "poster" | "video" | "square"} />
            </div>
          ))}
        </div>
      </div>

      {rail.viewAllHref ? (
        <div className="px-4 md:hidden">
          <Link href={rail.viewAllHref} className="inline-flex min-h-10 items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#45E3FF]">
            {rail.viewAllLabel || 'View all'} <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : null}
    </motion.section>
  );
}
