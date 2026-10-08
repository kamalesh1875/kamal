'use client';

import React from 'react';
import { Scale, Activity, Grid, CheckSquare, Plus, AlertCircle, Syringe, Wheat } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const WeightSubView: React.FC = () => {
  const { weightRecords, goats, setQuickActionModal } = useFarm();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#1B4332]" />
            <span>Growth & ADG Trajectory Log</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {weightRecords.length} Scale Checkpoints
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Average Daily Gain (ADG) calculations based on certified animal scales
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setQuickActionModal('RECORD_WEIGHT')}>
          + Record Weight
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-3">Goat Tag</th>
              <th className="py-3 px-3">Scale Weight (kg)</th>
              <th className="py-3 px-3">Calculated ADG</th>
              <th className="py-3 px-4">Weighing Observation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {weightRecords.map(w => {
              const goat = goats.find(g => g.id === w.goatId);
              return (
                <tr key={w.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono text-slate-600">{w.recordedAt}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{goat?.tagNumber || 'Unknown'}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{w.weightKg} kg</td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-700 font-semibold">+{w.adgGrams} g/day</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{w.notes || 'Routine weigh-in'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const HealthSubView: React.FC = () => {
  const { healthRecords, goats } = useFarm();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#1B4332]" />
          <span>Veterinary & Immunization Schedule</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
            {healthRecords.length} Clinical Protocols
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          PPR, Enterotoxemia (ET), Goat Pox vaccines, and deworming administration
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Administered Date</th>
              <th className="py-3 px-3">Goat Tag</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Protocol / Medicine</th>
              <th className="py-3 px-3">Attending Vet</th>
              <th className="py-3 px-3">Booster Due</th>
              <th className="py-3 px-4 text-right">Cost (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {healthRecords.map(h => {
              const goat = goats.find(g => g.id === h.goatId);
              return (
                <tr key={h.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono text-slate-600">{h.administeredAt}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{goat?.tagNumber || 'Herd'}</td>
                  <td className="py-3 px-3">
                    <Badge size="sm" variant={h.recordType === 'VACCINATION' ? 'success' : 'info'}>
                      {h.recordType}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{h.title} ({h.medicineName})</td>
                  <td className="py-3 px-3 text-slate-600">{h.vetName}</td>
                  <td className="py-3 px-3 font-mono text-amber-700">{h.nextDueDate || '—'}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">₹{h.cost}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const PensSubView: React.FC = () => {
  const { pens, goats } = useFarm();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Grid className="h-5 w-5 text-[#1B4332]" />
          <span>Pen & Shed Facility Management</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
            {pens.length} Shed Sections
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Occupancy tracking, biomass density, and group feeding distribution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pens.map(pen => {
          const penGoats = goats.filter(g => g.penId === pen.id && g.status === 'ACTIVE');
          const totalWeight = Math.round(penGoats.reduce((acc, g) => acc + g.currentWeightKg, 0));
          const avgWeight = penGoats.length > 0 ? (totalWeight / penGoats.length).toFixed(1) : 0;
          const avgADG = penGoats.length > 0 ? Math.round(penGoats.reduce((acc, g) => acc + g.adgGrams, 0) / penGoats.length) : 0;
          const occupancy = Math.round((pen.currentCount / pen.capacity) * 100);

          return (
            <div key={pen.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{pen.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">{pen.notes}</div>
                </div>
                <Badge size="sm" variant={pen.category === 'QUARANTINE' ? 'danger' : 'primary'}>
                  {pen.category}
                </Badge>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    {pen.currentCount} / {pen.capacity} Goats ({pen.capacity - pen.currentCount} Available)
                  </span>
                  <span className="text-slate-500 font-semibold">{occupancy}% Full</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pen.category === 'QUARANTINE' ? 'bg-rose-500' : 'bg-emerald-600'}`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">TOTAL BIOMASS</span>
                  <span className="font-bold text-slate-900">{totalWeight} kg</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">AVG WEIGHT</span>
                  <span className="font-bold text-slate-900">{avgWeight} kg</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <span className="text-[10px] text-emerald-700 block font-semibold">PEN ADG</span>
                  <span className="font-bold text-emerald-800">+{avgADG} g/d</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TasksSubView: React.FC = () => {
  const { tasks, toggleTaskStatus } = useFarm();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-[#1B4332]" />
          <span>Farm Operations & Worker Task Runner</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
            {tasks.filter(t => t.status === 'COMPLETED').length}/{tasks.length} Completed
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Delegated feeding, pen cleaning, quarantine medicine administration, and weighing schedules
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {tasks.map(t => (
          <div key={t.id} className="p-4 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={t.status === 'COMPLETED'}
                onChange={() => toggleTaskStatus(t.id)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <div>
                <span className={`font-semibold text-sm ${t.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {t.title}
                </span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Due: <b className="text-slate-600">{t.dueTime}</b> • Worker: <b className="text-slate-600">{t.assignedWorker}</b>
                </div>
              </div>
            </div>

            <Badge
              size="sm"
              variant={t.priority === 'CRITICAL' ? 'danger' : t.priority === 'HIGH' ? 'warning' : 'neutral'}
            >
              {t.priority}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
