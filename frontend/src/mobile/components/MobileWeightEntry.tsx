'use client';

import React, { useState } from 'react';
import { Scale, CheckCircle2, ChevronRight, Camera, Plus, Minus, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { useMobileSync } from '../hooks/useMobileSync';

interface MobileWeightEntryProps {
  initialGoatId?: string;
  onOpenScanner: () => void;
  onDone?: () => void;
}

export const MobileWeightEntry: React.FC<MobileWeightEntryProps> = ({
  initialGoatId,
  onOpenScanner,
  onDone
}) => {
  const { goats, recordWeight, weightRecords } = useFarm();
  const { queueAction } = useMobileSync();

  const [selectedGoatId, setSelectedGoatId] = useState<string>(
    initialGoatId || goats.find(g => g.status === 'ACTIVE')?.id || goats[0]?.id || ''
  );

  const targetGoat = goats.find(g => g.id === selectedGoatId);
  const [weightInput, setWeightInput] = useState<number>(targetGoat?.currentWeightKg || 30.0);
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<{ msg: string; warning?: string; adg?: number } | null>(null);

  // Stepper adjustments for workers with gloves
  const handleAdjustWeight = (delta: number) => {
    setWeightInput(prev => Math.max(1, parseFloat((prev + delta).toFixed(1))));
  };

  const handleSaveAndNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetGoat) return;

    // Record weight using core method
    const res = recordWeight(targetGoat.id, weightInput, notes || 'Mobile rapid pen scale weigh-in');

    // Also queue into offline action log for resilience
    queueAction(
      'CREATE',
      'WEIGHT',
      targetGoat.id,
      {
        goatId: targetGoat.id,
        weightKg: weightInput,
        notes: notes || 'Mobile rapid pen scale weigh-in',
        recordedAt: new Date().toISOString().substring(0, 10)
      }
    );

    // Compute preview ADG
    const prevRecords = weightRecords
      .filter(w => w.goatId === targetGoat.id)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    const lastRecord = prevRecords[0];
    let computedAdg = targetGoat.adgGrams;
    if (lastRecord) {
      const days = Math.max(1, Math.round((Date.now() - new Date(lastRecord.recordedAt).getTime()) / (1000 * 3600 * 24)));
      computedAdg = Math.round(((weightInput - lastRecord.weightKg) * 1000) / days);
    }

    setFeedback({
      msg: `Recorded: ${targetGoat.tagNumber} is ${weightInput} kg`,
      warning: res.warning,
      adg: computedAdg
    });

    // Select next active goat for continuous fast worker workflow
    const activeGoats = goats.filter(g => g.status === 'ACTIVE');
    const currentIndex = activeGoats.findIndex(g => g.id === targetGoat.id);
    const nextGoat = activeGoats[(currentIndex + 1) % activeGoats.length];

    setTimeout(() => {
      if (nextGoat && nextGoat.id !== targetGoat.id) {
        setSelectedGoatId(nextGoat.id);
        setWeightInput(nextGoat.currentWeightKg);
        setNotes('');
        setFeedback(null);
      } else {
        setFeedback(null);
      }
    }, 1800);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-[#1B4332]" />
            <span>Fast Worker Weight Station</span>
          </h2>
          <p className="text-[11px] text-slate-500">Continuous weigh-in & ADG calculation</p>
        </div>
        <button
          onClick={onOpenScanner}
          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold"
        >
          <Camera className="h-4 w-4" />
          <span>Scan Next</span>
        </button>
      </div>

      {/* Target Animal Card */}
      {targetGoat && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <div className="font-mono text-base font-bold text-slate-900">{targetGoat.tagNumber}</div>
              <div className="text-xs text-slate-500">{targetGoat.breed} • {targetGoat.gender === 'MALE' ? 'Buck' : 'Doe'}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Last Weighed</span>
              <span className="text-xs font-bold text-slate-700">{targetGoat.currentWeightKg} kg</span>
            </div>
          </div>

          {/* Connected Scale Indicator */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-900 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-medium">Scale Bluetooth / Sensor Ready</span>
            </div>
            <button
              type="button"
              onClick={() => {
                // Simulate scale auto-tare reading
                const simulated = parseFloat((targetGoat.currentWeightKg + (Math.random() * 0.4 - 0.1)).toFixed(1));
                setWeightInput(simulated);
              }}
              className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-2xs hover:bg-emerald-100"
            >
              Read Scale
            </button>
          </div>

          {/* Weight Adjuster Input (Touch friendly with large buttons) */}
          <div className="pt-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase block text-center mb-2">
              Current Certified Weight (kg)
            </label>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleAdjustWeight(-0.5)}
                className="h-12 w-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg flex items-center justify-center active:scale-95 transition-all"
              >
                <Minus className="h-5 w-5" />
              </button>

              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={e => setWeightInput(parseFloat(e.target.value) || 0)}
                  className="w-32 py-2 text-center text-3xl font-extrabold font-mono text-slate-900 bg-slate-50 border-2 border-emerald-600/40 rounded-2xl focus:outline-none focus:border-emerald-600"
                />
                <span className="absolute right-2 bottom-3 text-xs text-slate-400 font-bold">kg</span>
              </div>

              <button
                type="button"
                onClick={() => handleAdjustWeight(0.5)}
                className="h-12 w-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg flex items-center justify-center active:scale-95 transition-all"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex justify-center gap-2 mt-3">
              {[-1.0, -0.1, +0.1, +1.0].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAdjustWeight(val)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-semibold"
                >
                  {val > 0 ? `+${val}` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Worker Observation Note */}
          <div className="pt-2">
            <input
              type="text"
              placeholder="Optional scale note (e.g. Empty stomach, good appetite)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:bg-white"
            />
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{feedback.msg}</span>
              </div>
              {feedback.adg !== undefined && (
                <div className="text-[11px] text-emerald-700">
                  New Calculated ADG: <b>+{feedback.adg} g/day</b>
                </div>
              )}
              {feedback.warning && (
                <div className="text-[11px] text-amber-800 font-medium">
                  {feedback.warning}
                </div>
              )}
            </div>
          )}

          {/* Save & Advance Button */}
          <button
            type="button"
            onClick={handleSaveAndNext}
            className="w-full py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#133024] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <span>Save Weight & Next Goat</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
