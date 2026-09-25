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
  QrCode
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
  const [activeProfileTab, setActiveProfileTab] = useState<'OVERVIEW' | 'WEIGHT' | 'HEALTH' | 'COST_ENGINE' | 'TIMELINE'>('OVERVIEW');

  // Filtered List
  const filteredGoats = goats.filter(g => {
    const matchesSearch =
      g.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.rfidTag?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBreed = breedFilter === 'ALL' || g.breed === breedFilter;
    const matchesGender = genderFilter === 'ALL' || g.gender === genderFilter;
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    return matchesSearch && matchesBreed && matchesGender && matchesStatus;
  });

  const selectedGoat = goats.find(g => g.id === selectedGoatId) || filteredGoats[0] || goats[0];
  const goatWeights = selectedGoat ? weightRecords.filter(w => w.goatId === selectedGoat.id).sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()) : [];
  const goatHealth = selectedGoat ? healthRecords.filter(h => h.goatId === selectedGoat.id) : [];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Living Asset Registry</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {goats.length} Animals Tracked
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
            onClick={() => alert('Exporting Goats CSV Manifest...')}
          >
            Export Manifest
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

      {/* Main Split Interface: Data Table on Left/Top, Deep Economic Profile on Right/Bottom */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ENTERPRISE DATA TABLE */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tag (G-247), breed, RFID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <div className="flex items-center gap-2">
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
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Tag ID</th>
                  <th className="py-3 px-3">Breed & Sex</th>
                  <th className="py-3 px-3">Weight (kg)</th>
                  <th className="py-3 px-3">ADG (g/d)</th>
                  <th className="py-3 px-3">True Cost</th>
                  <th className="py-3 px-3">Market Value</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGoats.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No goats found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredGoats.map(goat => {
                    const isSelected = selectedGoat?.id === goat.id;
                    return (
                      <tr
                        key={goat.id}
                        onClick={() => setSelectedGoatId(goat.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/70 border-l-4 border-l-[#1B4332]' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{goat.tagNumber}</div>
                          {goat.rfidTag && (
                            <div className="text-[10px] text-slate-400 font-mono">{goat.rfidTag.replace('RFID-', '')}</div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-900">{goat.breed}</div>
                          <div className="text-[11px] text-slate-500">
                            {goat.gender === 'MALE' ? '♂ Buck' : '♀ Doe'} • {goat.ageMonths}m
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {goat.currentWeightKg} <span className="text-[10px] font-normal text-slate-400">kg</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center text-xs font-semibold ${
                            goat.adgGrams >= 200 ? 'text-emerald-700' : goat.adgGrams > 0 ? 'text-amber-700' : 'text-slate-500'
                          }`}>
                            +{goat.adgGrams}g
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          ₹{goat.trueCost.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          ₹{goat.estimatedMarketValue.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
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
                        <td className="py-3 px-3 text-right">
                          <ChevronRight className={`h-4 w-4 inline-block ${isSelected ? 'text-[#1B4332]' : 'text-slate-300'}`} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: THE GOAT ECONOMIC PROFILE UX */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
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
                        {selectedGoat.breed} • {selectedGoat.gender === 'MALE' ? 'Male Buck' : 'Female Doe'} • {selectedGoat.ageMonths} Months Old
                      </p>
                    </div>
                  </div>

                  <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-center">
                    <QrCode className="h-6 w-6 text-slate-700 mx-auto" />
                    <span className="text-[9px] font-mono text-slate-400 block mt-0.5">SCAN TAG</span>
                  </div>
                </div>

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

              {/* Subtabs Navigation */}
              <div className="flex border-b border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setActiveProfileTab('OVERVIEW')}
                  className={`px-3 py-2 border-b-2 transition-all ${
                    activeProfileTab === 'OVERVIEW' ? 'border-[#1B4332] text-[#1B4332]' : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Overview & Economics
                </button>
                <button
                  onClick={() => setActiveProfileTab('WEIGHT')}
                  className={`px-3 py-2 border-b-2 transition-all ${
                    activeProfileTab === 'WEIGHT' ? 'border-[#1B4332] text-[#1B4332]' : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Growth Chart
                </button>
                <button
                  onClick={() => setActiveProfileTab('HEALTH')}
                  className={`px-3 py-2 border-b-2 transition-all ${
                    activeProfileTab === 'HEALTH' ? 'border-[#1B4332] text-[#1B4332]' : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Health & Vaccines
                </button>
                <button
                  onClick={() => setActiveProfileTab('TIMELINE')}
                  className={`px-3 py-2 border-b-2 transition-all ${
                    activeProfileTab === 'TIMELINE' ? 'border-[#1B4332] text-[#1B4332]' : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Timeline
                </button>
              </div>

              {/* TAB 1: OVERVIEW & COST ENGINE */}
              {activeProfileTab === 'OVERVIEW' && (
                <div className="space-y-4 text-xs">
                  {/* True Cost Breakdown Engine Card */}
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
                        <span>General Shed Maintenance:</span>
                        <span className="font-semibold text-slate-900">₹{selectedGoat.accumulatedOverheadCost.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-emerald-800">Net Estimated Margin:</span>
                      <span className="font-bold text-emerald-800 text-sm">
                        +₹{selectedGoat.projectedProfit.toLocaleString('en-IN')} ({Math.round((selectedGoat.projectedProfit / selectedGoat.trueCost) * 100)}%)
                      </span>
                    </div>
                  </div>

                  {/* Pedigree & Pen Card */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-slate-200 bg-white">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Housed In</span>
                      <span className="text-xs font-bold text-slate-900 block mt-1">
                        {pens.find(p => p.id === selectedGoat.penId)?.name || 'General Shed'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-white">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Target Sale Weight</span>
                      <span className="text-xs font-bold text-slate-900 block mt-1">
                        {selectedGoat.targetWeightKg} kg ({Math.max(0, Number((selectedGoat.targetWeightKg - selectedGoat.currentWeightKg).toFixed(1)))} kg left)
                      </span>
                    </div>
                  </div>

                  {selectedGoat.notes && (
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-amber-950">
                      <span className="font-semibold block mb-0.5 text-[11px]">Farm Manager Notes:</span>
                      <p className="text-[11px] leading-relaxed text-amber-900">{selectedGoat.notes}</p>
                    </div>
                  )}

                  <div className="pt-2 flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      icon={Scale}
                      onClick={() => setQuickActionModal('RECORD_WEIGHT')}
                    >
                      Record New Weight
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 2: WEIGHT PROGRESSION CHART */}
              {activeProfileTab === 'WEIGHT' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Recorded Weight Trajectory</h3>
                    <span className="text-[11px] text-slate-400">{goatWeights.length} weigh-ins logged</span>
                  </div>

                  <div className="h-56 w-full">
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

                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {goatWeights.map((w, idx) => (
                      <div key={w.id} className="p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{w.weightKg} kg</span>
                          <span className="text-[11px] text-slate-400">({w.recordedAt})</span>
                        </div>
                        <span className="text-emerald-700 font-semibold">
                          {idx === 0 ? 'Intake baseline' : `+${w.adgGrams} g/day`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: HEALTH & VACCINES */}
              {activeProfileTab === 'HEALTH' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Veterinary & Immunization Record</h3>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Immunity Verified</span>
                  </div>

                  <div className="space-y-2">
                    {goatHealth.length === 0 ? (
                      <p className="text-slate-400 py-4 text-center">No specific vet logs for this goat yet.</p>
                    ) : (
                      goatHealth.map(h => (
                        <div key={h.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{h.title}</span>
                            <span className="font-semibold text-slate-700">₹{h.cost}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {h.medicineName} ({h.dosage}) • {h.vetName}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                            <span>Administered: {h.administeredAt}</span>
                            {h.nextDueDate && <span className="text-amber-700 font-medium">Booster Due: {h.nextDueDate}</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CHRONOLOGICAL TIMELINE */}
              {activeProfileTab === 'TIMELINE' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900">Asset Lifecycle Chronicle</h3>
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    <div className="relative">
                      <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">Intake Registration</div>
                      <div className="text-[11px] text-slate-500">{selectedGoat.purchaseDate} • Purchased for ₹{selectedGoat.purchasePrice}</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-sky-600 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">Vaccine Administered (Raksha PPR)</div>
                      <div className="text-[11px] text-slate-500">2026-05-02 • Cost allocated ₹150</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-amber-600 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">Feed Ration Boosted (Concentrate)</div>
                      <div className="text-[11px] text-slate-500">2026-07-15 • Cumulative feed cost crossed ₹2,500</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-emerald-700 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">Market Weight Achieved: {selectedGoat.currentWeightKg} kg</div>
                      <div className="text-[11px] text-slate-500">{selectedGoat.lastWeighedDate} • Estimated Profit: ₹{selectedGoat.projectedProfit}</div>
                    </div>
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
