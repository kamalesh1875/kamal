'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Camera,
  Plus,
  Trash2,
  BadgeIndianRupee,
  CheckCircle2,
  Printer,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Goat, Customer, SaleItem } from '@/types/farm';

interface MobilePosViewProps {
  onOpenScanner?: () => void;
}

export const MobilePosView: React.FC<MobilePosViewProps> = ({ onOpenScanner }) => {
  const { goats, customers, createSale } = useFarm();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [transport, setTransport] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'CREDIT' | 'SPLIT'>('CASH');
  const [completedSale, setCompletedSale] = useState<any | null>(null);

  // Available Goats for Sale (Active and not in cart)
  const availableGoats = goats.filter(
    g => (g.status === 'ACTIVE' || g.status === 'PREGNANT') && !cart.some(c => c.goatId === g.id)
  );

  const subtotal = cart.reduce((acc, item) => acc + item.amount, 0);
  const grandTotal = Math.max(0, subtotal - discount + transport);

  const currentCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleAddGoatToCart = (goat: Goat) => {
    const rate = goat.marketRatePerKg || 460;
    const amount = Math.round(goat.currentWeightKg * rate);
    const item: SaleItem = {
      id: `si-${Date.now()}-${goat.id}`,
      goatId: goat.id,
      tagNumber: goat.tagNumber,
      breed: goat.breed,
      weightKg: goat.currentWeightKg,
      ratePerKg: rate,
      amount,
      trueCostAtSale: goat.trueCost,
      profitOnGoat: amount - goat.trueCost
    };
    setCart(prev => [...prev, item]);
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handleCompleteSale = () => {
    if (cart.length === 0 || !currentCustomer) return;

    const paidAmount = paymentMode === 'CREDIT' ? 0 : grandTotal;

    const sale = createSale({
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      date: new Date().toISOString().substring(0, 10),
      items: cart,
      subtotal,
      discount,
      transportCharges: transport,
      totalAmount: grandTotal,
      paidAmount,
      paymentMethod: paymentMode,
      paymentStatus: paidAmount >= grandTotal ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'CREDIT',
      status: 'COMPLETED',
      notes: `Mobile POS sale to ${currentCustomer.businessName || currentCustomer.name}`
    });

    setCompletedSale(sale);
    setCart([]);
    setDiscount(0);
    setTransport(0);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <ShoppingBag className="h-4 w-4 text-[#1B4332]" />
            <span>Mobile POS Terminal</span>
          </h2>
          <p className="text-[11px] text-slate-500">Live scale billing & tax invoice</p>
        </div>
        {onOpenScanner && (
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Scan Tag</span>
          </button>
        )}
      </div>

      {/* Customer Selection Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase block">Select Trader / Buyer</label>
        <select
          value={selectedCustomerId}
          onChange={e => setSelectedCustomerId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:bg-white"
        >
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.businessName || 'Trader'}) — Due: ₹{c.outstandingBalance.toLocaleString('en-IN')}
            </option>
          ))}
        </select>
      </div>

      {/* Cart Summary */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-bold text-xs text-slate-900 uppercase">
            Sale Cart ({cart.length} Goats Selected)
          </span>
          <span className="text-xs font-bold text-emerald-800">
            Subtotal: ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            No goats in cart. Tap available animals below to add.
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900">{item.tagNumber}</span>
                  <span className="text-slate-400 ml-2">({item.weightKg}kg @ ₹{item.ratePerKg}/kg)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Adjustments: Discount & Transport */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Discount (₹)</label>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Transport (₹)</label>
            <input
              type="number"
              value={transport}
              onChange={e => setTransport(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
            />
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="pt-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Payment Mode</label>
          <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-semibold">
            {(['CASH', 'UPI', 'CREDIT', 'SPLIT'] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentMode(mode)}
                className={`py-2 rounded-xl transition-all ${
                  paymentMode === mode
                    ? 'bg-[#1B4332] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Grand Total & Finalize Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Invoice Total</span>
            <span className="text-xl font-extrabold text-slate-900">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={handleCompleteSale}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm active:scale-98"
          >
            <span>Complete Sale</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Available Goats Carousel to Add with 1 Tap */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-500 uppercase px-1">
          Add Available Goats ({availableGoats.length})
        </div>
        <div className="grid grid-cols-2 gap-2">
          {availableGoats.map(g => (
            <button
              key={g.id}
              onClick={() => handleAddGoatToCart(g)}
              className="p-3 rounded-2xl bg-white border border-slate-200 text-left shadow-2xs hover:border-emerald-500 active:scale-98 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-900">{g.tagNumber}</span>
                <span className="text-[11px] font-bold text-emerald-800">{g.currentWeightKg}kg</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{g.breed}</div>
              <div className="text-[11px] font-semibold text-slate-700 mt-1">
                ≈ ₹{Math.round(g.currentWeightKg * (g.marketRatePerKg || 460)).toLocaleString('en-IN')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Completed Sale Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Sale Invoice Generated</h3>
              <p className="font-mono text-xs font-bold text-emerald-700 mt-0.5">{completedSale.invoiceNumber}</p>
              <p className="text-xs text-slate-500 mt-1">
                {completedSale.customerName} • ₹{completedSale.totalAmount.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-700 flex items-center justify-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#1B4332] text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
