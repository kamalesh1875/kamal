'use client';

import React from 'react';
import {
  BadgeIndianRupee,
  TrendingUp,
  FileSpreadsheet,
  Plus,
  Scale,
  Activity,
  ArrowUpRight,
  PieChart as PieIcon
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const FinanceView: React.FC = () => {
  const { sales, expenses, goats, setQuickActionModal } = useFarm();

  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netOperatingProfit = totalSalesRevenue - totalExpenses;

  // Livestock herd valuation
  const activeGoats = goats.filter(g => g.status === 'ACTIVE' || g.status === 'PREGNANT' || g.status === 'QUARANTINE');
  const totalInvestedTrueCost = activeGoats.reduce((acc, g) => acc + g.trueCost, 0);
  const totalEstimatedMarketValue = activeGoats.reduce((acc, g) => acc + g.estimatedMarketValue, 0);
  const unrealizedLivestockProfit = totalEstimatedMarketValue - totalInvestedTrueCost;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>True Cost Engine & Financial Ledger</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              P&L Audited
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full-cycle economic ledger computing true cost of ownership and profit margins per goat asset
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setQuickActionModal('RECORD_EXPENSE')}
          >
            Record Farm Expense
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Sales Revenue"
          value={`₹${totalSalesRevenue.toLocaleString('en-IN')}`}
          subtitle="Realized from livestock sales"
          icon={BadgeIndianRupee}
          variant="success"
        />
        <StatCard
          title="Operational Outflows"
          value={`₹${totalExpenses.toLocaleString('en-IN')}`}
          subtitle="Feed, vet, labor, utility bills"
          icon={FileSpreadsheet}
          variant="danger"
        />
        <StatCard
          title="Unrealized Herd Margin"
          value={`₹${unrealizedLivestockProfit.toLocaleString('en-IN')}`}
          subtitle={`${activeGoats.length} live goats on farm`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="True Cost Invested"
          value={`₹${totalInvestedTrueCost.toLocaleString('en-IN')}`}
          subtitle="Capital tied in living assets"
          icon={Activity}
        />
      </div>

      {/* The Core True Cost Formula Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-[#1B4332] text-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
            GoatFarm OS — Proprietary True Cost Engine Formula
          </span>
          <span className="text-xs text-emerald-300/80 font-mono">Cost Accounting v2.4</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 items-center text-center text-xs">
          <div className="p-2.5 rounded-xl bg-white/10">
            <span className="text-[10px] text-emerald-200 block">INTAKE</span>
            <span className="font-bold text-white text-xs">Purchase Price</span>
          </div>
          <span className="font-bold text-emerald-400 text-lg">+</span>
          <div className="p-2.5 rounded-xl bg-white/10">
            <span className="text-[10px] text-emerald-200 block">RATION</span>
            <span className="font-bold text-white text-xs">Feed & Minerals</span>
          </div>
          <span className="font-bold text-emerald-400 text-lg">+</span>
          <div className="p-2.5 rounded-xl bg-white/10">
            <span className="text-[10px] text-emerald-200 block">VET</span>
            <span className="font-bold text-white text-xs">Vaccines & Meds</span>
          </div>
          <span className="font-bold text-emerald-400 text-lg">+</span>
          <div className="p-2.5 rounded-xl bg-white/10">
            <span className="text-[10px] text-emerald-200 block">OVERHEAD</span>
            <span className="font-bold text-white text-xs">Labor & Shed</span>
          </div>
        </div>

        <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50 flex items-center justify-between text-xs">
          <span className="text-emerald-100">
            <b>Economic Rule:</b> When selling a goat at ₹X, Gross Margin is strictly <code>Revenue - True Cost</code>. Never calculate margin on purchase price alone.
          </span>
        </div>
      </div>

      {/* Expenses Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Recent Farm Operating Expenses ({expenses.length})
          </h3>
          <span className="text-xs text-slate-500">Categorized disbursements</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Description</th>
              <th className="py-3 px-3">Paid To</th>
              <th className="py-3 px-3">Payment Mode</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map(exp => (
              <tr key={exp.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-mono text-slate-600">{exp.date}</td>
                <td className="py-3 px-3">
                  <Badge size="sm" variant={exp.category === 'FEED' ? 'primary' : 'neutral'}>
                    {exp.category}
                  </Badge>
                </td>
                <td className="py-3 px-3 font-medium text-slate-900">{exp.description}</td>
                <td className="py-3 px-3 text-slate-600">{exp.paidTo}</td>
                <td className="py-3 px-3 font-mono text-slate-600">{exp.paymentMethod}</td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">
                  ₹{exp.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
