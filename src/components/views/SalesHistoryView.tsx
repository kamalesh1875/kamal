'use client';

import React, { useState } from 'react';
import { Receipt, Search, Printer, ArrowUpRight, Eye, Ban, AlertTriangle, CheckCircle2, QrCode } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Sale } from '@/types/farm';

export const SalesHistoryView: React.FC = () => {
  const { sales, setActiveTab, cancelSale, currentRole } = useFarm();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [cancelModalSale, setCancelModalSale] = useState<Sale | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [search, setSearch] = useState('');

  const filteredSales = sales.filter(s =>
    s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalSale || !cancelReason.trim()) return;

    cancelSale(cancelModalSale.id, cancelReason.trim());
    setCancelModalSale(null);
    setCancelReason('');
    if (selectedSale?.id === cancelModalSale.id) {
      setSelectedSale(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Sales History & Tax Invoices</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {sales.length} Invoices Audited
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable commercial transaction records with animal tag traceability and reversal audits
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
              <th className="py-3 px-3">Payment Status</th>
              <th className="py-3 px-3">State</th>
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
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    sale.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800 font-mono' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {sale.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">
                  ₹{sale.totalAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-center flex items-center justify-center gap-1">
                  <button
                    onClick={() => setSelectedSale(sale)}
                    title="View Tax Invoice"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {sale.status !== 'CANCELLED' && (currentRole === 'OWNER' || currentRole === 'ADMIN') && (
                    <button
                      onClick={() => setCancelModalSale(sale)}
                      title="Void / Cancel Invoice"
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Official Tax Invoice Modal */}
      <Modal
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title={`Commercial Invoice ${selectedSale?.invoiceNumber}`}
        subtitle="Official sales invoice with traceable tag IDs and certified live weights"
        maxWidth="lg"
      >
        {selectedSale && (
          <div className="space-y-4 text-xs">
            {selectedSale.status === 'CANCELLED' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">TRANSACTION VOIDED / CANCELLED</div>
                  <div className="text-[11px] text-rose-800">{selectedSale.notes}</div>
                </div>
              </div>
            )}

            <div id="printable-tax-invoice" className="p-6 border border-slate-300 rounded-2xl bg-white space-y-4 shadow-xs">
              {/* Header */}
              <div className="text-center border-b border-slate-200 pb-3">
                <div className="text-xl font-black text-slate-900 tracking-tight">MSK COMMERCIAL GOAT FARM</div>
                <div className="text-[11px] text-slate-600 mt-0.5">Pollachi Santhai Road, Coimbatore Dist, Tamil Nadu - 642001</div>
                <div className="text-[10px] text-slate-500">Reg: TN/CBE/GOAT-2024 • Ph: +91 98421 99999</div>
                <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded-md font-mono font-bold text-slate-800">
                  INVOICE: {selectedSale.invoiceNumber}
                </div>
              </div>

              {/* Billed To Details */}
              <div className="grid grid-cols-2 gap-2 text-slate-700 text-[11px] border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">BILLED TO:</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedSale.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">DATE & STATUS:</span>
                  <span className="font-semibold text-slate-800">{selectedSale.date}</span>
                  <span className="block text-[10px] font-mono text-emerald-700 font-bold">{selectedSale.paymentStatus} via {selectedSale.paymentMethod}</span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="py-1">Tag & Breed</th>
                    <th className="py-1 text-center">Live Wt</th>
                    <th className="py-1 text-right">Rate/kg</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedSale.items.map(it => (
                    <tr key={it.id}>
                      <td className="py-2">
                        <span className="font-mono font-bold text-slate-900">{it.tagNumber}</span>
                        <span className="text-[10px] text-slate-500 block">{it.breed}</span>
                      </td>
                      <td className="py-2 text-center font-semibold">{it.weightKg} kg</td>
                      <td className="py-2 text-right">₹{it.ratePerKg}</td>
                      <td className="py-2 text-right font-bold">₹{it.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="border-t border-slate-200 pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{selectedSale.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Applied:</span>
                    <span>-₹{selectedSale.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedSale.transportCharges > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Transport Charges:</span>
                    <span>+₹{selectedSale.transportCharges.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span>₹{selectedSale.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Amount Paid:</span>
                  <span className="font-semibold">₹{selectedSale.paidAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold">
                  <span>Balance Due:</span>
                  <span className={selectedSale.totalAmount - selectedSale.paidAmount > 0 ? 'text-rose-700' : 'text-emerald-700'}>
                    ₹{(selectedSale.totalAmount - selectedSale.paidAmount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Verification QR */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <div>
                  <div>Certified healthy ruminant livestock assets.</div>
                  <div className="font-mono mt-0.5">AUTH TOKEN: MSK-INV-{selectedSale.id.toUpperCase()}</div>
                </div>
                <QrCode className="h-8 w-8 text-slate-700" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedSale(null)}>Close</Button>
              <Button variant="primary" icon={Printer} onClick={() => window.print()}>Print Official PDF Invoice</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Void / Cancel Invoice Modal */}
      <Modal
        isOpen={!!cancelModalSale}
        onClose={() => setCancelModalSale(null)}
        title={`Void / Cancel Invoice ${cancelModalSale?.invoiceNumber}`}
        subtitle="Immutable financial reversal with mandatory audit reasoning"
        maxWidth="md"
      >
        <form onSubmit={handleConfirmCancel} className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
            <span className="font-bold block">Important Business Rule:</span>
            <span>Cancelling this invoice will automatically return all {cancelModalSale?.items.length} animal(s) to the active herd and reverse customer ledger debits. The transaction record will remain permanently preserved for audit.</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Reason for Cancellation *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Customer cancelled order at pickup / scale weight dispute settled"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setCancelModalSale(null)}>Dismiss</Button>
            <Button variant="danger" type="submit">Confirm Cancellation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
