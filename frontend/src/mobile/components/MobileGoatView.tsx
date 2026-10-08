'use client';

import React, { useState } from 'react';
import {
  Search,
  Camera,
  Plus,
  Scale,
  Activity,
  Sparkles,
  ChevronRight,
  Filter,
  Wheat,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

interface MobileGoatViewProps {
  onOpenGoatProfile: (goatId: string) => void;
  onOpenScanner: () => void;
  onOpenWeightEntry: (goatId?: string) => void;
}

export const MobileGoatView: React.FC<MobileGoatViewProps> = ({
  onOpenGoatProfile,
  onOpenScanner,
  onOpenWeightEntry
}) => {
  const { goats, pens, setQuickActionModal } = useFarm();
  const [search, setSearch] = useState('');
  const [selectedPen, setSelectedPen] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredGoats = goats.filter(g => {
    const matchesSearch =
      g.tagNumber.toLowerCase().includes(search.toLowerCase()) ||
      g.breed.toLowerCase().includes(search.toLowerCase()) ||
      (g.rfidTag && g.rfidTag.toLowerCase().includes(search.toLowerCase()));
    const matchesPen = selectedPen === 'ALL' || g.penId === selectedPen;
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    return matchesSearch && matchesPen && matchesStatus;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Search & Scan Action Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ear tag, RFID, breed..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-emerald-600 shadow-2xs"
          />
        </div>

        <button
          onClick={onOpenScanner}
          className="p-2.5 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shrink-0 shadow-2xs active:scale-95"
          title="Open Tag Scanner"
        >
          <Camera className="h-4 w-4" />
        </button>

        <button
          onClick={() => setQuickActionModal('ADD_GOAT')}
          className="p-2.5 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs active:scale-95"
          title="Register Animal"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <button
          onClick={() => setSelectedPen('ALL')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium ${
            selectedPen === 'ALL'
              ? 'bg-[#1B4332] text-white'
              : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          All Pens ({goats.length})
        </button>
        {pens.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPen(p.id)}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-medium ${
              selectedPen === p.id
                ? 'bg-[#1B4332] text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Goat Cards Stream */}
      <div className="space-y-2.5">
        {filteredGoats.map(goat => {
          const pen = pens.find(p => p.id === goat.penId);
          return (
            <div
              key={goat.id}
              onClick={() => onOpenGoatProfile(goat.id)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between active:bg-slate-50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                  🐐
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {goat.tagNumber}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        goat.status === 'QUARANTINE'
                          ? 'bg-rose-100 text-rose-800'
                          : goat.status === 'SOLD'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {goat.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {goat.breed} • {pen?.name || 'Shed'} • {goat.gender === 'MALE' ? 'Buck' : 'Doe'}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 flex items-center gap-2">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{goat.currentWeightKg} kg</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">+{goat.adgGrams} g/d</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
