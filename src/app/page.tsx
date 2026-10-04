'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FarmProvider, useFarm } from '@/context/FarmContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandMenu } from '@/components/modals/CommandMenu';
import { QuickActionModals } from '@/components/modals/QuickActionModals';
import { MobileWorkerModal } from '@/components/modals/MobileWorkerModal';
import { ViewLoadingSkeleton } from '@/components/ui/ViewLoadingSkeleton';

// Immediate View for instant First Contentful Paint
import { DashboardView } from '@/components/views/DashboardView';

// Subviews
import {
  WeightSubView,
  HealthSubView,
  PensSubView,
  TasksSubView
} from '@/components/views/LivestockSubViews';

// Code-split dynamic views for reduced bundle size and zero page lag
const GoatsView = dynamic(() => import('@/components/views/GoatsView').then(m => m.GoatsView), {
  loading: () => <ViewLoadingSkeleton title="Loading Living Asset Registry..." />
});
const PosView = dynamic(() => import('@/components/views/PosView').then(m => m.PosView), {
  loading: () => <ViewLoadingSkeleton title="Loading POS Terminal..." />
});
const InventoryView = dynamic(() => import('@/components/views/InventoryView').then(m => m.InventoryView), {
  loading: () => <ViewLoadingSkeleton title="Loading Feed & Inventory..." />
});
const FinanceView = dynamic(() => import('@/components/views/FinanceView').then(m => m.FinanceView), {
  loading: () => <ViewLoadingSkeleton title="Loading Financial Ledger..." />
});
const SalesHistoryView = dynamic(() => import('@/components/views/SalesHistoryView').then(m => m.SalesHistoryView), {
  loading: () => <ViewLoadingSkeleton title="Loading Sales History..." />
});
const CustomersView = dynamic(() => import('@/components/views/CustomersView').then(m => m.CustomersView), {
  loading: () => <ViewLoadingSkeleton title="Loading Customer Accounts..." />
});
const AuditView = dynamic(() => import('@/components/views/AuditView').then(m => m.AuditView), {
  loading: () => <ViewLoadingSkeleton title="Loading Immutable Audit Log..." />
});
const AiHealthCenterView = dynamic(
  () => import('@/ai-health/components/AiHealthCenterView').then(m => m.AiHealthCenterView),
  {
    loading: () => <ViewLoadingSkeleton title="Initializing AI Health Center..." />
  }
);
const MobileAppView = dynamic(
  () => import('@/mobile/components/MobileAppView').then(m => m.MobileAppView),
  {
    loading: () => <ViewLoadingSkeleton title="Loading Mobile Field App..." />
  }
);

const FarmAppContent: React.FC = () => {
  const { activeTab } = useFarm();
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);

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

  // If in Mobile Mode, render the dedicated mobile PWA experience
  if (isMobileMode) {
    return <MobileAppView onSwitchToDesktop={handleSwitchToDesktop} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'goats':
        return <GoatsView />;
      case 'weight':
        return <WeightSubView />;
      case 'health':
        return <HealthSubView />;
      case 'ai-health':
        return <AiHealthCenterView />;
      case 'pens':
        return <PensSubView />;
      case 'pos':
        return <PosView />;
      case 'sales':
        return <SalesHistoryView />;
      case 'customers':
        return <CustomersView />;
      case 'inventory':
        return <InventoryView />;
      case 'tasks':
        return <TasksSubView />;
      case 'finance':
      case 'expenses':
        return <FinanceView />;
      case 'audit':
        return <AuditView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAF7] overflow-hidden">
      {/* ERP Collapsible / Sticky Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top ERP Header with Search & Quick Actions */}
        <Header />

        {/* Dynamic Page Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Floating Switcher to Mobile View (For Testing & Tablets) */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={handleSwitchToMobile}
          className="flex items-center gap-2 bg-[#11291F] text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-2xl shadow-xl hover:bg-[#1B4332] active:scale-95 transition-all text-xs font-semibold"
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

export default function Home() {
  return (
    <FarmProvider>
      <FarmAppContent />
    </FarmProvider>
  );
}
