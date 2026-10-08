'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Smartphone,
  Sparkles,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useFarm, useAuth } from '@/context/FarmContext';
import { getNavSectionsForRole } from '@/lib/navigationConfig';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, inventory, currentRole, setIsMobileWorkerOpen } = useFarm();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Calculate live alert indicators
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minimumStockLevel).length;
  const overdueVaccinesCount = 1; // Dr Ramanathan schedule

  const navSections = getNavSectionsForRole(currentRole);

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
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 font-semibold text-xs transition-all shadow-xs cursor-pointer"
        >
          <Smartphone className="h-4 w-4 text-emerald-400" />
          <span>Mobile Worker Mode</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map(section => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-emerald-500/70 uppercase">
              {section.title}
            </div>
            <div className="space-y-0.5 mt-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.route || activeTab === item.id;
                
                // Determine live badge
                let badgeText: string | undefined;
                if (item.badgeKey === 'lowStock' && lowStockCount > 0) {
                  badgeText = `${lowStockCount} low`;
                } else if (item.badgeKey === 'overdueVaccines' && overdueVaccinesCount > 0) {
                  badgeText = `${overdueVaccinesCount} due`;
                }

                return (
                  <Link
                    key={item.id}
                    href={item.route}
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

                    {badgeText && (
                      <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-bold ${
                        item.badgeVariant === 'danger' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-900'
                      }`}>
                        {badgeText}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Farm Info & User Sign-Out */}
      <div className="p-3 border-t border-[#1B4332]/60 bg-[#0E221A] space-y-2">
        <div className="bg-[#18392B]/80 rounded-xl p-2.5 border border-[#2D6A4F]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate max-w-[130px]">
                {user?.name || 'Pollachi Unit 01'}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono">
                {currentRole}
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sign out of account"
            aria-label="Sign out of account"
            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-emerald-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
