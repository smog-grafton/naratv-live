'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationFeedback() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [pathname]);

  useEffect(() => {
    let timeout: number | undefined;

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest('a') : null;
      if (!target || target.target === '_blank' || target.hasAttribute('download')) return;

      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname && destination.search === window.location.search) return;

      setPending(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setPending(false), 12000);
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      window.clearTimeout(timeout);
    };
  }, []);

  if (!pending) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[220] h-0.5 bg-nara-cyan/20" role="status" aria-label="Loading next page">
      <div className="h-full w-1/3 animate-[nara-progress_1.2s_ease-in-out_infinite] bg-nara-cyan shadow-[0_0_12px_rgba(69,227,255,0.8)]" />
    </div>
  );
}
