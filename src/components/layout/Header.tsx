'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Bell,
  User,
  ShieldCheck,
  ChevronDown,
  Scale,
  Wheat,
  ShoppingBag,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
  LogOut,
  Settings,
  Smartphone
} from 'lucide-react';
import { useFarm, useAuth } from '@/context/FarmContext';

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    currentRole,
    setIsCommandMenuOpen,
    setQuickActionModal,
    setSelectedGoatId,
    setActiveTab,
    inventory,
    healthRecords,
    resetAllToDefault
  } = useFarm();
  const { user, permissions, logout } = useAuth();

  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const lowStockItems = inventory.filter(i => i.currentStock <= i.minimumStockLevel);
  const alertCount = lowStockItems.length + 1; // 1 vaccine/quarantine alert

  // User initials
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const handleLaunchPos = () => {
    setIsQuickActionOpen(false);
    setActiveTab('pos');
    router.push('/pos');
  };

  const handleNotificationGoatClick = () => {
    setIsNotificationsOpen(false);
    setSelectedGoatId('goat-7');
    setActiveTab('goats');
    router.push('/goats');
  };

  const handleNotificationStockClick = () => {
    setIsNotificationsOpen(false);
    setActiveTab('inventory');
    router.push('/inventory');
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Global Search / Command Bar trigger */}
      <div className="flex items-center gap-4 w-96">
        <button
          onClick={() => setIsCommandMenuOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition-all text-xs cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Search goats (G-247), customers, invoices...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded shadow-2xs text-slate-400">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={() => {
            if (confirm('Reset all demo farm data to factory state?')) resetAllToDefault();
          }}
          title="Reset demo data"
          aria-label="Reset demo data"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-label="Farm alerts and notifications"
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {alertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-xs">
              <div className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Actionable Farm Alerts</span>
                <span className="text-[10px] font-medium bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                  {alertCount} Action required
                </span>
              </div>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                <div
                  onClick={handleNotificationGoatClick}
                  className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100 text-rose-900 flex items-start gap-2 cursor-pointer hover:bg-rose-100/80 transition-colors"
                >
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-rose-900">Quarantine Protocol Active</div>
                    <div className="text-[11px] text-rose-700 mt-0.5">Goat G-00253 in Pen Delta requires Day 3 antibiotic injection.</div>
                    <span className="text-[10px] text-rose-800 font-bold underline mt-1 inline-block">Inspect Goat →</span>
                  </div>
                </div>

                {lowStockItems.map(item => (
                  <div
                    key={item.id}
                    onClick={handleNotificationStockClick}
                    className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-100 text-amber-900 flex items-start gap-2 cursor-pointer hover:bg-amber-100/80 transition-colors"
                  >
                    <Wheat className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-900">Low Stock Alert: {item.name}</div>
                      <div className="text-[11px] text-amber-700 mt-0.5">
                        Current: {item.currentStock} {item.unit} (Minimum threshold: {item.minimumStockLevel} {item.unit})
                      </div>
                      <span className="text-[10px] text-amber-800 font-bold underline mt-1 inline-block">Open Inventory →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#133024] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Quick Action</span>
            <ChevronDown className="h-3 w-3 opacity-80" />
          </button>

          {isQuickActionOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-xs"
              onClick={() => setIsQuickActionOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Create Records
              </div>

              {/* Register Goat */}
              {(currentRole === 'OWNER' || currentRole === 'ADMIN' || currentRole === 'FARM_MANAGER' || currentRole === 'VETERINARIAN') && (
                <button
                  onClick={() => setQuickActionModal('ADD_GOAT')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                >
                  <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">🐐</div>
                  <div>
                    <div className="font-medium text-slate-900">Register Goat</div>
                    <div className="text-[10px] text-slate-400">Tag, breed, intake weight</div>
                  </div>
                </button>
              )}

              {/* POS Terminal */}
              {permissions?.canAccessPos && (
                <button
                  onClick={handleLaunchPos}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                >
                  <div className="h-6 w-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">New Sale / POS</div>
                    <div className="text-[10px] text-slate-400">Launch POS terminal screen</div>
                  </div>
                </button>
              )}

              {/* Record Weight */}
              {permissions?.canRecordWeight && (
                <button
                  onClick={() => setQuickActionModal('RECORD_WEIGHT')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                >
                  <div className="h-6 w-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                    <Scale className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Record Weight</div>
                    <div className="text-[10px] text-slate-400">Update weight & calculate ADG</div>
                  </div>
                </button>
              )}

              {/* Issue Feed */}
              {permissions?.canIssueFeed && (
                <button
                  onClick={() => setQuickActionModal('ISSUE_FEED')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                >
                  <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Wheat className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Issue Feed / Stock</div>
                    <div className="text-[10px] text-slate-400">Deduct stock & allocate cost</div>
                  </div>
                </button>
              )}

              {/* Record Expense */}
              {permissions?.canViewFinance && (
                <button
                  onClick={() => setQuickActionModal('RECORD_EXPENSE')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                >
                  <div className="h-6 w-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Record Expense</div>
                    <div className="text-[10px] text-slate-400">Log ledger payout</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* Authenticated User Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="User account menu"
          >
            <div className="h-7 w-7 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-semibold text-slate-900 text-xs block leading-tight truncate max-w-[120px]">
                {user?.name || 'Staff User'}
              </span>
              <span className="text-[10px] text-emerald-700 font-mono font-medium block leading-tight">
                {currentRole}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs animate-in fade-in duration-150"
              onClick={() => setIsUserMenuOpen(false)}
            >
              {/* User Identity info */}
              <div className="p-3 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                <div className="font-bold text-slate-900 text-xs">{user?.name || 'Staff User'}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{user?.email || 'admin@mskgoat.com'}</div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {currentRole}
                  </span>
                  <span className="text-[10px] text-slate-400">Pollachi Unit 01</span>
                </div>
              </div>

              {/* Settings link for Owner/Admin */}
              {(currentRole === 'OWNER' || currentRole === 'ADMIN') && (
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    router.push('/settings');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span>Farm Settings & Staff</span>
                </button>
              )}

              {/* Logout button */}
              <button
                onClick={() => logout()}
                className="w-full text-left px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors font-medium cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-rose-600" />
                <span>Sign Out of OS</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
