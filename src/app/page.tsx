'use client';

import React from 'react';
import { FarmProvider, useFarm } from '@/context/FarmContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandMenu } from '@/components/modals/CommandMenu';
import { QuickActionModals } from '@/components/modals/QuickActionModals';

// Core Views
import { DashboardView } from '@/components/views/DashboardView';
import { GoatsView } from '@/components/views/GoatsView';
import { PosView } from '@/components/views/PosView';
import { InventoryView } from '@/components/views/InventoryView';
import { FinanceView } from '@/components/views/FinanceView';
import { SalesHistoryView } from '@/components/views/SalesHistoryView';
import { CustomersView } from '@/components/views/CustomersView';
import { AuditView } from '@/components/views/AuditView';
import {
  WeightSubView,
  HealthSubView,
  PensSubView,
  TasksSubView
} from '@/components/views/LivestockSubViews';

const FarmAppContent: React.FC = () => {
  const { activeTab } = useFarm();

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

      {/* Global Modals */}
      <CommandMenu />
      <QuickActionModals />
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
