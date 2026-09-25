'use client';

import React, { useState } from 'react';
import { useFarm } from '@/context/FarmContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Gender, GoatStatus } from '@/types/farm';

export const QuickActionModals: React.FC = () => {
  const {
    quickActionModal,
    setQuickActionModal,
    goats,
    pens,
    inventory,
    addGoat,
    recordWeight,
    issueFeed,
    addExpense,
    addCustomer
  } = useFarm();

  // Add Goat Form State
  const [goatForm, setGoatForm] = useState({
    tagNumber: `G-${String(Math.floor(1000 + Math.random() * 9000))}`,
    rfidTag: '',
    breed: 'Kanni',
    gender: 'MALE' as Gender,
    birthDate: '2026-03-01',
    ageMonths: 6,
    penId: 'pen-1',
    status: 'ACTIVE' as GoatStatus,
    currentWeightKg: 28.5,
    targetWeightKg: 35.0,
    purchasePrice: 6500,
    purchaseDate: new Date().toISOString().substring(0, 10),
    marketRatePerKg: 460,
    damTag: '',
    sireTag: '',
    notes: ''
  });

  // Record Weight Form State
  const [weightGoatId, setWeightGoatId] = useState(goats[0]?.id || '');
  const [newWeightKg, setNewWeightKg] = useState<number>(35.0);
  const [weightNotes, setWeightNotes] = useState('');

  // Issue Feed Form State
  const [feedItemId, setFeedItemId] = useState(inventory[0]?.id || '');
  const [feedQuantityKg, setFeedQuantityKg] = useState<number>(25);
  const [targetPenId, setTargetPenId] = useState('pen-1');
  const [feedNotes, setFeedNotes] = useState('');

  // Record Expense Form State
  const [expenseCategory, setExpenseCategory] = useState<'FEED' | 'VETERINARY' | 'LABOR' | 'UTILITIES' | 'TRANSPORT' | 'OTHER'>('FEED');
  const [expenseAmount, setExpenseAmount] = useState<number>(3500);
  const [expensePaidTo, setExpensePaidTo] = useState('');
  const [expenseMethod, setExpenseMethod] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER'>('UPI');
  const [expenseDesc, setExpenseDesc] = useState('');

  // Add Customer Form State
  const [custName, setCustName] = useState('');
  const [custBusiness, setCustBusiness] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCreditLimit, setCustCreditLimit] = useState<number>(50000);
  const [custAddress, setCustAddress] = useState('');

  const selectedWeightGoat = goats.find(g => g.id === weightGoatId);
  const selectedFeedItem = inventory.find(i => i.id === feedItemId);

  return (
    <>
      {/* 1. REGISTER GOAT MODAL */}
      <Modal
        isOpen={quickActionModal === 'ADD_GOAT'}
        onClose={() => setQuickActionModal(null)}
        title="Register Livestock Asset (Goat)"
        subtitle="Create verifiable digital identity with intake weight and economic basis"
        maxWidth="2xl"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            addGoat({
              ...goatForm,
              initialWeightKg: Number(goatForm.currentWeightKg),
              currentWeightKg: Number(goatForm.currentWeightKg),
              targetWeightKg: Number(goatForm.targetWeightKg),
              adgGrams: 0,
              lastWeighedDate: goatForm.purchaseDate,
              purchasePrice: Number(goatForm.purchasePrice),
              marketRatePerKg: Number(goatForm.marketRatePerKg)
            });
            setQuickActionModal(null);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tag Number *</label>
              <input
                type="text"
                required
                value={goatForm.tagNumber}
                onChange={e => setGoatForm({ ...goatForm, tagNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">RFID / EPC Code</label>
              <input
                type="text"
                placeholder="RFID-982-XXXX"
                value={goatForm.rfidTag}
                onChange={e => setGoatForm({ ...goatForm, rfidTag: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Breed *</label>
              <select
                value={goatForm.breed}
                onChange={e => setGoatForm({ ...goatForm, breed: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              >
                <option value="Kanni">Kanni (TN Pure)</option>
                <option value="Salem Black">Salem Black</option>
                <option value="Kodi Aadu">Kodi Aadu</option>
                <option value="Boer Cross">Boer Cross</option>
                <option value="Tellicherry">Tellicherry (Malabari)</option>
                <option value="Sirohi">Sirohi</option>
                <option value="Jamnapari">Jamnapari</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gender *</label>
              <select
                value={goatForm.gender}
                onChange={e => setGoatForm({ ...goatForm, gender: e.target.value as Gender })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              >
                <option value="MALE">Male (Buck)</option>
                <option value="FEMALE">Female (Doe)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Assigned Pen *</label>
              <select
                value={goatForm.penId}
                onChange={e => setGoatForm({ ...goatForm, penId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              >
                {pens.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.currentCount}/{p.capacity})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status</label>
              <select
                value={goatForm.status}
                onChange={e => setGoatForm({ ...goatForm, status: e.target.value as GoatStatus })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              >
                <option value="ACTIVE">Active (Healthy)</option>
                <option value="PREGNANT">Pregnant</option>
                <option value="QUARANTINE">Quarantine (Isolation)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Intake Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={goatForm.currentWeightKg}
                onChange={e => setGoatForm({ ...goatForm, currentWeightKg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={goatForm.targetWeightKg}
                onChange={e => setGoatForm({ ...goatForm, targetWeightKg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Purchase Price (₹) *</label>
              <input
                type="number"
                required
                value={goatForm.purchasePrice}
                onChange={e => setGoatForm({ ...goatForm, purchasePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Est. Rate/kg (₹)</label>
              <input
                type="number"
                value={goatForm.marketRatePerKg}
                onChange={e => setGoatForm({ ...goatForm, marketRatePerKg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setQuickActionModal(null)}>Cancel</Button>
            <Button variant="primary" type="submit">Save & Register Goat</Button>
          </div>
        </form>
      </Modal>

      {/* 2. RECORD WEIGHT MODAL */}
      <Modal
        isOpen={quickActionModal === 'RECORD_WEIGHT'}
        onClose={() => setQuickActionModal(null)}
        title="Record Live Animal Weight"
        subtitle="Computes Average Daily Gain (ADG) and refreshes live asset valuation"
        maxWidth="lg"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            if (weightGoatId && newWeightKg > 0) {
              recordWeight(weightGoatId, Number(newWeightKg), weightNotes);
              setQuickActionModal(null);
            }
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Goat Asset *</label>
            <select
              value={weightGoatId}
              onChange={e => {
                setWeightGoatId(e.target.value);
                const g = goats.find(item => item.id === e.target.value);
                if (g) setNewWeightKg(g.currentWeightKg);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-[#1B4332]"
            >
              {goats.filter(g => g.status !== 'SOLD').map(g => (
                <option key={g.id} value={g.id}>
                  {g.tagNumber} — {g.breed} ({g.gender}) | Currently: {g.currentWeightKg} kg
                </option>
              ))}
            </select>
          </div>

          {selectedWeightGoat && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">PREVIOUS WEIGHT</span>
                <span className="text-sm font-bold text-slate-900">{selectedWeightGoat.currentWeightKg} kg</span>
                <span className="text-[10px] text-slate-400 block">Weighed: {selectedWeightGoat.lastWeighedDate}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">CURRENT ADG</span>
                <span className="text-sm font-bold text-emerald-600">+{selectedWeightGoat.adgGrams} g/day</span>
              </div>
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">New Scale Reading (kg) *</label>
            <input
              type="number"
              step="0.1"
              required
              value={newWeightKg}
              onChange={e => setNewWeightKg(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:outline-none focus:border-[#1B4332]"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Weighing Notes / Observations</label>
            <input
              type="text"
              placeholder="e.g. Vigorous appetite, weighed before morning feeding"
              value={weightNotes}
              onChange={e => setWeightNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B4332]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setQuickActionModal(null)}>Cancel</Button>
            <Button variant="primary" type="submit">Update Weight & Calculate ADG</Button>
          </div>
        </form>
      </Modal>

      {/* 3. ISSUE FEED MODAL */}
      <Modal
        isOpen={quickActionModal === 'ISSUE_FEED'}
        onClose={() => setQuickActionModal(null)}
        title="Issue Feed / Inventory to Shed"
        subtitle="Automatically deduces inventory stock and distributes true feed cost across pen goats"
        maxWidth="lg"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            if (feedItemId && feedQuantityKg > 0) {
              issueFeed(feedItemId, Number(feedQuantityKg), targetPenId, feedNotes);
              setQuickActionModal(null);
            }
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Feed or Inventory Item *</label>
            <select
              value={feedItemId}
              onChange={e => setFeedItemId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
            >
              {inventory.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} — Current: {item.currentStock} {item.unit} (₹{item.costPerUnit}/{item.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quantity to Issue ({selectedFeedItem?.unit || 'kg'}) *</label>
              <input
                type="number"
                step="0.5"
                required
                value={feedQuantityKg}
                onChange={e => setFeedQuantityKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Destination Pen *</label>
              <select
                value={targetPenId}
                onChange={e => setTargetPenId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              >
                {pens.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.currentCount} active goats)</option>
                ))}
              </select>
            </div>
          </div>

          {selectedFeedItem && (
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 flex items-center justify-between text-emerald-950">
              <div>
                <span className="text-[10px] text-emerald-700 block font-semibold">TOTAL TRANSACTION VALUE</span>
                <span className="text-base font-bold">₹{(feedQuantityKg * selectedFeedItem.costPerUnit).toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-700 block font-semibold">PROJECTED CLOSING STOCK</span>
                <span className="text-sm font-bold">{Math.max(0, selectedFeedItem.currentStock - feedQuantityKg)} {selectedFeedItem.unit}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setQuickActionModal(null)}>Cancel</Button>
            <Button variant="primary" type="submit">Confirm & Deduct Stock</Button>
          </div>
        </form>
      </Modal>

      {/* 4. RECORD EXPENSE MODAL */}
      <Modal
        isOpen={quickActionModal === 'RECORD_EXPENSE'}
        onClose={() => setQuickActionModal(null)}
        title="Record Farm Operational Expense"
        subtitle="Log farm overheads, vet fees, utilities, or wages into the financial ledger"
        maxWidth="lg"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            addExpense({
              category: expenseCategory,
              amount: Number(expenseAmount),
              date: new Date().toISOString().substring(0, 10),
              paidTo: expensePaidTo || 'Supplier',
              paymentMethod: expenseMethod,
              description: expenseDesc || `${expenseCategory} payment`
            });
            setQuickActionModal(null);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expense Category *</label>
              <select
                value={expenseCategory}
                onChange={e => setExpenseCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              >
                <option value="FEED">Feed & Nutrition</option>
                <option value="VETERINARY">Veterinary & Medicines</option>
                <option value="LABOR">Labor & Shed Wages</option>
                <option value="UTILITIES">Electricity & Water</option>
                <option value="TRANSPORT">Animal Transport & Logistics</option>
                <option value="MAINTENANCE">Shed Repairs & Infrastructure</option>
                <option value="OTHER">General Miscellaneous</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                value={expenseAmount}
                onChange={e => setExpenseAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1B4332]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Paid To / Vendor Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Suguna Agro, Dr. Ramanathan, TANGEDCO"
                value={expensePaidTo}
                onChange={e => setExpensePaidTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
              <select
                value={expenseMethod}
                onChange={e => setExpenseMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="CASH">Cash in Hand</option>
                <option value="BANK_TRANSFER">NEFT / Bank Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description / Bill Memo</label>
            <input
              type="text"
              placeholder="e.g. Shed lighting wiring replacement or feed dispatch invoice"
              value={expenseDesc}
              onChange={e => setExpenseDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B4332]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setQuickActionModal(null)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Expense into Ledger</Button>
          </div>
        </form>
      </Modal>

      {/* 5. ADD CUSTOMER MODAL */}
      <Modal
        isOpen={quickActionModal === 'ADD_CUSTOMER'}
        onClose={() => setQuickActionModal(null)}
        title="Create Customer & Credit Profile"
        subtitle="Manage livestock traders, slaughterhouses, and retail buyers with credit rules"
        maxWidth="lg"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            addCustomer({
              name: custName,
              businessName: custBusiness,
              phone: custPhone,
              creditLimit: Number(custCreditLimit),
              address: custAddress,
              status: 'ACTIVE'
            });
            setQuickActionModal(null);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contact Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kumar"
                value={custName}
                onChange={e => setCustName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Business Name</label>
              <input
                type="text"
                placeholder="e.g. Kumar Goat Traders"
                value={custBusiness}
                onChange={e => setCustBusiness(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B4332]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile / Phone *</label>
              <input
                type="text"
                required
                placeholder="+91 98421 XXXXX"
                value={custPhone}
                onChange={e => setCustPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Approved Credit Limit (₹)</label>
              <input
                type="number"
                value={custCreditLimit}
                onChange={e => setCustCreditLimit(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#1B4332]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Market Address / Location</label>
            <input
              type="text"
              placeholder="e.g. Santhai Bazaar, Pollachi"
              value={custAddress}
              onChange={e => setCustAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B4332]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setQuickActionModal(null)}>Cancel</Button>
            <Button variant="primary" type="submit">Create Customer Profile</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
