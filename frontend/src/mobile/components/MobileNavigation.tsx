'use client';

import React, { useState } from 'react';
import {
  Home,
  ShieldAlert,
  ShoppingBag,
  CheckSquare,
  Menu,
  X,
  Wheat,
  Activity,
  Sparkles,
  Grid,
  Users,
  BadgeIndianRupee,
  Settings,
  WifiOff,
  RefreshCw,
  Camera,
  Scale,
  LogOut,
  Receipt
} from 'lucide-react';
import { useFarm, useAuth } from '@/context/FarmContext';
import { ROLE_PERMISSIONS } from '@/lib/auth';
import { useMobileSync } from '../hooks/useMobileSync';

export type MobileTab =
  | 'home'
  | 'goats'
  | 'pos'
  | 'tasks'
  | 'ai-health'
  | 'weight'
  | 'health'
  | 'feed'
  | 'pens'
  | 'customers'
  | 'finance'
  | 'scanner';

interface MobileNavigationProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  onOpenQuickAction: (action: any) => void;
  onSwitchToDesktop?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickAction,
  onSwitchToDesktop
}) => {
  const { tasks, inventory, currentRole } = useFarm();
  const { user, logout } = useAuth();
  const { isOnline, syncState, pendingCount, triggerSync } = useMobileSync();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const pendingTasksCount = tasks.filter(t => t.status === 'PENDING').length;
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minimumStockLevel).length;

  const allowedTabs = ROLE_PERMISSIONS[currentRole]?.allowedNavTabs || ['dashboard'];

  const handleTabClick = (tab: MobileTab) => {
    onSelectTab(tab);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Network / Offline Queue Banner for Mobile */}
      {(!isOnline || pendingCount > 0) && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <>
                <WifiOff className="h-4 w-4 shrink-0 text-slate-950" />
                <span>Offline Mode (Queue: {pendingCount})</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-950 animate-ping" />
                <span>Syncing {pendingCount} offline action{pendingCount > 1 ? 's' : ''}...</span>
              </>
            )}
          </div>
          {isOnline && (
            <button
              onClick={() => triggerSync()}
              disabled={syncState === 'SYNCING'}
              className="flex items-center gap-1 bg-slate-900/10 hover:bg-slate-900/20 px-2 py-0.5 rounded text-[11px]"
            >
              <RefreshCw className={`h-3 w-3 ${syncState === 'SYNCING' ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          )}
        </div>
      )}

      {/* "More" Drawer Modal */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 max-h-[82vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Farm Operations & Modules</h3>
                <p className="text-[11px] text-slate-500">Authorized for {currentRole}</p>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              {allowedTabs.includes('ai-health') && (
                <button
                  onClick={() => handleTabClick('ai-health')}
                  className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 flex flex-col items-center gap-1.5 transition-all"
                >
                  <Sparkles className="h-5 w-5 text-emerald-700" />
                  <span className="font-semibold text-[11px]">AI Health</span>
                </button>
              )}

              {allowedTabs.includes('weight') && (
                <button
                  onClick={() => handleTabClick('weight')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex flex-col items-center gap-1.5 transition-all"
                >
                  <Scale className="h-5 w-5 text-[#1B4332]" />
                  <span className="font-semibold text-[11px]">Weight & ADG</span>
                </button>
              )}

              {allowedTabs.includes('health') && (
                <button
                  onClick={() => handleTabClick('health')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex flex-col items-center gap-1.5 transition-all"
                >
                  <Activity className="h-5 w-5 text-rose-600" />
                  <span className="font-semibold text-[11px]">Vaccines</span>
                </button>
              )}

              {allowedTabs.includes('inventory') && (
                <button
                  onClick={() => handleTabClick('feed')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex flex-col items-center gap-1.5 transition-all"
                >
                  <Wheat className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-[11px]">Feed Stock</span>
                  {lowStockCount > 0 && (
                    <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                      {lowStockCount} low
                    </span>
                  )}
                </button>
              )}

              {allowedTabs.includes('pens') && (
                <button
                  onClick={() => handleTabClick('pens')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex flex-col items-center gap-1.5 transition-all"
                >
                  <Grid className="h-5 w-5 text-sky-600" />
                  <span className="font-semibold text-[11px]">Sheds & Pens</span>
                </button>
              )}

              {allowedTabs.includes('customers') && (
                <button
                  onClick={() => handleTabClick('customers')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex flex-col items-center gap-1.5 transition-all"
                >
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold text-[11px]">Traders</span>
                </button>
              )}

              {allowedTabs.includes('finance') && (
                <button
                  onClick={() => handleTabClick('finance')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex flex-col items-center gap-1.5 transition-all"
                >
                  <BadgeIndianRupee className="h-5 w-5 text-emerald-800" />
                  <span className="font-semibold text-[11px]">True Cost & P&L</span>
                </button>
              )}

              <button
                onClick={() => handleTabClick('scanner')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex flex-col items-center gap-1.5 transition-all"
              >
                <Camera className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold text-[11px]">Scan QR/Tag</span>
              </button>

              {onSwitchToDesktop && (
                <button
                  onClick={onSwitchToDesktop}
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 flex flex-col items-center gap-1.5 transition-all"
                >
                  <Settings className="h-5 w-5 text-slate-700" />
                  <span className="font-semibold text-[11px]">Desktop View</span>
                </button>
              )}
            </div>

            {/* Logout button in Mobile Drawer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[10px] text-slate-500">
                Logged in: <b className="text-slate-800">{user?.name || currentRole}</b>
              </div>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 font-semibold px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#11291F] text-slate-300 border-t border-[#1B4332]/60 pb-[env(safe-area-inset-bottom)] select-none">
        <div className="flex items-center justify-around h-15 px-2">
          {/* 1. Home */}
          <button
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
              currentTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </button>

          {/* 2. Goats / Role Primary 1 */}
          {allowedTabs.includes('goats') ? (
            <button
              onClick={() => handleTabClick('goats')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                currentTab === 'goats' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Goats</span>
            </button>
          ) : currentRole === 'CASHIER' ? (
            <button
              onClick={() => handleTabClick('customers')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                currentTab === 'customers' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Traders</span>
            </button>
          ) : null}

          {/* 3. POS (Only shown if role has POS permission) */}
          {allowedTabs.includes('pos') && (
            <button
              onClick={() => handleTabClick('pos')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                currentTab === 'pos' ? 'text-amber-300 font-bold' : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <div className="p-1 rounded-xl bg-amber-500/20 border border-amber-500/30">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-[10px] mt-0.5">POS</span>
            </button>
          )}

          {/* For VET: Health tab instead of POS */}
          {currentRole === 'VETERINARIAN' && (
            <button
              onClick={() => handleTabClick('health')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                currentTab === 'health' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Vaccines</span>
            </button>
          )}

          {/* For WORKER: Rapid Weight scale tab instead of POS */}
          {currentRole === 'WORKER' && (
            <button
              onClick={() => handleTabClick('weight')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                currentTab === 'weight' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scale className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Scale</span>
            </button>
          )}

          {/* 4. Tasks (if permitted) */}
          {allowedTabs.includes('tasks') && (
            <button
              onClick={() => handleTabClick('tasks')}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all ${
                currentTab === 'tasks' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Tasks</span>
              {pendingTasksCount > 0 && (
                <span className="absolute top-2 right-4 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#11291F]">
                  {pendingTasksCount}
                </span>
              )}
            </button>
          )}

          {/* 5. More */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
              isMoreOpen ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
