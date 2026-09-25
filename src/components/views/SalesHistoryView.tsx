'use client';

import React, { useState } from 'react';
import { Receipt, Search, Printer, ArrowUpRight, Eye } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Sale } from '@/types/farm';

export const SalesHistoryView: React.FC = () => {
  const { sales, setActiveTab } = useFarm();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [search, setSearch] = useState('');

  const filteredSales = sales.filter(s =>
    s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Sales History & Tax Invoices</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {sales.length} Invoices
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable commercial transaction records with animal tag traceability
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setActiveTab('pos')}
        >
          Launch POS Terminal
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice # or customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#1B4332]"
            />
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Trader / Buyer</th>
              <th className="py-3 px-3">Animals Sold</th>
              <th className="py-3 px-3">Payment Mode</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Total (₹)</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSales.map(sale => (
              <tr key={sale.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{sale.invoiceNumber}</td>
                <td className="py-3 px-3 font-mono text-slate-600">{sale.date}</td>
                <td className="py-3 px-3 font-semibold text-slate-800">{sale.customerName}</td>
                <td className="py-3 px-3 text-slate-600">
                  {sale.items.map(it => it.tagNumber).join(', ')} ({sale.items.length} goats)
                </td>
                <td className="py-3 px-3 font-mono text-slate-700">{sale.paymentMethod}</td>
                <td className="py-3 px-3">
                  <Badge
                    size="sm"
                    variant={sale.paymentStatus === 'PAID' ? 'success' : sale.paymentStatus === 'PARTIAL' ? 'warning' : 'danger'}
                  >
                    {sale.paymentStatus}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">
                  ₹{sale.totalAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => setSelectedSale(sale)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Invoice Modal */}
      <Modal
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title={`Invoice ${selectedSale?.invoiceNumber}`}
        subtitle="Complete record of commercial transaction"
        maxWidth="lg"
      >
        {selectedSale && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{selectedSale.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-mono">{selectedSale.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-semibold uppercase">{selectedSale.paymentStatus} via {selectedSale.paymentMethod}</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {selectedSale.items.map(it => (
                <div key={it.id} className="p-3 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{it.tagNumber}</span> — {it.breed}
                    <div className="text-[11px] text-slate-500">{it.weightKg} kg @ ₹{it.ratePerKg}/kg</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">₹{it.amount.toLocaleString('en-IN')}</span>
                    <div className="text-[10px] text-emerald-700">Gross Margin: +₹{it.profitOnGoat}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-baseline text-sm font-bold border-t border-slate-200">
              <span>Total Paid / Settled:</span>
              <span className="text-base text-slate-900">₹{selectedSale.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedSale(null)}>Close</Button>
              <Button variant="primary" icon={Printer} onClick={() => window.print()}>Print Receipt</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
