'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  QrCode,
  Trash2,
  Plus,
  ShoppingBag,
  CreditCard,
  Printer,
  CheckCircle,
  AlertTriangle,
  User,
  Truck,
  Percent,
  RefreshCw,
  X
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Goat, Customer, SaleItem } from '@/types/farm';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export const PosView: React.FC = () => {
  const { goats, customers, createSale, setActiveTab } = useFarm();

  // POS State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [transportCharges, setTransportCharges] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CREDIT' | 'SPLIT'>('CASH');
  
  // Split payment state
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitUpi, setSplitUpi] = useState<number>(0);
  const [splitCredit, setSplitCredit] = useState<number>(0);

  // Success Receipt Modal
  const [completedSale, setCompletedSale] = useState<any | null>(null);

  // Available goats ready for sale (Active and not in cart)
  const availableGoats = goats.filter(
    g => (g.status === 'ACTIVE' || g.status === 'PREGNANT') && !cart.some(item => item.goatId === g.id)
  );

  const filteredGoats = searchQuery.trim()
    ? availableGoats.filter(
        g =>
          g.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.breed.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableGoats;

  const currentCustomer = customers.find(c => c.id === selectedCustomerId);

  // Calculation
  const subtotal = cart.reduce((acc, item) => acc + item.amount, 0);
  const totalAmount = Math.max(0, subtotal - discountAmount + transportCharges);

  // Credit check
  const availableCredit = currentCustomer ? Math.max(0, currentCustomer.creditLimit - currentCustomer.outstandingBalance) : 0;
  const isCreditExceeded = paymentMethod === 'CREDIT' && totalAmount > availableCredit;

  // Add goat to cart
  const addToCart = (goat: Goat) => {
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

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateRate = (itemId: string, newRate: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const amount = Math.round(item.weightKg * newRate);
          return {
            ...item,
            ratePerKg: newRate,
            amount,
            profitOnGoat: amount - item.trueCostAtSale
          };
        }
        return item;
      })
    );
  };

  // Keyboard Shortcuts (F2, F4, F6, F8, F10, ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        document.getElementById('pos-search-input')?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        document.getElementById('pos-customer-select')?.focus();
      } else if (e.key === 'F6') {
        e.preventDefault();
        const d = prompt('Enter Discount Amount (₹):', String(discountAmount));
        if (d !== null) setDiscountAmount(parseFloat(d) || 0);
      } else if (e.key === 'F8') {
        e.preventDefault();
        setPaymentMethod(prev => prev === 'CASH' ? 'UPI' : prev === 'UPI' ? 'CREDIT' : 'CASH');
      } else if (e.key === 'F10') {
        e.preventDefault();
        if (cart.length > 0) handleCompleteSale();
      } else if (e.key === 'Escape') {
        if (cart.length > 0 && confirm('Clear current sale cart?')) setCart([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    if (!currentCustomer) {
      alert('Please select a customer for this commercial invoice.');
      return;
    }

    let paidAmount = totalAmount;
    let paymentBreakdown = undefined;

    if (paymentMethod === 'CREDIT') {
      paidAmount = 0;
    } else if (paymentMethod === 'SPLIT') {
      paidAmount = splitCash + splitUpi;
      paymentBreakdown = {
        cash: splitCash,
        upi: splitUpi,
        credit: splitCredit
      };
    }

    const sale = createSale({
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      date: new Date().toISOString().substring(0, 10),
      items: cart,
      subtotal,
      discount: discountAmount,
      transportCharges,
      totalAmount,
      paidAmount,
      paymentMethod,
      paymentBreakdown,
      paymentStatus: paidAmount >= totalAmount ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'CREDIT',
      status: 'COMPLETED',
      notes: `POS terminal sale to ${currentCustomer.businessName || currentCustomer.name}`
    });

    setCompletedSale(sale);
    setCart([]);
    setDiscountAmount(0);
    setTransportCharges(0);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Shortcuts Help */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#1B4332]" />
            <span>Fast Commercial POS Terminal</span>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
              Ready for scale weigh-in
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant live-weight rate calculation, trader credit checks, and printable tax receipts
          </p>
        </div>

        {/* Keyboard Shortcuts Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-600 font-mono"><b>F2</b> Search</span>
          <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-600 font-mono"><b>F4</b> Customer</span>
          <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-600 font-mono"><b>F6</b> Discount</span>
          <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-600 font-mono"><b>F8</b> Pay Mode</span>
          <span className="bg-[#1B4332] text-white px-2.5 py-1 rounded font-mono font-bold"><b>F10</b> Complete Sale</span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN (7 COLS): SEARCH & LIVE ANIMAL SELECTOR */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="pos-search-input"
                type="text"
                placeholder="Search tag (G-247), breed, or scan QR code [F2]..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1B4332]"
              />
            </div>
            <button
              onClick={() => {
                if (filteredGoats[0]) addToCart(filteredGoats[0]);
              }}
              title="Simulate instant QR code scanner gun beep"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shrink-0"
            >
              <QrCode className="h-4 w-4 text-[#1B4332]" />
              <span>Simulate Scan</span>
            </button>
          </div>

          {/* Available Livestock Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              <span>Available Live Animals ({filteredGoats.length})</span>
              <span>Click to add into sale</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredGoats.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
                  No animals found matching query or all selected are already in cart.
                </div>
              ) : (
                filteredGoats.map(goat => (
                  <div
                    key={goat.id}
                    onClick={() => addToCart(goat)}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 group-hover:border-emerald-300">
                          {goat.tagNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800">
                          ₹{goat.marketRatePerKg}/kg
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 text-xs mt-1.5">{goat.breed} ({goat.gender === 'MALE' ? 'Buck' : 'Doe'})</div>
                      <div className="text-[11px] text-slate-500">
                        Live Weight: <b className="text-slate-900">{goat.currentWeightKg} kg</b> • ADG: +{goat.adgGrams}g/d
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">Est. Total</span>
                      <span className="font-bold text-slate-900">
                        ₹{Math.round(goat.currentWeightKg * (goat.marketRatePerKg || 460)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 COLS): CURRENT SALE & INVOICE CART */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          {/* Customer Selection & Credit Indicator */}
          <div className="space-y-1.5 border-b border-slate-100 pb-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Customer / Livestock Trader [F4]
            </label>
            <select
              id="pos-customer-select"
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1B4332]"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.businessName} ({c.phone})
                </option>
              ))}
            </select>

            {currentCustomer && (
              <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">APPROVED CREDIT LIMIT</span>
                  <span className="font-bold text-slate-900">₹{currentCustomer.creditLimit.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">AVAILABLE CREDIT</span>
                  <span className={`font-bold ${availableCredit < 10000 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    ₹{availableCredit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            {isCreditExceeded && (
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1.5 mt-1">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span><b>Credit Limit Exceeded!</b> Sale requires manager override.</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Sale Items ({cart.length} Goats)</span>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-100 rounded-xl">
                  No animals in cart. Click an animal from the left or scan RFID tag.
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{item.tagNumber}</span>
                        <span className="text-slate-500 font-medium">{item.breed}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.weightKg} kg × ₹{item.ratePerKg}/kg
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-emerald-700">Profit: +₹{item.profitOnGoat}</div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Financial Adjustments & Totals */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">Discount (₹) [F6]:</span>
              <input
                type="number"
                value={discountAmount}
                onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 rounded-lg border border-slate-200 text-right font-medium focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-slate-400" />
                Transport Logistics (₹):
              </span>
              <input
                type="number"
                value={transportCharges}
                onChange={e => setTransportCharges(parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 rounded-lg border border-slate-200 text-right font-medium focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-base">
              <span className="font-bold text-slate-900">Total Invoice Amount:</span>
              <span className="font-black text-slate-900 text-xl">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment Method Selector [F8] */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Payment Settlement Mode [F8]
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`py-2 rounded-xl font-bold border transition-all ${
                  paymentMethod === 'CASH'
                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                CASH
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`py-2 rounded-xl font-bold border transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT')}
                className={`py-2 rounded-xl font-bold border transition-all ${
                  paymentMethod === 'CREDIT'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                CREDIT
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('SPLIT');
                  setSplitCash(Math.round(totalAmount / 2));
                  setSplitCredit(totalAmount - Math.round(totalAmount / 2));
                }}
                className={`py-2 rounded-xl font-bold border transition-all ${
                  paymentMethod === 'SPLIT'
                    ? 'bg-purple-700 text-white border-purple-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                SPLIT
              </button>
            </div>

            {/* Split breakdown controls */}
            {paymentMethod === 'SPLIT' && (
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 space-y-2 text-xs">
                <span className="font-semibold text-purple-950 block text-[11px]">Mixed Payment Allocation:</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-purple-800 block">Cash (₹)</label>
                    <input
                      type="number"
                      value={splitCash}
                      onChange={e => setSplitCash(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 rounded border border-purple-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-800 block">UPI (₹)</label>
                    <input
                      type="number"
                      value={splitUpi}
                      onChange={e => setSplitUpi(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 rounded border border-purple-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-800 block">Credit (₹)</label>
                    <input
                      type="number"
                      value={splitCredit}
                      onChange={e => setSplitCredit(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 rounded border border-purple-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <Button
              variant="accent"
              size="lg"
              className="w-full py-3 text-base font-bold shadow-md"
              disabled={cart.length === 0}
              onClick={handleCompleteSale}
            >
              Complete Sale & Print Bill [F10]
            </Button>
          </div>
        </div>
      </div>

      {/* PRINTABLE RECEIPT / TAX INVOICE MODAL */}
      <Modal
        isOpen={!!completedSale}
        onClose={() => setCompletedSale(null)}
        title="Commercial Livestock Tax Invoice"
        subtitle="Official sales invoice with traceable tag IDs and weight certified"
        maxWidth="lg"
      >
        {completedSale && (
          <div className="space-y-4 text-xs">
            <div id="printable-receipt" className="p-6 border border-slate-300 rounded-2xl bg-white space-y-4">
              {/* Receipt Header */}
              <div className="text-center border-b border-slate-200 pb-3">
                <div className="text-xl font-black text-slate-900 tracking-tight">MSK COMMERCIAL GOAT FARM</div>
                <div className="text-[11px] text-slate-600 mt-0.5">Pollachi Santhai Road, Coimbatore Dist, Tamil Nadu - 642001</div>
                <div className="text-[10px] text-slate-500">Reg: TN/CBE/GOAT-2024 • Ph: +91 98421 99999</div>
                <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded-md font-mono font-bold text-slate-800">
                  INVOICE: {completedSale.invoiceNumber}
                </div>
              </div>

              {/* Trader Details */}
              <div className="grid grid-cols-2 gap-2 text-slate-700 text-[11px] border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">BILLED TO:</span>
                  <span className="font-bold text-slate-900">{completedSale.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">DATE & TIME:</span>
                  <span className="font-semibold text-slate-800">{completedSale.date}</span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="py-1">Tag No & Breed</th>
                    <th className="py-1 text-center">Live Wt</th>
                    <th className="py-1 text-right">Rate/kg</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedSale.items.map((it: any) => (
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
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{completedSale.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {completedSale.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-₹{completedSale.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {completedSale.transportCharges > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Transport Fee:</span>
                    <span>+₹{completedSale.transportCharges.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span>₹{completedSale.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>Payment Mode:</span>
                  <span className="uppercase">{completedSale.paymentMethod} ({completedSale.paymentStatus})</span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                Thank you for your livestock business! Certified healthy ruminant assets.
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCompletedSale(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                icon={Printer}
                onClick={() => window.print()}
              >
                Print Official Invoice
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
