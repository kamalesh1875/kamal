'use client';

import React from 'react';
import { Users, Plus, Phone, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const CustomersView: React.FC = () => {
  const { customers, setQuickActionModal } = useFarm();

  const totalOutstanding = customers.reduce((acc, c) => acc + c.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Livestock Traders & Customer Credit Profiles</span>
            <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
              ₹{totalOutstanding.toLocaleString('en-IN')} Total Credit Outstanding
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Credit limits, receivables ledger, and trader purchase tracking for Santhai markets
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setQuickActionModal('ADD_CUSTOMER')}
        >
          + Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customers.map(cust => {
          const availableCredit = Math.max(0, cust.creditLimit - cust.outstandingBalance);
          const isHighCredit = cust.outstandingBalance > cust.creditLimit * 0.7;

          return (
            <div
              key={cust.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{cust.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">{cust.businessName || 'Individual Buyer'}</div>
                </div>
                <Badge size="sm" variant={cust.status === 'ACTIVE' ? 'success' : 'danger'}>
                  {cust.status}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
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
          );
        })}
      </div>
    </div>
  );
};
