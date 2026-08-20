import { useEffect, useState } from 'react';

export function useBodyScrollLock() {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (isLocked) {
      // Store original style before changing
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPadding = window.getComputedStyle(document.body).paddingRight;
      
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [isLocked]);

  return { isLocked, setIsLocked };
}
