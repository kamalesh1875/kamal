'use client';

import React from 'react';
import {
  Wheat,
  AlertTriangle,
  Plus,
  ArrowDownRight,
  TrendingDown,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const InventoryView: React.FC = () => {
  const { inventory, pens, setQuickActionModal } = useFarm();

  const totalValue = inventory.reduce((acc, i) => acc + i.totalStockValue, 0);
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minimumStockLevel).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Feed & Inventory Movement Ledger</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              ₹{totalValue.toLocaleString('en-IN')} Stock Value
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-tracked feed, mineral mixtures, and veterinary pharmaceuticals with reorder alerts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={Wheat}
            onClick={() => setQuickActionModal('ISSUE_FEED')}
          >
            Issue Feed to Shed
          </Button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 shadow-2xs">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900">
              Low Stock Level Detected ({lowStockCount} Item Requiring Reorder)
            </h3>
            <p className="text-xs text-amber-800 mt-0.5">
              Dry Fodder / Napier grass bales is below configured reserve capacity. Initiate cooperative purchase to maintain uninterrupted daily ruminant rations.
            </p>
          </div>
        </div>
      )}

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map(item => {
          const isLow = item.currentStock <= item.minimumStockLevel;
          const percentage = Math.min(100, Math.round((item.currentStock / (item.minimumStockLevel * 2)) * 100));

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border bg-white shadow-xs space-y-4 transition-all ${
                isLow ? 'border-amber-300 ring-1 ring-amber-300/50' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <Badge
                    size="sm"
                    variant={item.category === 'FEED' ? 'primary' : item.category === 'MEDICINE' ? 'danger' : 'info'}
                  >
                    {item.category}
                  </Badge>
                  <h3 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                    {item.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">Supplier: {item.supplier || 'Standard Farm Stock'}</div>
                </div>

                <div className={`p-2 rounded-xl ${isLow ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                  <Package className="h-5 w-5" />
                </div>
              </div>

              {/* Stock Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900 text-lg">
                    {item.currentStock} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                  </span>
                  <span className="text-slate-500 text-[11px] self-end">
                    Min Threshold: {item.minimumStockLevel} {item.unit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isLow ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Economic valuation */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">UNIT RATE</span>
                  <span className="font-bold text-slate-900">₹{item.costPerUnit} / {item.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">TOTAL STOCK VALUE</span>
                  <span className="font-bold text-emerald-800">₹{item.totalStockValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shed Feed Ration Allocation Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Automated Daily Pen Ration Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {pens.map(pen => (
            <div key={pen.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">{pen.name}</span>
              <span className="text-[11px] text-slate-500 block">{pen.currentCount} active goats</span>
              <div className="pt-2 text-[11px] text-emerald-800 font-semibold border-t border-slate-200">
                Daily Concentrate: {Math.round(pen.currentCount * 0.45)} kg/day
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
