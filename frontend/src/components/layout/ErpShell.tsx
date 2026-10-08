'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useFarm, useAuth } from '@/context/FarmContext';
import { isTabAllowed } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandMenu } from '@/components/modals/CommandMenu';
import { QuickActionModals } from '@/components/modals/QuickActionModals';
import { MobileWorkerModal } from '@/components/modals/MobileWorkerModal';
import { ViewLoadingSkeleton } from '@/components/ui/ViewLoadingSkeleton';

const MobileAppView = dynamic(
  () => import('@/mobile/components/MobileAppView').then(m => m.MobileAppView),
  {
    loading: () => <ViewLoadingSkeleton title="Loading Mobile Field App..." />
  }
);

interface ErpShellProps {
  children: React.ReactNode;
  activeTab?: string;
}

export const ErpShell: React.FC<ErpShellProps> = ({ children, activeTab: propTab }) => {
  const { setActiveTab } = useFarm();
  const { user, isAuthLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);

  const currentTab = propTab || (pathname ? pathname.replace(/^\//, '').split('/')[0] : 'dashboard') || 'dashboard';

  // 1. Enforce Authentication & Route Authorization
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated || !user) {
        const redirectPath = pathname && pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : '';
        router.replace(`/login${redirectPath}`);
        return;
      }

      if (!isTabAllowed(user.role, currentTab)) {
        router.replace('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, user, isAuthLoading, currentTab, pathname, router]);

  // Sync activeTab with pathname or propTab
  useEffect(() => {
    if (propTab) {
      setActiveTab(propTab);
    } else if (pathname) {
      const seg = pathname.replace(/^\//, '').split('/')[0] || 'dashboard';
      setActiveTab(seg);
    }
  }, [pathname, propTab, setActiveTab]);

  // Detect mobile viewport on mount and listen to window resize
  useEffect(() => {
    const checkViewport = () => {
      const savedMode = localStorage.getItem('msk_view_mode');
      if (savedMode === 'mobile') {
        setIsMobileMode(true);
      } else if (savedMode === 'desktop') {
        setIsMobileMode(false);
      } else {
        setIsMobileMode(window.innerWidth < 768);
      }
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const handleSwitchToDesktop = () => {
    localStorage.setItem('msk_view_mode', 'desktop');
    setIsMobileMode(false);
  };

  const handleSwitchToMobile = () => {
    localStorage.setItem('msk_view_mode', 'mobile');
    setIsMobileMode(true);
  };

  // While validating authorization, render skeleton to prevent flashing restricted content
  if (isAuthLoading) {
    return <ViewLoadingSkeleton title="Verifying authorization permissions..." />;
  }

  // If unauthenticated or unauthorized, render nothing while redirect is executed
  if (!isAuthenticated || !user || !isTabAllowed(user.role, currentTab)) {
    return null;
  }

  if (isMobileMode) {
    return <MobileAppView onSwitchToDesktop={handleSwitchToDesktop} />;
  }

  return (
    <div className="flex h-screen w-full bg-[#F8FAF7] overflow-hidden">
      {/* ERP Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Switcher to Mobile View (For Testing & Field Simulation) */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={handleSwitchToMobile}
          className="flex items-center gap-2 bg-[#11291F] text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-2xl shadow-xl hover:bg-[#1B4332] active:scale-95 transition-all text-xs font-semibold cursor-pointer"
          title="Switch to Mobile Worker UI"
        >
          <span>📱</span>
          <span>Mobile View</span>
        </button>
      </div>

      {/* Global Modals */}
      <CommandMenu />
      <QuickActionModals />
      <MobileWorkerModal />
    </div>
  );
};
