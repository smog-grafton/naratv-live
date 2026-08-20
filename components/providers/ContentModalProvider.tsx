'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ContentNormalized, normalizeContent, WatchOption } from '@/components/hooks/useContentAccess';
import { useBodyScrollLock } from '@/components/hooks/useBodyScrollLock';

type ModalType = 'none' | 'drawer' | 'bottom_sheet' | 'paywall';

interface ContentModalContextType {
  openContentModal: (item: any) => void;
  openPaywall: (option?: WatchOption) => void;
  closeModal: () => void;
  activeItem: ContentNormalized | null;
  activeOption: WatchOption | null;
  modalType: ModalType;
}

const ContentModalContext = createContext<ContentModalContextType | undefined>(undefined);

export function ContentModalProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState<ContentNormalized | null>(null);
  const [activeOption, setActiveOption] = useState<WatchOption | null>(null);
  const [modalType, setModalType] = useState<ModalType>('none');
  const [isMobile, setIsMobile] = useState(false);
  
  const { setIsLocked } = useBodyScrollLock();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openContentModal = (rawItem: any) => {
    const item = normalizeContent(rawItem);
    setActiveItem(item);
    
    // If it's a direct premium access CTA and no watch options, go to paywall
    if (item.watch_options.length === 0 && !item.has_access) {
       setModalType('paywall');
       return;
    }
    
    // Determine presentation based on screen size
    if (isMobile) {
      setModalType('bottom_sheet');
    } else {
      setModalType('drawer');
    }
  };

  const openPaywall = (option?: WatchOption) => {
    if (option) setActiveOption(option);
    setModalType('paywall');
  };

  const closeModal = () => {
    setModalType('none');
    // Delay clearing content slightly so closing animation stays smooth
    setTimeout(() => {
      setActiveItem(null);
      setActiveOption(null);
    }, 300);
  };

  // Lock body scroll when any modal is open
  useEffect(() => {
    setIsLocked(modalType !== 'none');
  }, [modalType, setIsLocked]);

  return (
    <ContentModalContext.Provider value={{ openContentModal, openPaywall, closeModal, activeItem, activeOption, modalType }}>
      {children}
    </ContentModalContext.Provider>
  );
}

export function useResponsiveContentModal() {
  const context = useContext(ContentModalContext);
  if (context === undefined) {
    throw new Error('useResponsiveContentModal must be used within a ContentModalProvider');
  }
  return context;
}
