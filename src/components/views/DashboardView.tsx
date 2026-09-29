'use client';

import React from 'react';
import {
  BadgeIndianRupee,
  Scale,
  Activity,
  Wheat,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  ShoppingBag,
  Users,
  Clock,
  Sparkles,
  ChevronRight,
  Smartphone
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    goats,
    pens,
    sales,
    expenses,
    inventory,
    tasks,
    customers,
    overdueAlerts,
    currentRole,
    setActiveTab,
    setQuickActionModal,
    setSelectedGoatId,
    setIsMobileWorkerOpen
  } = useFarm();

  // Layer 1: Business Health calculations
  const completedSales = sales.filter(s => s.status !== 'CANCELLED');
  const totalRevenue = completedSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalCashCollected = completedSales.reduce((acc, s) => acc + s.paidAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalOutstandingCredit = customers.reduce((acc, c) => acc + c.outstandingBalance, 0);
  const totalOverdueCredit = overdueAlerts.reduce((acc, o) => acc + o.totalOverdue, 0);

  const activeGoats = goats.filter(g => g.status === 'ACTIVE' || g.status === 'PREGNANT' || g.status === 'QUARANTINE');
  const totalBiomassKg = Math.round(activeGoats.reduce((acc, g) => acc + g.currentWeightKg, 0));
  const totalLivestockAssetValue = activeGoats.reduce((acc, g) => acc + g.estimatedMarketValue, 0);
  const totalTrueCostInvested = activeGoats.reduce((acc, g) => acc + g.trueCost, 0);
  const unrealizedProfit = totalLivestockAssetValue - totalTrueCostInvested;

  // Layer 2: Farm Health calculations
  const avgWeightKg = activeGoats.length > 0 ? (totalBiomassKg / activeGoats.length).toFixed(1) : 0;
  const avgADG = activeGoats.length > 0 ? Math.round(activeGoats.reduce((acc, g) => acc + g.adgGrams, 0) / activeGoats.length) : 0;
  const soldGoatsCount = goats.filter(g => g.status === 'SOLD').length;
  const deadGoatsCount = goats.filter(g => g.status === 'DEAD').length;
  const mortalityRate = goats.length > 0 ? ((deadGoatsCount / goats.length) * 100).toFixed(1) : '0.0';

  // Layer 3: Actionable Alerts
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minimumStockLevel);
  const overdueVaccines = 1; // Dr Ramanathan schedule
  const unweighedCount = goats.filter(g => {
    const daysSince = Math.round((new Date().getTime() - new Date(g.lastWeighedDate).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince > 14;
  }).length;

  // Financial Trend Data
  const financialTrendData = [
    { month: 'May', sales: 12000, feedCost: 6500, laborCost: 4000 },
    { month: 'Jun', sales: 24000, feedCost: 9200, laborCost: 4000 },
    { month: 'Jul', sales: 31000, feedCost: 11000, laborCost: 5000 },
    { month: 'Aug', sales: 28000, feedCost: 10500, laborCost: 5000 },
    { month: 'Sep (Current)', sales: totalRevenue, feedCost: 15000, laborCost: 12000 }
  ];

  const weightDistributionData = [
    { range: '15-20kg (Intake)', count: goats.filter(g => g.currentWeightKg < 20).length },
    { range: '20-25kg (Grower)', count: goats.filter(g => g.currentWeightKg >= 20 && g.currentWeightKg < 25).length },
    { range: '25-30kg (Mid-stage)', count: goats.filter(g => g.currentWeightKg >= 25 && g.currentWeightKg < 30).length },
    { range: '30-35kg (Fattening)', count: goats.filter(g => g.currentWeightKg >= 30 && g.currentWeightKg < 35).length },
    { range: '35kg+ (Market Ready)', count: goats.filter(g => g.currentWeightKg >= 35).length },
  ];

  return (
    <div className="space-y-6">
      {/* Farm Banner & Action Hub */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1B4332] via-[#21543E] to-[#133024] p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none text-9xl">
          🐐
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Commercial Feedlot Operating System
              </span>
              <span className="text-emerald-300/80 text-xs">Live Farm Sync • Role: {currentRole}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
              MSK Commercial Goat Farm
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
              Real-time monitoring of living assets, feed conversion ratio (FCR), cumulative true cost allocation, and point-of-sale invoicing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="accent"
              size="md"
              icon={ShoppingBag}
              onClick={() => setActiveTab('pos')}
            >
              Launch POS Screen
            </Button>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              icon={Smartphone}
              onClick={() => setIsMobileWorkerOpen(true)}
            >
              Mobile Worker Mode
            </Button>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => setQuickActionModal('ADD_GOAT')}
            >
              + Register Goat
            </Button>
          </div>
        </div>
      </div>

      {/* LAYER 1: BUSINESS & FINANCIAL HEALTH */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Layer 1 — Commercial & Capital Health
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">All figures in INR (₹)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <StatCard
            title="Total POS Sales"
            value={`₹${totalRevenue.toLocaleString('en-IN')}`}
            subtitle={`${completedSales.length} completed transactions`}
            icon={BadgeIndianRupee}
            variant="success"
            trend={{ value: 'Authoritative server ledger', isPositive: true }}
            onClick={() => setActiveTab('sales')}
          />
          <StatCard
            title="Cash & UPI Collected"
            value={`₹${totalCashCollected.toLocaleString('en-IN')}`}
            subtitle="Immediate realized cashflow"
            icon={ShoppingBag}
            variant="success"
          />
          <StatCard
            title="Live Asset Value"
            value={`₹${totalLivestockAssetValue.toLocaleString('en-IN')}`}
            subtitle={`${totalBiomassKg} kg current biomass`}
            icon={Scale}
            trend={{ value: 'Market @ ₹450-490/kg', isPositive: true }}
            onClick={() => setActiveTab('goats')}
          />
          <StatCard
            title="Cumulative True Cost"
            value={`₹${totalTrueCostInvested.toLocaleString('en-IN')}`}
            subtitle="Purchase + Feed + Meds + Labor"
            icon={Activity}
            onClick={() => setActiveTab('finance')}
          />
          <StatCard
            title="Outstanding Trader Credit"
            value={`₹${totalOutstandingCredit.toLocaleString('en-IN')}`}
            subtitle={`${overdueAlerts.length} overdue receivables`}
            icon={Users}
            variant={totalOverdueCredit > 0 ? 'danger' : 'warning'}
            onClick={() => setActiveTab('customers')}
          />
        </div>
      </div>

      {/* LAYER 2: FARM & HERD HEALTH */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-600" />
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Layer 2 — Biological Herd Health & Growth KPIs
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Calculated over 4 pens</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Active Goats</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{activeGoats.length}</div>
            <div className="text-[11px] text-emerald-600 mt-1">{pens.reduce((acc, p) => acc + p.currentCount, 0)} housed in pens</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Goats Sold</div>
            <div className="text-2xl font-bold text-emerald-800 mt-1">{soldGoatsCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">Certified off-take</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Average Weight</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{avgWeightKg} <span className="text-sm font-normal text-slate-500">kg</span></div>
            <div className="text-[11px] text-slate-500 mt-1">Target: 35.0 kg</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Average ADG</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">+{avgADG} <span className="text-sm font-normal text-slate-500">g/day</span></div>
            <div className="text-[11px] text-emerald-600 mt-1">Optimal fattening range</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Est. FCR Index</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">1 : 4.8</div>
            <div className="text-[11px] text-slate-500 mt-1">kg gain per kg feed</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Mortality Rate</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{mortalityRate}%</div>
            <div className="text-[11px] text-emerald-600 mt-1">Zero losses in 90 days</div>
          </div>
        </div>
      </div>

      {/* LAYER 3: ACTIONABLE ALERT STREAM */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Layer 3 — Actionable Farm Alerts & Critical Directives
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Live alert stream</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Overdue Receivables Alert */}
          {overdueAlerts.length > 0 && (
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-800 uppercase">
                    Overdue Receivables
                  </span>
                  <span className="text-[10px] font-mono text-rose-700 font-bold">
                    ₹{totalOverdueCredit.toLocaleString('en-IN')} Due
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 text-xs mt-2">
                  {overdueAlerts[0].customerName} ({overdueAlerts[0].businessName || 'Trader'})
                </h3>
                <p className="text-[11px] text-slate-600 mt-1">
                  ₹{overdueAlerts[0].totalOverdue.toLocaleString('en-IN')} outstanding is {overdueAlerts[0].daysOverdue} days past payment terms ({overdueAlerts[0].oldestInvoiceNumber}).
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between">
                <span className="text-[10px] text-rose-700 font-medium">Ph: {overdueAlerts[0].phone}</span>
                <button
                  onClick={() => setQuickActionModal('RECORD_PAYMENT')}
                  className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-0.5"
                >
                  Collect Payment <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Alert 2: Quarantine / Vet */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 uppercase">
                  Quarantine / Vet
                </span>
                <span className="text-[10px] text-amber-800">Pen Delta</span>
              </div>
              <h3 className="font-semibold text-slate-900 text-xs mt-2">
                Respiratory Antibiotic Protocol Active
              </h3>
              <p className="text-[11px] text-slate-600 mt-1">
                G-00253 requires Day 3 Oxytetracycline shot today by 11:00 AM.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between">
              <span className="text-[10px] text-amber-800 font-medium">Assigned: Dr. Ramanathan</span>
              <button
                onClick={() => {
                  setSelectedGoatId('goat-7');
                  setActiveTab('goats');
                }}
                className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-0.5"
              >
                Inspect Goat <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Alert 3: Feed Threshold */}
          <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-200 text-sky-900 uppercase">
                  Feed Threshold
                </span>
                <span className="text-[10px] text-sky-800">Critical Stock</span>
              </div>
              <h3 className="font-semibold text-slate-900 text-xs mt-2">
                Dry Fodder Bales Below Minimum
              </h3>
              <p className="text-[11px] text-slate-600 mt-1">
                Current: 240 kg. Minimum threshold is 500 kg. Reorder needed from cooperative.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-sky-200/60 flex items-center justify-between">
              <span className="text-[10px] text-sky-800 font-medium">Est. 4 days remaining</span>
              <button
                onClick={() => setActiveTab('inventory')}
                className="text-[11px] font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-0.5"
              >
                Open Stock <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Revenue vs Cumulative Feed & Labor Costs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Monthly Commercial Margin (Revenue vs Input Costs)
              </h3>
              <p className="text-[11px] text-slate-500">Traceable gross margin trajectory</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
              Positive Spread
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialTrendData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4332" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1B4332" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="feedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C2822B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C2822B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" name="Sales Revenue" stroke="#1B4332" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                <Area type="monotone" dataKey="feedCost" name="Feed & Supplement Cost" stroke="#C2822B" strokeWidth={2} fillOpacity={1} fill="url(#feedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Biomass Weight Segmentation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Herd Weight Distribution (Biomass Pyramid)
              </h3>
              <p className="text-[11px] text-slate-500">Readiness for market festival off-take</p>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
              Live Scale Data
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightDistributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="range" tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Goats in Segment" fill="#2D6A4F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TODAY'S OPERATIONS & WORKER TASKS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Today's Field Execution & Pen Chore Schedule
            </h3>
          </div>
          <span className="text-xs text-slate-500">Field Hand Assigned</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {tasks.map(task => (
            <div key={task.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === 'COMPLETED'}
                  onChange={() => {}}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <div>
                  <span className={`font-semibold ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title}
                  </span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Due: {task.dueTime}</span>
                    <span>•</span>
                    <span>Worker: {task.assignedWorker}</span>
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                task.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                task.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
