'use client';

import React, { useState } from 'react';
import { useFarm } from '@/context/FarmContext';
import { MobileNavigation, MobileTab } from './MobileNavigation';
import { MobileDashboard } from './MobileDashboard';
import { MobileGoatView } from './MobileGoatView';
import { MobilePosView } from './MobilePosView';
import { MobileWeightEntry } from './MobileWeightEntry';
import { MobileGoatHealthProfile } from './MobileGoatHealthProfile';
import { MobileAiHealthView } from './MobileAiHealthView';
import { MobileQrScanner } from './MobileQrScanner';
import {
  HealthSubView,
  PensSubView,
  TasksSubView
} from '@/components/views/LivestockSubViews';
import { InventoryView } from '@/components/views/InventoryView';
import { CustomersView } from '@/components/views/CustomersView';
import { FinanceView } from '@/components/views/FinanceView';

interface MobileAppViewProps {
  onSwitchToDesktop?: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({ onSwitchToDesktop }) => {
  const { setQuickActionModal } = useFarm();
  const [currentTab, setCurrentTab] = useState<MobileTab>('home');
  const [inspectingGoatId, setInspectingGoatId] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleOpenGoatProfile = (goatId: string) => {
    setInspectingGoatId(goatId);
  };

  const handleScanSuccess = (goatId: string, tagNumber: string) => {
    setIsScannerOpen(false);
    setInspectingGoatId(goatId);
  };

  const renderContent = () => {
    // If inspecting individual goat profile
    if (inspectingGoatId) {
      return (
        <MobileGoatHealthProfile
          goatId={inspectingGoatId}
          onBack={() => setInspectingGoatId(null)}
          onOpenAiHealth={() => {
            setInspectingGoatId(null);
            setCurrentTab('ai-health');
          }}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <MobileDashboard
            onNavigate={tab => setCurrentTab(tab)}
            onOpenGoatProfile={handleOpenGoatProfile}
          />
        );
      case 'goats':
        return (
          <MobileGoatView
            onOpenGoatProfile={handleOpenGoatProfile}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenWeightEntry={goatId => {
              if (goatId) setInspectingGoatId(goatId);
              setCurrentTab('weight');
            }}
          />
        );
      case 'pos':
        return (
          <MobilePosView
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        );
      case 'tasks':
        return <TasksSubView />;
      case 'ai-health':
        return (
          <MobileAiHealthView
            onOpenGoatProfile={handleOpenGoatProfile}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        );
      case 'weight':
        return (
          <MobileWeightEntry
            initialGoatId={inspectingGoatId || undefined}
            onOpenScanner={() => setIsScannerOpen(true)}
            onDone={() => setCurrentTab('home')}
          />
        );
      case 'health':
        return <HealthSubView />;
      case 'feed':
        return <InventoryView />;
      case 'pens':
        return <PensSubView />;
      case 'customers':
        return <CustomersView />;
      case 'finance':
        return <FinanceView />;
      case 'scanner':
        return (
          <div className="py-8 text-center">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-6 py-3 rounded-2xl bg-[#1B4332] text-white font-bold text-sm shadow-md"
            >
              Open Camera Scanner
            </button>
          </div>
        );
      default:
        return (
          <MobileDashboard
            onNavigate={tab => setCurrentTab(tab)}
            onOpenGoatProfile={handleOpenGoatProfile}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-slate-900 flex flex-col font-sans">
      {/* Mobile Top Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#11291F] text-white px-4 h-14 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] flex items-center justify-center text-base border border-emerald-400/20">
            🐐
          </div>
          <div>
            <div className="font-bold text-xs tracking-tight">MSK GoatFarm OS</div>
            <div className="text-[10px] text-emerald-400/80">Worker Field Edition</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToDesktop && (
            <button
              onClick={onSwitchToDesktop}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-slate-200 px-2 py-1 rounded-lg border border-white/10"
            >
              Desktop
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Full-Screen Camera Scanner Modal */}
      {isScannerOpen && (
        <MobileQrScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      {/* Fixed Bottom Mobile Navigation */}
      <MobileNavigation
        currentTab={currentTab}
        onSelectTab={tab => {
          setInspectingGoatId(null);
          setCurrentTab(tab);
        }}
        onOpenQuickAction={setQuickActionModal}
        onSwitchToDesktop={onSwitchToDesktop}
      />
    </div>
  );
};
