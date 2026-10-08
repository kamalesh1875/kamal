'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Scale,
  Activity,
  CheckCircle2,
  X,
  Search,
  Plus,
  Minus,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const MobileWorkerModal: React.FC = () => {
  const {
    isMobileWorkerOpen,
    setIsMobileWorkerOpen,
    goats,
    recordWeight,
    addHealthRecord
  } = useFarm();

  const [activeMode, setActiveMode] = useState<'WEIGHT' | 'HEALTH'>('WEIGHT');
  const [searchTag, setSearchTag] = useState('');
  const [selectedGoatId, setSelectedGoatId] = useState(goats[0]?.id || '');
  const [inputWeight, setInputWeight] = useState<number>(30.0);
  const [healthObservation, setHealthObservation] = useState('Routine Observation - Healthy');
  const [healthCost, setHealthCost] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isMobileWorkerOpen) return null;

  const activeGoats = goats.filter(g => g.status !== 'SOLD' && g.status !== 'DECEASED');
  const selectedGoat = goats.find(g => g.id === selectedGoatId) || activeGoats[0];

  const handleSelectGoat = (id: string) => {
    setSelectedGoatId(id);
    const g = goats.find(item => item.id === id);
    if (g) setInputWeight(g.currentWeightKg);
    setFeedbackMsg(null);
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoat) return;

    const res = recordWeight(selectedGoat.id, Number(inputWeight), 'Mobile worker pen scale entry');
    setFeedbackMsg(`Saved: ${selectedGoat.tagNumber} weighed ${inputWeight} kg.`);

    // If warning was returned, show notice
    if (res?.warning) {
      alert(res.warning);
    }

    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleSaveHealth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoat) return;

    addHealthRecord({
      goatId: selectedGoat.id,
      recordType: 'CHECKUP',
      title: healthObservation,
      medicineName: 'Field Observation',
      cost: healthCost,
      administeredAt: new Date().toISOString().substring(0, 10),
      vetName: 'Worker Mobile Observation',
      notes: 'Logged directly in pen via mobile worker mode'
    });

    setFeedbackMsg(`Health note recorded for ${selectedGoat.tagNumber}.`);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <div className="bg-[#11291F] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Field Worker Rapid Entry</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                  Shed Mode
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Touch-friendly scale logging & observation</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileWorkerOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveMode('WEIGHT')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeMode === 'WEIGHT' ? 'bg-white text-[#1B4332] shadow-xs' : 'text-slate-600'
            }`}
          >
            <Scale className="h-4 w-4 text-emerald-700" />
            <span>1. Record Scale Weight</span>
          </button>
          <button
            onClick={() => setActiveMode('HEALTH')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeMode === 'HEALTH' ? 'bg-white text-[#1B4332] shadow-xs' : 'text-slate-600'
            }`}
          >
            <Activity className="h-4 w-4 text-rose-600" />
            <span>2. Health Observation</span>
          </button>
        </div>

        {/* Feedback message banner */}
        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Quick Animal Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Animal Tag</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter tag (e.g. G-00247)..."
                value={searchTag}
                onChange={e => setSearchTag(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Quick Tag Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {activeGoats
                .filter(g => !searchTag || g.tagNumber.toLowerCase().includes(searchTag.toLowerCase()))
                .slice(0, 8)
                .map(g => (
                  <button
                    key={g.id}
                    onClick={() => handleSelectGoat(g.id)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold shrink-0 transition-all ${
                      selectedGoat?.id === g.id
                        ? 'bg-[#1B4332] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {g.tagNumber}
                  </button>
                ))}
            </div>
          </div>

          {/* Selected Goat Details Pill */}
          {selectedGoat && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 font-mono text-sm">{selectedGoat.tagNumber}</span>
                <span className="text-slate-500 block text-[11px]">{selectedGoat.breed} • {selectedGoat.gender}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Previous Scale</span>
                <span className="font-bold text-slate-800 text-sm">{selectedGoat.currentWeightKg} kg</span>
              </div>
            </div>
          )}

          {/* MODE 1: WEIGHT ENTRY */}
          {activeMode === 'WEIGHT' && (
            <form onSubmit={handleSaveWeight} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Scale Reading (kg)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInputWeight(prev => Math.max(1, +(prev - 0.5).toFixed(1)))}
                    className="h-12 w-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-lg text-slate-700 active:scale-95"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={inputWeight}
                    onChange={e => setInputWeight(parseFloat(e.target.value) || 0)}
                    className="flex-1 h-12 text-center text-2xl font-bold rounded-2xl border-2 border-emerald-600 focus:outline-none bg-emerald-50/30 text-emerald-950"
                  />
                  <button
                    type="button"
                    onClick={() => setInputWeight(prev => +(prev + 0.5).toFixed(1))}
                    className="h-12 w-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-lg text-slate-700 active:scale-95"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Quick Stepper Chips */}
              <div className="flex gap-2">
                {[-1.0, -0.2, +0.2, +1.0, +2.0].map(step => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setInputWeight(prev => Math.max(1, +(prev + step).toFixed(1)))}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 font-mono"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>

              <Button variant="primary" size="lg" className="w-full justify-center text-sm font-bold h-12 rounded-2xl">
                Save Scale Checkpoint
              </Button>
            </form>
          )}

          {/* MODE 2: HEALTH OBSERVATION */}
          {activeMode === 'HEALTH' && (
            <form onSubmit={handleSaveHealth} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Common Observations</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Routine Check - Healthy',
                    'Mild nasal discharge',
                    'Off feed / low appetite',
                    'Limping left hind leg',
                    'Deworming due',
                    'Eye redness / watering'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setHealthObservation(opt)}
                      className={`p-2 rounded-xl text-left border text-[11px] font-medium transition-all ${
                        healthObservation === opt
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Specific Observation Notes</label>
                <textarea
                  rows={2}
                  value={healthObservation}
                  onChange={e => setHealthObservation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <Button variant="primary" size="lg" className="w-full justify-center text-sm font-bold h-12 rounded-2xl">
                Save Health Observation
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
