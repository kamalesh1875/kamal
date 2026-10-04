'use client';

import React from 'react';
import {
  BadgeIndianRupee,
  Scale,
  Activity,
  AlertTriangle,
  Wheat,
  ShoppingBag,
  Sparkles,
  Camera,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { MobileTab } from './MobileNavigation';

interface MobileDashboardProps {
  onNavigate: (tab: MobileTab) => void;
  onOpenGoatProfile: (goatId: string) => void;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  onNavigate,
  onOpenGoatProfile
}) => {
  const {
    sales,
    expenses,
    goats,
    inventory,
    tasks,
    customers,
    overdueAlerts,
    currentRole
  } = useFarm();

  // Today's Date String (YYYY-MM-DD)
  const todayStr = new Date().toISOString().substring(0, 10);

  // Today's Sales & Expenses
  const todaySales = sales.filter(s => s.date === todayStr && s.status !== 'CANCELLED');
  const todaySalesAmount = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);

  // Overall financial summary for quick orientation
  const totalSalesRevenue = sales.filter(s => s.status !== 'CANCELLED').reduce((acc, s) => acc + s.totalAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalProfit = totalSalesRevenue - totalExpenses;

  // Active Animals & High Risk Goats
  const activeGoats = goats.filter(g => g.status === 'ACTIVE' || g.status === 'PREGNANT' || g.status === 'QUARANTINE');
  const quarantineGoats = goats.filter(g => g.status === 'QUARANTINE' || g.status === 'QUARANTINED');

  // Low Feed Stock
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minimumStockLevel);

  // Outstanding Customer Receivables
  const totalOutstandingCredit = customers.reduce((acc, c) => acc + c.outstandingBalance, 0);

  // Pending Tasks
  const pendingTasks = tasks.filter(t => t.status === 'PENDING');

  return (
    <div className="space-y-4 pb-20">
      {/* Mobile Top Farm Header */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1B4332] via-[#21543E] to-[#133024] p-4 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐐</span>
            <div>
              <h1 className="text-base font-bold tracking-tight">MSK GoatFarm OS</h1>
              <p className="text-[11px] text-emerald-300">Pollachi Unit 01 • {currentRole}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('scanner')}
            className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs"
          >
            <Camera className="h-4 w-4" />
            <span>Scan Tag</span>
          </button>
        </div>

        {/* Quick Financial Snapshot */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-600/30 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-emerald-200 block font-medium">Today's Sales</span>
            <span className="text-sm font-bold text-white">
              ₹{todaySalesAmount > 0 ? todaySalesAmount.toLocaleString('en-IN') : totalSalesRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-emerald-200 block font-medium">Total Profit</span>
            <span className="text-sm font-bold text-emerald-300">
              ₹{totalProfit.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-emerald-200 block font-medium">Active Goats</span>
            <span className="text-sm font-bold text-white">{activeGoats.length}</span>
          </div>
        </div>
      </div>

      {/* AI Health Alert Strip */}
      <div
        onClick={() => onNavigate('ai-health')}
        className="cursor-pointer p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 shadow-2xs flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-xs">AI Health Center</span>
              <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                2 Attention
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Reduced activity in G-023 • Abnormal feces in G-071
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </div>

      {/* Operational KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* High Risk / Quarantine Goats */}
        <div
          onClick={() => onNavigate('goats')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">High-Risk Animals</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900">{quarantineGoats.length}</div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">Quarantine / Isolation</div>
          </div>
        </div>

        {/* Vaccination Due */}
        <div
          onClick={() => onNavigate('health')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Vaccines Due</span>
            <Activity className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900">1</div>
            <div className="text-[11px] text-rose-600 font-medium mt-0.5">ET Booster Protocol</div>
          </div>
        </div>

        {/* Feed Stock Thresholds */}
        <div
          onClick={() => onNavigate('feed')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Feed Inventory</span>
            <Wheat className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900">
              {lowStockItems.length > 0 ? `${lowStockItems.length} Low` : 'Normal'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">Dry fodder & pellets</div>
          </div>
        </div>

        {/* Outstanding Payments */}
        <div
          onClick={() => onNavigate('customers')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Trader Receivables</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900">
              ₹{Math.round(totalOutstandingCredit / 1000)}k
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              {overdueAlerts.length} overdue invoices
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tasks Quick List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 uppercase">
            <Clock className="h-4 w-4 text-emerald-700" />
            <span>Field Tasks ({pendingTasks.length} Pending)</span>
          </div>
          <button
            onClick={() => onNavigate('tasks')}
            className="text-[11px] font-semibold text-emerald-700 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {pendingTasks.slice(0, 3).map(task => (
            <div key={task.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <div>
                <span className="font-semibold text-slate-800">{task.title}</span>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Due: {task.dueTime} • {task.assignedWorker}
                </div>
              </div>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                  task.priority === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800'
                    : task.priority === 'HIGH'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Buttons for Farm Hand */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          onClick={() => onNavigate('pos')}
          className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#1B4332] text-white font-bold text-xs shadow-xs"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Goat POS Invoicing</span>
        </button>
        <button
          onClick={() => onNavigate('weight')}
          className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-xs"
        >
          <Scale className="h-4 w-4 text-emerald-400" />
          <span>Rapid Weight Scale</span>
        </button>
      </div>
    </div>
  );
};
