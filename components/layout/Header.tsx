'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logoImage from '@/app/logo.png';
import { IconSearch, IconMenu, IconClose } from '@/components/icons';
import AccountDropdown from '@/components/auth/AccountDropdown';
import { PlayCircle } from 'lucide-react';
import { clearSession, getHeaderNavigation, getLiveNow, getMe, getStoredToken, getStoredUser, logout, NavigationItem } from '@/services/home';
import { Event } from '@/services/types';

export default function Header({ initialSettings = {} }: { initialSettings?: Record<string, unknown> }) {
  const siteName = typeof initialSettings['site.name'] === 'string' ? initialSettings['site.name'] : 'NaraTV';
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [liveEvent, setLiveEvent] = useState<Event | null>(null);
  const [navLinks, setNavLinks] = useState<NavigationItem[]>([
    { id: 'home', key: 'home', label: 'Home', href: '/' },
    { id: 'live', key: 'live-cards', label: 'Live Cards', href: '/live' },
    { id: 'replays', key: 'replays', label: 'Replays', href: '/replays' },
  ]);
  useEffect(() => {
    setMounted(true);
    const token = getStoredToken();
    setIsLoggedIn(Boolean(token && getStoredUser()));

    getHeaderNavigation()
      .then(setNavLinks)
      .catch(() => null);

    getLiveNow()
      .then(setLiveEvent)
      .catch(() => setLiveEvent(null));

    if (token) {
      getMe(token)
        .then(() => setIsLoggedIn(true))
        .catch(() => {
          clearSession();
          setIsLoggedIn(false);
        });
    }
  }, [pathname]);

  const handleLogout = async () => {
    const token = getStoredToken();
    await logout(token);
    clearSession();
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  const isTransparentHeader = ['/', '/events', '/replays'].includes(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = `fixed w-full top-0 z-50 transition-colors duration-300 ${
    isTransparentHeader && !scrolled ? 'bg-transparent' : 'bg-nara-surface border-b border-nara-border'
  }`;

  const renderNavLink = (link: NavigationItem, className: string, onClick?: () => void) => {
    const isExternal = /^https?:\/\//.test(link.href);
    const isActive = !isExternal && (pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`)));
    const linkClass = `${className} ${isActive ? 'text-white font-bold' : 'text-nara-text-muted hover:text-white'}`;

    if (isExternal) {
      return (
        <a
          key={link.key}
          href={link.href}
          target={link.open_in_new_tab ? '_blank' : undefined}
          rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
          className={linkClass}
          onClick={onClick}
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link key={link.key} href={link.href} className={linkClass} onClick={onClick}>
        {link.label}
      </Link>
    );
  };

  return (
    <>
      <header className={headerClass}>
        <div className="flex h-16 items-center px-4 md:px-6 w-full mx-auto">
          <div className="flex items-center">
            <Link href="/" className="relative mr-5 block h-10 w-[136px] shrink-0 overflow-hidden md:mr-9 md:h-11 md:w-[152px]" aria-label={`${siteName} home`}>
              <Image src={logoImage} alt={siteName} fill priority sizes="152px" className="object-contain object-left" />
            </Link>
            
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium">
              {liveEvent && mounted && (
                 <Link href={`/watch/${liveEvent.slug}`} className="flex items-center gap-2 text-nara-red font-black uppercase tracking-widest text-[10px] sm:text-xs mr-2 relative">
                    <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nara-red opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-nara-red"></span>
                    </span>
                    Live Now
                 </Link>
              )}
              {navLinks.map((link) => {
                return renderNavLink(link, 'transition-colors py-5');
              })}
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-4">
            <Link href="/search" className="p-2 text-white hover:text-nara-text-muted transition-colors" aria-label="Search">
              <IconSearch className="w-5 h-5" />
            </Link>
            
            {mounted && liveEvent && !isLoggedIn && (
               <Link href={`/watch/${liveEvent.slug}`} className="hidden lg:flex items-center gap-1.5 bg-nara-cyan hover:bg-white text-black px-4 py-1.5 font-black uppercase tracking-widest text-[10px] sm:text-xs rounded-sm transition-colors">
                  <PlayCircle className="w-3.5 h-3.5" /> Watch Live
               </Link>
            )}

            {mounted && liveEvent && isLoggedIn && (
               <Link href={`/watch/${liveEvent.slug}`} className="hidden lg:flex items-center gap-1.5 bg-nara-cyan hover:bg-white text-black px-4 py-1.5 font-black uppercase tracking-widest text-[10px] sm:text-xs rounded-sm transition-colors">
                  <PlayCircle className="w-3.5 h-3.5" /> Watch Live
               </Link>
            )}

            <div className="hidden sm:flex items-center gap-3">
              {mounted && isLoggedIn ? (
                <AccountDropdown onSignOut={handleLogout} />
              ) : mounted ? (
                <>
                  <Link 
                    href="/login" 
                    className="text-xs sm:text-sm font-bold text-white bg-[#172338] hover:bg-[#22314B] px-4 py-2 rounded-sm transition-colors"
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/register" 
                    className="text-sm font-bold text-nara-black bg-white hover:bg-gray-200 px-4 py-2 rounded-sm transition-colors"
                  >
                    Get started
                  </Link>
                </>
              ) : null}
            </div>

            <div className="lg:hidden flex items-center">
              {isLoggedIn && <div className="mr-2"><AccountDropdown onSignOut={handleLogout} /></div>}
              <button 
                className="p-2 text-white hover:text-nara-text-muted"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="nara-mobile-menu"
              >
                <IconMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-nara-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div id="nara-mobile-menu" role="dialog" aria-modal="true" aria-label="NaraTV navigation" className="relative flex flex-col w-[80%] max-w-sm h-full bg-nara-surface border-r border-nara-border shadow-2xl animate-in slide-in-from-left">
            <div className="flex h-16 items-center px-4 border-b border-nara-border justify-between">
              <Link href="/" className="relative block h-10 w-[140px] shrink-0 overflow-hidden" onClick={() => setMobileMenuOpen(false)} aria-label="NaraTV home">
                <Image src={logoImage} alt="NaraTV" fill priority sizes="140px" className="object-contain object-left" />
              </Link>
              <button className="p-2 text-nara-text-muted hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                <IconClose className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col px-0 gap-0">
                {liveEvent && (
                  <Link
                    href={`/watch/${liveEvent.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-6 py-4 border-b border-nara-border text-base font-black uppercase tracking-widest text-nara-red transition-colors hover:bg-white/5"
                  >
                    Live Now
                  </Link>
                )}
                {navLinks.map((link) => {
                  const isExternal = /^https?:\/\//.test(link.href);
                  const isActive = !isExternal && (pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`)));
                  const mobileClass = `px-6 py-4 border-b border-nara-border text-base font-medium transition-colors ${
                    isActive ? 'bg-white/5 text-white border-l-4 border-l-nara-red' : 'text-nara-text-muted hover:bg-white/5 hover:text-white border-l-4 border-l-transparent'
                  }`;
                  return renderNavLink(link, mobileClass, () => setMobileMenuOpen(false));
                })}
              </nav>

              {/* Action Buttons */}
              <div className="mt-8 px-6 border-t border-nara-border pt-8 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    <Link 
                      href="/my-account" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center rounded-sm font-bold text-nara-black bg-white hover:bg-gray-200 transition-colors"
                    >
                      My Account
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 text-center rounded-sm font-bold text-white bg-[#172338] hover:bg-[#22314B] transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center rounded-sm font-bold text-white bg-[#172338] hover:bg-[#22314B] transition-colors"
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center rounded-sm font-bold text-nara-black bg-white hover:bg-gray-200 transition-colors"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-8 px-6 flex flex-col gap-4 text-sm text-nara-text-muted">
                <Link href="/help" className="hover:text-white">Help</Link>
                <Link href="/terms" className="hover:text-white">Terms & conditions</Link>
                <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
