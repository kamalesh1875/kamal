'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Scale,
  Activity,
  Wheat,
  Droplets,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Phone,
  Plus,
  ArrowLeft,
  X,
  Camera
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { useMobileSync } from '../hooks/useMobileSync';

interface MobileGoatHealthProfileProps {
  goatId: string;
  onBack: () => void;
  onOpenAiHealth?: () => void;
}

export const MobileGoatHealthProfile: React.FC<MobileGoatHealthProfileProps> = ({
  goatId,
  onBack,
  onOpenAiHealth
}) => {
  const { goats, pens, weightRecords, healthRecords, addHealthRecord } = useFarm();
  const { queueAction } = useMobileSync();

  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [observationType, setObservationType] = useState('BEHAVIOR');
  const [observationTitle, setObservationTitle] = useState('');
  const [observationCost, setObservationCost] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const goat = goats.find(g => g.id === goatId) || goats[0];
  const pen = pens.find(p => p.id === goat?.penId);

  if (!goat) return null;

  // Mock baseline calculations for demonstration
  const healthRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
    goat.status === 'QUARANTINE' ? 'CRITICAL' : goat.adgGrams < 0 ? 'HIGH' : goat.adgGrams < 50 ? 'MEDIUM' : 'LOW';

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationTitle.trim()) return;

    addHealthRecord({
      goatId: goat.id,
      recordType: 'CHECKUP',
      title: `${observationType}: ${observationTitle}`,
      cost: observationCost,
      administeredAt: new Date().toISOString().substring(0, 10),
      vetName: 'Worker Field Observation',
      notes: 'Logged directly in mobile goat profile'
    });

    queueAction('CREATE', 'HEALTH', goat.id, {
      goatId: goat.id,
      title: `${observationType}: ${observationTitle}`,
      cost: observationCost,
      recordType: 'CHECKUP',
      administeredAt: new Date().toISOString().substring(0, 10)
    });

    setFeedback('Observation logged successfully');
    setIsObservationModalOpen(false);
    setObservationTitle('');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header with Back button */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Herd</span>
        </button>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
          {pen?.name || 'Main Shed'}
        </span>
      </div>

      {/* Main Goat Identity Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold font-mono text-slate-900">{goat.tagNumber}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                healthRiskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                healthRiskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                Risk: {healthRiskLevel}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {goat.breed} • {goat.gender === 'MALE' ? 'Buck' : 'Doe'} • {goat.ageMonths} months
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-emerald-800">{goat.currentWeightKg} kg</span>
            <span className="text-[10px] text-slate-400 block font-semibold">Scale Weight</span>
          </div>
        </div>

        {/* 9 Clinical & Biological Parameters Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-center text-xs">
          <div className="p-2.5 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Daily Gain</span>
            <span className="font-bold text-emerald-700">+{goat.adgGrams} g/d</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Activity</span>
            <span className="font-bold text-slate-800">Normal Active</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Eating</span>
            <span className="font-bold text-emerald-700">1.8 kg/day</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Drinking</span>
            <span className="font-bold text-slate-800">Optimal (4.2L)</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Feces</span>
            <span className="font-bold text-slate-800">Pellet Normal</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Gait</span>
            <span className="font-bold text-slate-800">Symmetric</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Body Score</span>
            <span className="font-bold text-slate-800">BCS 3.5 / 5</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">True Cost</span>
            <span className="font-bold text-slate-900">₹{goat.trueCost.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-2xl">
            <span className="text-[10px] text-emerald-800 block font-semibold uppercase">Market Est.</span>
            <span className="font-bold text-emerald-900">₹{goat.estimatedMarketValue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* 3 Core Quick Actions: [AI Health], [Add Observation], [Contact Vet] */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={onOpenAiHealth}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all"
          >
            <Sparkles className="h-4 w-4 mb-1 text-emerald-700" />
            <span>AI Health</span>
          </button>

          <button
            onClick={() => setIsObservationModalOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            <Plus className="h-4 w-4 mb-1 text-emerald-400" />
            <span>Observation</span>
          </button>

          <a
            href="tel:+919842178910"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all"
          >
            <Phone className="h-4 w-4 mb-1 text-amber-700" />
            <span>Contact Vet</span>
          </a>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Observation Modal */}
      {isObservationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add Field Observation</h3>
              <button
                onClick={() => setIsObservationModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveObservation} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Category</label>
                <select
                  value={observationType}
                  onChange={e => setObservationType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="BEHAVIOR">Behavior / Movement</option>
                  <option value="FECES">Feces Consistency</option>
                  <option value="FEED">Feed Intake</option>
                  <option value="RESPIRATORY">Respiratory / Cough</option>
                  <option value="SKIN">Skin / Wound / Lesion</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe observed state..."
                  value={observationTitle}
                  onChange={e => setObservationTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#1B4332] text-white font-bold"
              >
                Save to Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
