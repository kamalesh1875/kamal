'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Scale,
  Activity,
  ArrowUpDown,
  ChevronRight,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgeIndianRupee,
  Wheat,
  Syringe,
  QrCode,
  Printer,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type ProfileTab = 'OVERVIEW' | 'WEIGHT' | 'HEALTH' | 'VACCINES' | 'FEED' | 'EXPENSES' | 'SALES' | 'TIMELINE' | 'DOCUMENTS';

export const GoatsView: React.FC = () => {
  const {
    goats,
    pens,
    weightRecords,
    healthRecords,
    selectedGoatId,
    setSelectedGoatId,
    setQuickActionModal
  } = useFarm();

  const [searchQuery, setSearchQuery] = useState('');
  const [breedFilter, setBreedFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [penFilter, setPenFilter] = useState('ALL');
  const [minWeightFilter, setMinWeightFilter] = useState<string>('');
  const [maxWeightFilter, setMaxWeightFilter] = useState<string>('');
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('OVERVIEW');

  // Filtered List
  const filteredGoats = goats.filter(g => {
    const matchesSearch =
      g.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.rfidTag && g.rfidTag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.notes && g.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBreed = breedFilter === 'ALL' || g.breed === breedFilter;
    const matchesGender = genderFilter === 'ALL' || g.gender === genderFilter;
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    const matchesPen = penFilter === 'ALL' || g.penId === penFilter;
    const matchesMinWeight = minWeightFilter === '' || g.currentWeightKg >= parseFloat(minWeightFilter);
    const matchesMaxWeight = maxWeightFilter === '' || g.currentWeightKg <= parseFloat(maxWeightFilter);

    return matchesSearch && matchesBreed && matchesGender && matchesStatus && matchesPen && matchesMinWeight && matchesMaxWeight;
  });

  const selectedGoat = goats.find(g => g.id === selectedGoatId) || filteredGoats[0] || goats[0];
  const goatWeights = selectedGoat
    ? weightRecords
        .filter(w => w.goatId === selectedGoat.id)
        .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
    : [];
  const goatHealth = selectedGoat
    ? healthRecords.filter(h => h.goatId === selectedGoat.id).sort((a, b) => new Date(b.administeredAt).getTime() - new Date(a.administeredAt).getTime())
    : [];

  const selectedPen = pens.find(p => p.id === selectedGoat?.penId);

  // Check if weight decreased compared to second to last record
  const isWeightDecreased =
    goatWeights.length >= 2 &&
    goatWeights[goatWeights.length - 1].weightKg < goatWeights[goatWeights.length - 2].weightKg;
  const weightDropAmount = isWeightDecreased
    ? (goatWeights[goatWeights.length - 2].weightKg - goatWeights[goatWeights.length - 1].weightKg).toFixed(1)
    : 0;

  // Real CSV Manifest Export
  const handleExportCSV = () => {
    const headers = [
      'Tag Number',
      'RFID Tag',
      'Breed',
      'Gender',
      'Age (Months)',
      'Pen',
      'Status',
      'Current Weight (kg)',
      'ADG (g/day)',
      'Last Weighed',
      'Purchase Price (INR)',
      'Feed Cost (INR)',
      'Medicine Cost (INR)',
      'Labor Cost (INR)',
      'True Cost (INR)',
      'Est. Market Value (INR)',
      'Projected Profit (INR)'
    ];

    const rows = filteredGoats.map(g => [
      g.tagNumber,
      g.rfidTag || '',
      g.breed,
      g.gender,
      g.ageMonths,
      pens.find(p => p.id === g.penId)?.name || g.penId,
      g.status,
      g.currentWeightKg,
      g.adgGrams,
      g.lastWeighedDate,
      g.purchasePrice,
      g.accumulatedFeedCost,
      g.accumulatedMedicineCost,
      g.accumulatedLaborCost,
      g.trueCost,
      g.estimatedMarketValue,
      g.projectedProfit
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `msk_goats_manifest_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Living Asset Registry</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {filteredGoats.length} of {goats.length} Animals Tracked
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Traceable physical growth, veterinary interventions, and true cost accumulation per animal
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExportCSV}
          >
            Export CSV Manifest
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setQuickActionModal('ADD_GOAT')}
          >
            + Register Goat
          </Button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ENTERPRISE DATA TABLE */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Combinable Filter Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tag (G-00247), breed, RFID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
                />
              </div>

              <select
                value={breedFilter}
                onChange={e => setBreedFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Breeds</option>
                <option value="Kanni">Kanni</option>
                <option value="Salem Black">Salem Black</option>
                <option value="Kodi Aadu">Kodi Aadu</option>
                <option value="Boer Cross">Boer Cross</option>
                <option value="Tellicherry">Tellicherry</option>
                <option value="Sirohi">Sirohi</option>
              </select>

              <select
                value={genderFilter}
                onChange={e => setGenderFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Sex</option>
                <option value="MALE">Male (Buck)</option>
                <option value="FEMALE">Female (Doe)</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PREGNANT">Pregnant</option>
                <option value="QUARANTINE">Quarantine</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>

            {/* Additional Secondary Filters */}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-200/60 text-slate-600">
              <span className="font-semibold text-slate-500 text-[11px]">Shed:</span>
              <select
                value={penFilter}
                onChange={e => setPenFilter(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs"
              >
                <option value="ALL">All Pens</option>
                {pens.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <span className="font-semibold text-slate-500 text-[11px] ml-2">Weight Range:</span>
              <input
                type="number"
                placeholder="Min kg"
                value={minWeightFilter}
                onChange={e => setMinWeightFilter(e.target.value)}
                className="w-16 px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max kg"
                value={maxWeightFilter}
                onChange={e => setMaxWeightFilter(e.target.value)}
                className="w-16 px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs"
              />

              {(minWeightFilter || maxWeightFilter || penFilter !== 'ALL' || breedFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setBreedFilter('ALL');
                    setGenderFilter('ALL');
                    setStatusFilter('ALL');
                    setPenFilter('ALL');
                    setMinWeightFilter('');
                    setMaxWeightFilter('');
                    setSearchQuery('');
                  }}
                  className="text-xs text-rose-600 font-semibold hover:underline ml-auto"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 sticky top-0 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold z-10">
                <tr>
                  <th className="py-2.5 px-3">Tag #</th>
                  <th className="py-2.5 px-3">Breed & Sex</th>
                  <th className="py-2.5 px-3">Pen</th>
                  <th className="py-2.5 px-3 text-right">Live Wt</th>
                  <th className="py-2.5 px-3 text-right">ADG</th>
                  <th className="py-2.5 px-3 text-right">True Cost</th>
                  <th className="py-2.5 px-3 text-right">Est. Value</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGoats.map(goat => {
                  const isSelected = selectedGoat?.id === goat.id;
                  const pen = pens.find(p => p.id === goat.penId);

                  return (
                    <tr
                      key={goat.id}
                      onClick={() => setSelectedGoatId(goat.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/80 font-medium' : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-slate-900">{goat.tagNumber}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{goat.rfidTag || 'NO RFID'}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-slate-900 font-semibold">{goat.breed}</div>
                        <div className="text-[11px] text-slate-500">{goat.gender === 'MALE' ? 'Buck' : 'Doe'} • {goat.ageMonths}m</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">
                        {pen?.name.split(' ')[0] || goat.penId}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {goat.currentWeightKg} kg
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-semibold text-emerald-700">+{goat.adgGrams} g/d</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                        ₹{goat.trueCost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{goat.estimatedMarketValue.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge
                          size="sm"
                          variant={
                            goat.status === 'ACTIVE' ? 'success' :
                            goat.status === 'PREGNANT' ? 'info' :
                            goat.status === 'QUARANTINE' ? 'danger' : 'neutral'
                          }
                        >
                          {goat.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: 9-TAB DEEP ECONOMIC PROFILE */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          {selectedGoat ? (
            <>
              {/* Profile Card Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center text-2xl shadow-xs">
                      🐐
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 font-mono">
                          {selectedGoat.tagNumber}
                        </h2>
                        <Badge
                          size="sm"
                          variant={
                            selectedGoat.status === 'ACTIVE' ? 'success' :
                            selectedGoat.status === 'PREGNANT' ? 'info' :
                            selectedGoat.status === 'QUARANTINE' ? 'danger' : 'neutral'
                          }
                        >
                          {selectedGoat.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedGoat.breed} • {selectedGoat.gender === 'MALE' ? 'Male Buck' : 'Female Doe'} • {selectedGoat.ageMonths} Months • Pen: {selectedPen?.name || selectedGoat.penId}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveProfileTab('DOCUMENTS')}
                    className="p-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-center"
                  >
                    <QrCode className="h-5 w-5 text-slate-700 mx-auto" />
                    <span className="text-[9px] font-mono text-slate-500 block mt-0.5">QR PASS</span>
                  </button>
                </div>

                {/* Weight Decrease Warning Alert if detected */}
                {isWeightDecreased && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-xs">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Scale Alert: Weight decrease of {weightDropAmount} kg noted.</span>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Does not automatically indicate disease. Verify scale calibration, watering status or deworming interval before medical treatment.
                      </p>
                    </div>
                  </div>
                )}

                {/* 3 Key Metrics Banner */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Scale Weight</span>
                    <span className="text-base font-bold text-slate-900">{selectedGoat.currentWeightKg} kg</span>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <span className="text-[10px] text-emerald-700 block font-semibold uppercase">Daily Gain</span>
                    <span className="text-base font-bold text-emerald-800">+{selectedGoat.adgGrams} g/d</span>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <span className="text-[10px] text-amber-700 block font-semibold uppercase">Est. Value</span>
                    <span className="text-base font-bold text-amber-900">₹{selectedGoat.estimatedMarketValue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Comprehensive 9 Subtabs Navigation */}
              <div className="flex border-b border-slate-200 text-xs font-semibold overflow-x-auto scrollbar-none gap-1 pb-1">
                {[
                  { id: 'OVERVIEW', label: 'Overview' },
                  { id: 'WEIGHT', label: 'Weight & ADG' },
                  { id: 'HEALTH', label: 'Health' },
                  { id: 'VACCINES', label: 'Vaccination' },
                  { id: 'FEED', label: 'Feed & FCR' },
                  { id: 'EXPENSES', label: 'Expenses' },
                  { id: 'SALES', label: 'Sales & Margin' },
                  { id: 'TIMELINE', label: 'Timeline' },
                  { id: 'DOCUMENTS', label: 'Documents & QR' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProfileTab(tab.id as ProfileTab)}
                    className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      activeProfileTab === tab.id
                        ? 'bg-[#1B4332] text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW & COST ENGINE */}
              {activeProfileTab === 'OVERVIEW' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                        <BadgeIndianRupee className="h-3.5 w-3.5 text-emerald-700" />
                        True Cost Engine Breakdown
                      </span>
                      <span className="text-[11px] font-bold text-slate-900">
                        Total Invested: ₹{selectedGoat.trueCost.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between text-slate-600">
                        <span>Purchase Price (Intake):</span>
                        <span className="font-semibold text-slate-900">₹{selectedGoat.purchasePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Feed & Supplement Allocation:</span>
                        <span className="font-semibold text-slate-900">₹{selectedGoat.accumulatedFeedCost.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Veterinary & Vaccine Costs:</span>
                        <span className="font-semibold text-slate-900">₹{selectedGoat.accumulatedMedicineCost.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Farm Labor Overhead Allocation:</span>
                        <span className="font-semibold text-slate-900">₹{selectedGoat.accumulatedLaborCost.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Shed / Utility Overheads:</span>
                        <span className="font-semibold text-slate-900">₹{selectedGoat.accumulatedOverheadCost.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">DAM (MOTHER)</span>
                      <span className="font-mono font-bold text-slate-800">{selectedGoat.damTag || 'TN-DAM-LOCAL'}</span>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">SIRE (FATHER)</span>
                      <span className="font-mono font-bold text-slate-800">{selectedGoat.sireTag || 'STUD-TITAN'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: WEIGHT PROGRESSION CHART */}
              {activeProfileTab === 'WEIGHT' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Growth Trajectory & Scale Checkpoints</h3>
                    <Button
                      size="sm"
                      variant="primary"
                      icon={Scale}
                      onClick={() => setQuickActionModal('RECORD_WEIGHT')}
                    >
                      Record Weight
                    </Button>
                  </div>

                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={goatWeights}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="recordedAt" tick={{ fontSize: 10 }} />
                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '12px', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="weightKg" name="Weight (kg)" stroke="#1B4332" strokeWidth={3} dot={{ r: 4, fill: '#1B4332' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {goatWeights.map((w, idx) => (
                      <div key={w.id} className="p-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{w.weightKg} kg</span>
                          <span className="text-[11px] text-slate-400 ml-2">({w.recordedAt})</span>
                          <span className="text-[10px] text-slate-500 block">{w.notes}</span>
                        </div>
                        <span className="text-emerald-700 font-semibold">
                          {idx === 0 ? 'Intake baseline' : `+${w.adgGrams} g/day`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: HEALTH */}
              {activeProfileTab === 'HEALTH' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Veterinary Observations & Treatments</h3>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Clinical Certified</span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {goatHealth.map(h => (
                      <div key={h.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{h.title}</span>
                          <span className="font-semibold text-slate-700">₹{h.cost}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {h.medicineName} ({h.dosage}) • {h.vetName}
                        </div>
                        <div className="text-[10px] text-slate-400">Date: {h.administeredAt}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: VACCINATION */}
              {activeProfileTab === 'VACCINES' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900">Immunization Schedule & Booster Calendar</h3>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-emerald-950">Raksha PPR Vaccine</div>
                        <div className="text-[11px] text-emerald-800">Administered: 2026-05-02 • Annual dose</div>
                      </div>
                      <Badge variant="success" size="sm">Valid</Badge>
                    </div>

                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-emerald-950">Enterotoxemia (ET) Toxoid</div>
                        <div className="text-[11px] text-emerald-800">Administered: 2026-06-14 • Bi-annual dose</div>
                      </div>
                      <Badge variant="success" size="sm">Valid</Badge>
                    </div>

                    <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-amber-950">Goat Pox Vaccine Booster</div>
                        <div className="text-[11px] text-amber-800">Scheduled: 2026-10-15 (in 15 days)</div>
                      </div>
                      <Badge variant="warning" size="sm">Due Soon</Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: FEED & FCR */}
              {activeProfileTab === 'FEED' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900">Feed Ration Conversion (FCR)</h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Daily Concentrate Ration:</span>
                      <span className="font-bold text-slate-900">450 grams / day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dry Fodder / Green Bales:</span>
                      <span className="font-bold text-slate-900">2.2 kg / day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mineral Mixture Supplement:</span>
                      <span className="font-bold text-slate-900">15 grams / day</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-600 font-semibold">Estimated Feed Conversion Ratio:</span>
                      <span className="font-bold text-emerald-800">1 : 4.6 (Optimal)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: EXPENSES */}
              {activeProfileTab === 'EXPENSES' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900">Cumulative Expense Ledger</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    <div className="p-2.5 flex justify-between">
                      <span>Initial Intake Purchase</span>
                      <span className="font-bold text-slate-900">₹{selectedGoat.purchasePrice}</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span>Concentrate Pellets & Napier Grass</span>
                      <span className="font-bold text-slate-900">₹{selectedGoat.accumulatedFeedCost}</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span>Vaccines & Dewormers</span>
                      <span className="font-bold text-slate-900">₹{selectedGoat.accumulatedMedicineCost}</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span>Labor & Feeding Wages</span>
                      <span className="font-bold text-slate-900">₹{selectedGoat.accumulatedLaborCost}</span>
                    </div>
                    <div className="p-2.5 flex justify-between bg-slate-50 font-bold">
                      <span>Total Accumulated True Cost</span>
                      <span className="text-emerald-900">₹{selectedGoat.trueCost}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: SALES & VALUATION */}
              {activeProfileTab === 'SALES' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900">Market Valuation & Off-take Readiness</h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Current Scale Weight:</span>
                      <span className="font-bold text-slate-900">{selectedGoat.currentWeightKg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Certified Market Rate:</span>
                      <span className="font-bold text-slate-900">₹{selectedGoat.marketRatePerKg || 460}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Target Off-take Weight:</span>
                      <span className="font-bold text-slate-900">{selectedGoat.targetWeightKg} kg</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-600 font-semibold">Estimated Gross Margin (Profit):</span>
                      <span className="font-bold text-emerald-800 text-sm">
                        +₹{selectedGoat.projectedProfit.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: TIMELINE */}
              {activeProfileTab === 'TIMELINE' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900">Asset Lifecycle Chronicle</h3>
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    <div className="relative">
                      <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">Intake Registration & Ear Tagging</div>
                      <div className="text-[11px] text-slate-500">{selectedGoat.purchaseDate} • Intake Weight: {selectedGoat.initialWeightKg}kg</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-sky-600 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">PPR & Enterotoxemia Vaccination</div>
                      <div className="text-[11px] text-slate-500">2026-05-02 • Vaccinated by Dr. Ramanathan</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-amber-600 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">Growth Milestone: 30kg Reached</div>
                      <div className="text-[11px] text-slate-500">Fattening concentrate diet escalated</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-emerald-700 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">Current Scale: {selectedGoat.currentWeightKg} kg</div>
                      <div className="text-[11px] text-slate-500">{selectedGoat.lastWeighedDate} • ADG: +{selectedGoat.adgGrams} g/day</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: DOCUMENTS & QR CODE */}
              {activeProfileTab === 'DOCUMENTS' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 text-center space-y-3">
                    <div className="h-32 w-32 mx-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                      <QrCode className="h-24 w-24 text-slate-900" />
                      <span className="text-[8px] font-mono font-bold text-slate-600 mt-1">{selectedGoat.tagNumber}</span>
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 font-mono text-sm">{selectedGoat.tagNumber}</div>
                      <div className="text-[11px] text-slate-500">MSK Commercial Goat Farm Ear Tag Passport</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        SECURE TOKEN: MSK-GF-{selectedGoat.id.toUpperCase()}-VERIFIED
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      icon={Printer}
                      onClick={() => window.print()}
                    >
                      Print Ear Tag Passport
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              Select a goat from the registry table to inspect its economic and health record.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
