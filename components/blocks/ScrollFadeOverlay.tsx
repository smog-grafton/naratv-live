'use client';

import React, { useEffect, useState } from 'react';

export default function ScrollFadeOverlay() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Darkens between 0 and 500px scroll
      const currentScroll = window.scrollY;
      const calculatedOp = Math.min(currentScroll / 500, 0.85); // caps at 0.85
      setOpacity(calculatedOp);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="absolute inset-0 bg-nara-black pointer-events-none z-[1]" 
      style={{ opacity }} 
    />
  );
}
