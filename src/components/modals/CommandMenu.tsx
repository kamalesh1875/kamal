'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Scale,
  ShoppingBag,
  Wheat,
  FileSpreadsheet,
  Users,
  ShieldAlert,
  ArrowRight,
  X
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export const CommandMenu: React.FC = () => {
  const {
    isCommandMenuOpen,
    setIsCommandMenuOpen,
    goats,
    customers,
    sales,
    setActiveTab,
    setSelectedGoatId,
    setQuickActionModal
  } = useFarm();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen(!isCommandMenuOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandMenuOpen, setIsCommandMenuOpen]);

  if (!isCommandMenuOpen) return null;

  const filteredGoats = query.trim()
    ? goats.filter(g =>
        g.tagNumber.toLowerCase().includes(query.toLowerCase()) ||
        g.breed.toLowerCase().includes(query.toLowerCase()) ||
        g.rfidTag?.toLowerCase().includes(query.toLowerCase())
      )
    : goats.slice(0, 3);

  const filteredCustomers = query.trim()
    ? customers.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.businessName?.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query)
      )
    : customers.slice(0, 2);

  const handleSelectGoat = (goatId: string) => {
    setSelectedGoatId(goatId);
    setActiveTab('goats');
    setIsCommandMenuOpen(false);
  };

  const handleSelectCustomer = () => {
    setActiveTab('customers');
    setIsCommandMenuOpen(false);
  };

  const handleAction = (action: 'ADD_GOAT' | 'POS_SALE' | 'RECORD_WEIGHT' | 'RECORD_EXPENSE' | 'ISSUE_FEED') => {
    setQuickActionModal(action);
    setIsCommandMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCommandMenuOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Type a tag number (e.g. G-247), breed, customer, or action..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsCommandMenuOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          <div>
            <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Quick Actions
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleAction('POS_SALE')}
                className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-amber-50 hover:text-amber-900 border border-transparent hover:border-amber-200 transition-colors"
              >
                <div className="h-6 w-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ShoppingBag className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900">New POS Sale</span>
                  <span className="text-[10px] text-slate-400">Launch checkout terminal</span>
                </div>
              </button>

              <button
                onClick={() => handleAction('ADD_GOAT')}
                className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-emerald-50 hover:text-emerald-900 border border-transparent hover:border-emerald-200 transition-colors"
              >
                <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Plus className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900">Register Goat</span>
                  <span className="text-[10px] text-slate-400">Add asset to registry</span>
                </div>
              </button>

              <button
                onClick={() => handleAction('RECORD_WEIGHT')}
                className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-sky-50 hover:text-sky-900 border border-transparent hover:border-sky-200 transition-colors"
              >
                <div className="h-6 w-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Scale className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900">Record Weight</span>
                  <span className="text-[10px] text-slate-400">Track ADG gain</span>
                </div>
              </button>

              <button
                onClick={() => handleAction('ISSUE_FEED')}
                className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-emerald-50 hover:text-emerald-900 border border-transparent hover:border-emerald-200 transition-colors"
              >
                <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Wheat className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900">Issue Feed</span>
                  <span className="text-[10px] text-slate-400">Allocate cost to pen</span>
                </div>
              </button>
            </div>
          </div>

          {/* Goats Section */}
          <div>
            <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Goats ({filteredGoats.length})
            </div>
            <div className="space-y-1">
              {filteredGoats.map(g => (
                <button
                  key={g.id}
                  onClick={() => handleSelectGoat(g.id)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      {g.tagNumber}
                    </span>
                    <div>
                      <div className="font-medium text-slate-900">{g.breed} • {g.gender}</div>
                      <div className="text-[11px] text-slate-500">
                        {g.currentWeightKg} kg • ADG: +{g.adgGrams}g/d • Cost: ₹{g.trueCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      g.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                      g.status === 'PREGNANT' ? 'bg-sky-100 text-sky-800' :
                      g.status === 'QUARANTINE' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {g.status}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Customers Section */}
          {filteredCustomers.length > 0 && (
            <div>
              <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Customers ({filteredCustomers.length})
              </div>
              <div className="space-y-1">
                {filteredCustomers.map(c => (
                  <button
                    key={c.id}
                    onClick={handleSelectCustomer}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {c.name.substring(0, 1)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{c.name} ({c.businessName})</div>
                        <div className="text-[11px] text-slate-500">{c.phone}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-medium text-rose-600 block">
                        ₹{c.outstandingBalance.toLocaleString('en-IN')} due
                      </span>
                      <span className="text-[10px] text-slate-400">Limit: ₹{c.creditLimit.toLocaleString('en-IN')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Navigate with arrows or click</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
