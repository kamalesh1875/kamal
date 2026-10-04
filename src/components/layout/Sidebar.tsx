'use client';

import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Scale,
  Activity,
  Grid,
  ShoppingBag,
  Receipt,
  Users,
  Wheat,
  CheckSquare,
  BadgeIndianRupee,
  FileSpreadsheet,
  History,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { ROLE_PERMISSIONS } from '@/lib/auth';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  isHighlight?: boolean;
  badge?: string;
  badgeVariant?: 'danger' | 'warning';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, inventory, currentRole, setIsMobileWorkerOpen } = useFarm();

  // Calculate live alert indicators
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minimumStockLevel).length;
  const overdueVaccinesCount = 1; // Dr Ramanathan schedule

  const rawNavSections: NavSection[] = [
    {
      title: 'CORE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'LIVESTOCK',
      items: [
        { id: 'goats', label: 'Goats Registry', icon: ShieldAlert },
        { id: 'weight', label: 'Weight & ADG', icon: Scale },
        { id: 'health', label: 'Health & Vaccines', icon: Activity, badge: overdueVaccinesCount > 0 ? `${overdueVaccinesCount} due` : undefined, badgeVariant: 'danger' as const },
        { id: 'ai-health', label: 'AI Health Center', icon: Sparkles, isHighlight: true },
        { id: 'pens', label: 'Pen Management', icon: Grid }
      ]
    },
    {
      title: 'COMMERCE',
      items: [
        { id: 'pos', label: 'Goat POS Terminal', icon: ShoppingBag, isHighlight: true },
        { id: 'sales', label: 'Sales & Invoices', icon: Receipt },
        { id: 'customers', label: 'Customers & Credit', icon: Users }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'inventory', label: 'Feed & Inventory', icon: Wheat, badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined, badgeVariant: 'warning' as const },
        { id: 'tasks', label: 'Farm Tasks', icon: CheckSquare }
      ]
    },
    {
      title: 'FINANCE & AUDIT',
      items: [
        { id: 'finance', label: 'True Cost & P&L', icon: BadgeIndianRupee },
        { id: 'expenses', label: 'Farm Expenses', icon: FileSpreadsheet },
        { id: 'audit', label: 'Activity & Audit Log', icon: History }
      ]
    }
  ];

  // Filter navigation items strictly based on User Role (RBAC)
  const allowedTabs = ROLE_PERMISSIONS[currentRole]?.allowedNavTabs || ['dashboard'];

  const filteredNavSections = rawNavSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => allowedTabs.includes(item.id))
    }))
    .filter(section => section.items.length > 0);

  return (
    <aside className="w-64 bg-[#11291F] text-slate-200 flex flex-col shrink-0 h-screen sticky top-0 border-r border-[#1B4332]/50 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-[#1B4332]/80 bg-[#0E221A]">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] flex items-center justify-center text-xl shadow-inner border border-emerald-400/20">
          🐐
        </div>
        <div>
          <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
            MSK GoatFarm OS
          </div>
          <div className="text-[11px] text-emerald-400/80 font-medium">
            Livestock ERP + POS
          </div>
        </div>
      </div>

      {/* Mobile Worker Quick Launcher Button */}
      <div className="px-3 pt-3">
        <button
          onClick={() => setIsMobileWorkerOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 font-semibold text-xs transition-all shadow-xs"
        >
          <Smartphone className="h-4 w-4 text-emerald-400" />
          <span>Mobile Worker Mode</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {filteredNavSections.map(section => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-emerald-500/70 uppercase">
              {section.title}
            </div>
            <div className="space-y-0.5 mt-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#1B4332] text-white shadow-xs font-semibold'
                        : item.isHighlight
                        ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                        : 'text-slate-300 hover:bg-[#18392B] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-300' : item.isHighlight ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-bold ${
                        item.badgeVariant === 'danger' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-900'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Farm Info Card */}
      <div className="p-3 border-t border-[#1B4332]/60 bg-[#0E221A]">
        <div className="bg-[#18392B]/80 rounded-xl p-3 border border-[#2D6A4F]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-xs font-semibold text-white">Pollachi Unit 01</div>
              <div className="text-[10px] text-emerald-400/80">Role: {currentRole}</div>
            </div>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        </div>
      </div>
    </aside>
  );
};
