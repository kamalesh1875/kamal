'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Phone,
  MapPin,
  AlertTriangle,
  FileText,
  BadgeIndianRupee,
  Clock,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Customer } from '@/types/farm';

export const CustomersView: React.FC = () => {
  const { customers, sales, setQuickActionModal, overdueAlerts } = useFarm();
  const [selectedLedgerCustomer, setSelectedLedgerCustomer] = useState<Customer | null>(null);

  const totalOutstanding = customers.reduce((acc, c) => acc + c.outstandingBalance, 0);

  // Generate mock ledger transactions for inspected customer
  const getCustomerTransactions = (customerId: string) => {
    const custSales = sales.filter(s => s.customerId === customerId && s.status !== 'CANCELLED');
    const transactions = [];

    for (const s of custSales) {
      transactions.push({
        id: `tx-inv-${s.id}`,
        date: s.date,
        type: 'INVOICE',
        ref: s.invoiceNumber,
        debit: s.totalAmount,
        credit: 0,
        notes: `Livestock Sale (${s.items.length} goats)`
      });

      if (s.paidAmount > 0) {
        transactions.push({
          id: `tx-pay-${s.id}`,
          date: s.date,
          type: 'PAYMENT',
          ref: `PAY-${s.invoiceNumber.replace('INV-', '')}`,
          debit: 0,
          credit: s.paidAmount,
          notes: `Payment for ${s.invoiceNumber}`
        });
      }
    }

    // Sort chronologically
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let running = 0;
    return transactions.map(t => {
      running += t.debit - t.credit;
      return {
        ...t,
        runningBalance: running
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Livestock Traders & Customer Credit Ledger</span>
            <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
              ₹{totalOutstanding.toLocaleString('en-IN')} Total Credit Outstanding
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Credit limits, receivables ledger, and trader purchase tracking for Santhai markets
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={BadgeIndianRupee}
            onClick={() => setQuickActionModal('RECORD_PAYMENT')}
          >
            Record Payment Receipt
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setQuickActionModal('ADD_CUSTOMER')}
          >
            + Add Customer Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customers.map(cust => {
          const availableCredit = Math.max(0, cust.creditLimit - cust.outstandingBalance);
          const isHighCredit = cust.outstandingBalance > cust.creditLimit * 0.7;
          const overdue = overdueAlerts.find(o => o.customerId === cust.id);

          return (
            <div
              key={cust.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{cust.name}</h3>
                    <div className="text-xs text-slate-500 font-medium">{cust.businessName || 'Individual Buyer'}</div>
                  </div>
                  <Badge size="sm" variant={cust.status === 'ACTIVE' ? 'success' : 'danger'}>
                    {cust.status}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{cust.phone}</span>
                  </div>
                  {cust.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{cust.address}</span>
                    </div>
                  )}
                </div>

                {/* Overdue Badge if applicable */}
                {overdue && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="h-3.5 w-3.5 text-rose-600" />
                      <span>{overdue.daysOverdue} days overdue</span>
                    </div>
                    <span className="font-mono font-bold">₹{overdue.totalOverdue.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Credit Status Card */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Credit Limit:</span>
                    <span className="font-bold text-slate-900">₹{cust.creditLimit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Outstanding:</span>
                    <span className={`font-bold ${cust.outstandingBalance > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
                      ₹{cust.outstandingBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Available Credit:</span>
                    <span className={`font-bold ${isHighCredit ? 'text-amber-700' : 'text-emerald-700'}`}>
                      ₹{availableCredit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {isHighCredit && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>Close to maximum approved credit limit.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  icon={FileText}
                  onClick={() => setSelectedLedgerCustomer(cust)}
                >
                  View Ledger
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={BadgeIndianRupee}
                  onClick={() => setQuickActionModal('RECORD_PAYMENT')}
                >
                  Collect Cash
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Financial Ledger Modal */}
      <Modal
        isOpen={!!selectedLedgerCustomer}
        onClose={() => setSelectedLedgerCustomer(null)}
        title={`Customer Financial Ledger: ${selectedLedgerCustomer?.name}`}
        subtitle={`Business: ${selectedLedgerCustomer?.businessName || 'Trader'} • Credit Limit: ₹${selectedLedgerCustomer?.creditLimit.toLocaleString('en-IN')}`}
        maxWidth="2xl"
      >
        {selectedLedgerCustomer && (
          <div className="space-y-4 text-xs">
            {/* Header Metrics */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Purchases</span>
                <span className="font-bold text-slate-900 text-sm">₹{selectedLedgerCustomer.totalPurchases.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Outstanding</span>
                <span className="font-bold text-rose-700 text-sm">₹{selectedLedgerCustomer.outstandingBalance.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Available Credit</span>
                <span className="font-bold text-emerald-700 text-sm">
                  ₹{Math.max(0, selectedLedgerCustomer.creditLimit - selectedLedgerCustomer.outstandingBalance).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Ledger Transactions Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference #</th>
                    <th className="py-2.5 px-3 text-right">Debit (₹)</th>
                    <th className="py-2.5 px-3 text-right">Credit (₹)</th>
                    <th className="py-2.5 px-3 text-right">Running Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getCustomerTransactions(selectedLedgerCustomer.id).map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-mono text-slate-600">{tx.date}</td>
                      <td className="py-2.5 px-3 font-bold">
                        <span className={tx.type === 'INVOICE' ? 'text-amber-800' : 'text-emerald-800'}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{tx.ref}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold">
                        {tx.debit > 0 ? `₹${tx.debit.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-700">
                        {tx.credit > 0 ? `₹${tx.credit.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{tx.runningBalance.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedLedgerCustomer(null)}>Close</Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedLedgerCustomer(null);
                  setQuickActionModal('RECORD_PAYMENT');
                }}
              >
                Record Payment for Trader
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
