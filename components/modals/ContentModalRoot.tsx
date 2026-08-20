'use client';

import React from 'react';
import { useResponsiveContentModal } from '@/components/providers/ContentModalProvider';
import ContentDetailDrawer from './ContentDetailDrawer';
import ContentBottomSheet from './ContentBottomSheet';
import AccessPaywallModal from './AccessPaywallModal';

export default function ContentModalRoot() {
  const { modalType, activeItem, closeModal, openPaywall } = useResponsiveContentModal();

  if (modalType === 'none' || !activeItem) return null;

  return (
    <>
      {modalType === 'drawer' && (
        <ContentDetailDrawer item={activeItem} onClose={closeModal} onAction={openPaywall} />
      )}
      {modalType === 'bottom_sheet' && (
        <ContentBottomSheet item={activeItem} onClose={closeModal} onAction={openPaywall} />
      )}
      {modalType === 'paywall' && (
        <AccessPaywallModal item={activeItem} onClose={closeModal} />
      )}
    </>
  );
}
